import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from './LoginForm';

// Login function is called when the login button is pressed
const Login = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);
  const {getUserByToken} = useUser();

  // Saves the value of userToken saved in AsyncStorage as userToken
  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // If no there is no token available, do nothing
      if (userToken === null) return;
      const userData = await getUserByToken(userToken);
      console.log('checkToken', userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <LoginForm />
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
