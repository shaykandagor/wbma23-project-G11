import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Card, Image, Input, ListItem, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import colors from '../config/colors';
import {useMedia} from '../hooks/ApiHooks';
import moment from 'moment';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';

//
const Search = ({navigation}) => {
  const [search, setSearch] = useState([]);
  const {searchMedia} = useMedia();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      mode: 'onChange',
    },
  });

  const searchItem = async (searchData) => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    const {title} = searchData;
    // console.log('Search button pressed', {title});
    try {
      const searchResult = await searchMedia({title}, userToken);
      // console.log('searchItem', searchResult);
      setSearch(searchResult);
      setLoading(false);
    } catch (error) {
      console.error('searchItem', error);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <Card>
          <Card.Title> Search for an item</Card.Title>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'Search title is required.'},
              minLength: {
                value: 3,
                message: 'Search title min length is 3 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Search for an item"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.title && errors.title.message}
              />
            )}
            name="title"
          />
          <Button
            title="SEARCH"
            buttonStyle={{
              backgroundColor: colors.secondary,
              borderWidth: 0,
              borderColor: 'transparent',
              borderRadius: 30,
            }}
            containerStyle={{
              width: 350,
              marginHorizontal: 50,
              marginVertical: 10,
              alignSelf: 'center',
            }}
            titleStyle={{fontWeight: 'bold'}}
            onPress={handleSubmit(searchItem)}
          />
          {loading && <ActivityIndicator size="large" />}
        </Card>
      </KeyboardAvoidingView>

      <ScrollView>
        {search.map((item, index) => {
          const {description, time_added: timeAdded, title, filename} = item;
          // console.log(description, timeAdded, title);
          return (
            <View key={index}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Single', item);
                }}
              >
                <Card>
                  <Card.Title>{title}</Card.Title>
                  <Card.Divider />

                  <View style={styles.user}>
                    <Image
                      style={styles.image}
                      resizeMode="cover"
                      source={{uri: uploadsUrl + filename}}
                    />

                    <ListItem.Content>
                      <ListItem.Title>
                        <Text>{description}</Text>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        <Text>{moment(timeAdded).format('Do MMMM YYYY')}</Text>
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightgreen,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
    justifyContent: 'space-between',
    fontSize: 16,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
