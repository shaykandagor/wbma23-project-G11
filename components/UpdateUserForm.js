import React, {useContext, useEffect, useState} from 'react';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button, Card} from '@rneui/themed';
import {View, StyleSheet} from 'react-native';
import colors from '../config/colors';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const UpdateUserForm = ({navigation}) => {
  const [token, setToken] = useState('');
  const {user, setUser} = useContext(MainContext);
  const [updated, setUpdated] = useState(false);
  const {putUser, getUserByToken} = useUser();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setToken(userToken);
        const response = await getUserByToken(userToken);
        setUser(response);
        setUpdated(false);
        // const {full_name, username, user_id, email} = response;
        // reset({full_name, email});
        // console.log('User token', userData);
      } catch (error) {
        console.log('Fetch user info', error);
      }
    };
    fetchUserInfo();
  }, [updated]);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      full_name: user.full_name,
      email: user.email,
      phone_number: '',
      address: '',
    },
    mode: 'onBlur',
  });

  const updateUser = async (userData) => {
    const {full_name, email, phone_number, address} = userData;
    const profileInfo = {full_name, email};
    const extraProfileInfo = {phone_number, address};
    try {
      const updateMessage = await putUser(profileInfo, token);
      console.log(updateMessage);
      setUpdated(true);
      console.log(navigation);
      navigation.navigate('Profile');
    } catch (error) {
      console.error('updateUser', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>RENEW</Card.Title>
        <Controller
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: 'Full name min length is 3 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Full name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
              errorMessage={errors.full_name && errors.full_name.message}
            />
          )}
          name="full_name"
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Email is required.'},
            pattern: {
              value: /^[a-z0-9.-]{1,64}@[a-z0-9.-]{3,64}/i,
              message: 'Must be a valid email',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.email && errors.email.message}
            />
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Phone Number is required.'},
            // pattern: {
            //   value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
            //   message:
            //     'Min 12 characters, needs one number and one uppercase letter',
            // },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Phone Number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.phone_number && errors.phone_number.message}
            />
          )}
          name="phone_number"
        />
        <Controller
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: 'Address min length is 3 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          )}
          name="address"
        />
        <Button
          title="UPDATE"
          buttonStyle={{
            backgroundColor: colors.secondary,
            borderWidth: 0,
            borderColor: 'transparent',
            borderRadius: 30,
          }}
          containerStyle={{
            width: 300,
            marginHorizontal: 50,
            marginVertical: 10,
            alignSelf: 'center',
          }}
          titleStyle={{fontWeight: 'bold'}}
          onPress={handleSubmit(updateUser)}
        />
      </Card>
    </View>
  );
};

UpdateUserForm.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {},
  logo: {
    width: 250,
    height: 200,
  },
});

export default UpdateUserForm;
