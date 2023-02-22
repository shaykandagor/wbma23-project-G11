import {Image, Text} from '@rneui/themed';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../config/colors';
import PropTypes from 'prop-types';

function WelcomeScreen({navigation}) {
  return (
    <Image
      style={styles.background}
      source={require('../assets/welcome_img.jpeg')}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/renewlogo.jpg')}
        />
        <Text color="white">Giving Second Home to Great Stuff</Text>
      </View>
      <View style={styles.registerButton}>
        <Text>Create an account</Text>
      </View>
      <View style={styles.loginButton}>
        <Text>Sign In</Text>
      </View>
    </Image>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    height: 70,
    backgroundColor: colors.lightgray,
  },
  registerButton: {
    width: '100%',
    height: 70,
    backgroundColor: colors.secondary,
  },
  logo: {
    width: 150,
    height: 100,
  },
  logoContainer: {
    position: 'absolute',
    top: 150,
    alignItems: 'center',
  },
});

WelcomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default WelcomeScreen;
