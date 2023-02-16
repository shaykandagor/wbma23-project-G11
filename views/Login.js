import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Login function is called when the login button is pressed
const Login = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);

  const logIn = async () => {
    console.log('Login button pressed');
    setIsLoggedIn(true);
    // Used to save the data of the user as a token
    // So if the user logs in again the device has the user's data therefore a successfull login
    try {
      await AsyncStorage.setItem('userToken', 'abc123');
    } catch (error) {
      console.error('error in storing token', error);
    }
  };
  // Saves the value of userToken saved in AsyncStorage as userToken
  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === 'abc123') {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('no valid token available');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Button title="Sign in!" onPress={logIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
