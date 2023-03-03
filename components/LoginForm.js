import React, {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthentication} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input} from '@rneui/themed';
import {View, StyleSheet} from 'react-native';
import colors from '../config/colors';

const LoginForm = () => {
  // Retrieve setIsLoggedIn and setUser from MainContext using useContext hook
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  // Import postLogin function from useAuthentication custom hook
  const {postLogin} = useAuthentication();

  // Define control and form validation variables using useForm hook
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

  // Handle login button press
  const logIn = async (loginData) => {
    console.log('Login button pressed', loginData);
    // const data = {username: 'shaynek', password: 'secret254'};
    // So if the user logs in again the device has the user's data therefore a successfull login
    try {
      // Call postLogin function to attempt login with user credentials
      const loginResult = await postLogin(loginData);
      console.log('logIn', loginResult);

      // Save user token to AsyncStorage
      await AsyncStorage.setItem('userToken', loginResult.token);

      // Set user in MainContext and set isLoggedIn to true to update app state
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
        {/* Render username input field with form validation */}
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Username is required.'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Username"
              leftIcon={{
                name: 'person',
                color: colors.lightgray,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.username && errors.username.message}
            />
          )}
          name="username"
        />
        {/* Render password input field with form validation */}
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Password is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Password"
              onBlur={onBlur}
              leftIcon={{
                name: 'lock',
                color: colors.lightgray,
              }}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              errorMessage={errors.password && errors.password.message}
            />
          )}
          name="password"
        />
        {/* Render login button */}
        <Button
          title="LOG IN"
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
          onPress={handleSubmit(logIn)}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginForm;
