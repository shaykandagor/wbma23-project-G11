import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Card, Image, Input, Text} from '@rneui/themed';
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

//
const Search = ({navigation}) => {
  const [search, setSearch] = useState([]);
  const {searchMedia} = useMedia();
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
    const userToken = await AsyncStorage.getItem('userToken');
    const {title} = searchData;
    // console.log('Search button pressed', {title});
    try {
      const searchResult = await searchMedia({title}, userToken);
      // console.log('searchItem', searchResult);
      setSearch(searchResult);
    } catch (error) {
      console.error('searchItem', error);
    }
  };

  return (
    <View>
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
            title="Search"
            onPress={handleSubmit(searchItem)}
            color={colors.secondary}
          />
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
                    <Text style={styles.name}>{description}</Text>
                    <Text style={styles.name}>
                      {moment(timeAdded).format('Do MMMM YYYY')}
                    </Text>
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
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
