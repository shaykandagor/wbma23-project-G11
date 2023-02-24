import React, {useContext, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {Button, Image, Text} from '@rneui/themed';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import colors from '../config/colors';

// Login function is called when the login button is pressed
const Login = ({navigation, route}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [isRegister, setisRegister] = useState(route.params.register);

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
      <View style={styles.card}>
        <Image
          style={styles.logo}
          source={require('../assets/renewlogo.jpg')}
        />
      </View>

      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <KeyboardAvoidingView style={styles.container}>
          {isRegister ? <LoginForm /> : <RegisterForm />}
          <View style={styles.text}>
            <Text>
              {isRegister ? 'No account yet?' : 'Already have an account?'}
            </Text>
            <Button
              type="clear"
              title={isRegister ? 'Register' : 'Login'}
              onPress={() => {
                setisRegister(!isRegister);
              }}
              color={colors.secondary}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.lightgreen,
    flex: 1,
  },
  card: {
    backgroundColor: colors.lightgreen,
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 250,
    height: 200,
  },
  text: {
    paddingTop: 30,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 50,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Login;
