import React, {useContext, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {Button, Text} from '@rneui/themed';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import colors from '../config/colors';

// Login function is called when the login button is pressed
const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const [toggleForm, setToggleForm] = useState(true);

  // Saves the value of userToken saved in AsyncStorage as userToken
  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // If no there is no token available, do nothing
      if (userToken === null) return;
      const userData = await getUserByToken(userToken);
      console.log('checkToken', userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <KeyboardAvoidingView style={styles.container}>
          {toggleForm ? <LoginForm /> : <RegisterForm />}
          <Text>
            {toggleForm ? 'No account yet?' : 'Already have an account?'}
          </Text>
          <Button
            type="clear"
            title={toggleForm ? 'Register' : 'Login'}
            onPress={() => {
              setToggleForm(!toggleForm);
            }}
            color={colors.secondary}
          />
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.lightgray,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
