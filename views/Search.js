import {Button, Input} from '@rneui/themed';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import colors from '../config/colors';

const Search = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      mode: 'onChange',
    },
  });
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity>
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
          onPress={handleSubmit(Search)}
          color={colors.secondary}
        />
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
