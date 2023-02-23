import React from 'react';
import PropTypes from 'prop-types';
import colors from '../config/colors';
import {Button, Image, Text} from '@rneui/themed';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

const WelcomeScreen = ({navigation}) => {
  const handleRegistrationPress = () => {
    navigation.navigate('Login');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

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
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegistrationPress}
      >
        <Button
          title="CREATE AN ACCOUNT"
          color={colors.secondary}
          style={styles.buttonText}
        ></Button>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Button
          title="LOG IN IF YOU HAVE AN ACCOUNT"
          color={colors.secondary}
          style={styles.buttonText}
        ></Button>
      </TouchableOpacity>
    </ImageBackground>
  );
};

WelcomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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

export default WelcomeScreen;
