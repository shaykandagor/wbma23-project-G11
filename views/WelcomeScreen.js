import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import colors from '../config/colors';
import {Text} from '@rneui/themed';

function WelcomeScreen({navigation}) {
  const handleRegistrationPress = () => {
    navigation.navigate('Login');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('../assets/welcome_img.jpeg')}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Giving Second Home to Great Stuff</Text>
      </View>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegistrationPress}
      >
        <Text style={styles.buttonText}>Create an account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

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
    top: 100,
    alignItems: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    width: '100%',
    height: 70,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    height: 70,
    backgroundColor: colors.lightgray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
