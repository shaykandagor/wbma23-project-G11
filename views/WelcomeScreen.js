import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import colors from '../config/colors';
import {Button, Image, Text} from '@rneui/themed';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({navigation, route}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const {isLoggedIn} = useContext(MainContext);
  console.log(isLoggedIn);
  const handleRegistrationPress = () => {
    navigation.navigate('Login', {register: false});
  };

  const handleLoginPress = () => {
    navigation.navigate('Login', {register: true});
  };

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
    <ImageBackground
      style={styles.background}
      resizeMode="cover"
      source={require('../assets/welcome.jpg')}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/renewlogo.jpg')}
        ></Image>
        <Text style={styles.logoText}>Giving Second Home to Great Stuff</Text>
      </View>
      <TouchableOpacity style={styles.registerButton}>
        <Button
          title="CREATE AN ACCOUNT"
          color={colors.secondary}
          style={styles.buttonText}
          onPress={handleRegistrationPress}
        ></Button>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton}>
        <Button
          title="LOG IN IF YOU HAVE AN ACCOUNT"
          color={colors.secondary}
          style={styles.buttonText}
          onPress={handleLoginPress}
        ></Button>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: 100,
  },
  logo: {
    width: 250,
    height: 200,
  },
  logoText: {
    color: colors.black,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
});

WelcomeScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default WelcomeScreen;
