import React, {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthentication} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Image, Input} from '@rneui/themed';
import {View, StyleSheet} from 'react-native';
import colors from '../config/colors';

const LoginForm = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
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
    // const data = {username: 'shaynek', password: 'secret254'};
    // Used to save the data of the user as a token
    // So if the user logs in again the device has the user's data therefore a successfull login
    try {
      const loginResult = await postLogin(loginData);
      console.log('logIn', loginResult);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setUser(loginResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('LogIn', error);
      // TODO: Notify user about failed login attempt
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>RENEW</Card.Title>
        <Image
          style={styles.logo}
          source={require('../assets/renewlogo.jpg')}
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Username is required.'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.username && errors.username.message}
            />
          )}
          name="username"
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Password is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              errorMessage={errors.password && errors.password.message}
            />
          )}
          name="password"
        />
        <Button
          title="LOG IN"
          onPress={handleSubmit(logIn)}
          color={colors.secondary}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightgray,
  },
  logo: {
    width: 300,
    height: 250,
    justifyContent: 'center',
  },
});

export default LoginForm;
