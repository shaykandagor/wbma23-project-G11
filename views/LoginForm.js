import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Button, Text, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthentication} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Controller, useForm} from 'react-hook-form';

const LoginForm = (props) => {
  const {setIsLoggedIn} = useContext(MainContext);
  const {postLogin} = useAuthentication();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const logIn = async (loginData) => {
    console.log('Login button pressed', loginData);
    console.log('validate errors', errors);
    // const data = {username: 'shaynek', password: 'secret254'};
    // Used to save the data of the user as a token
    // So if the user logs in again the device has the user's data therefore a successfull login
    try {
      const loginResult = await postLogin(loginData);
      console.log('logIn', loginResult);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('LogIn', error);
      // TODO: Notify user about failed login attempt
    }
  };

  return (
    <View>
      <Text>Login Form</Text>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 3,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
      />
      {errors.username?.type === 'required' && <Text>is required</Text>}
      {errors.username?.type === 'minLength' && (
        <Text>min length is 3 characters</Text>
      )}
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 5,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
          />
        )}
        name="password"
      />
      {errors.password && <Text>Password (min, 5 chars) is required.</Text>}
      <Button title="Sign in!" onPress={handleSubmit(logIn)} />
    </View>
  );
};

LoginForm.propTypes = {};

export default LoginForm;
