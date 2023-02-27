import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Card, Input} from '@rneui/themed';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import colors from '../config/colors';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';

const Search = () => {
  const [search, setSearch] = useState('');
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
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
    console.log('Search button pressed', searchData);
    try {
      const searchResult = await searchMedia(searchData);
      console.log('searchItem', searchResult);
      await AsyncStorage.setItem('userToken', searchResult.token);
      setUser(searchResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('searchItem', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity>
        <Card>
          <Card.Title> Search for an item</Card.Title>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'Title is required.'},
              minLength: {
                value: 3,
                message: 'Title min length is 3 characters.',
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
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Search;
