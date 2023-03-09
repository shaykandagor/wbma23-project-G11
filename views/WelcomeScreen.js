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
      const {full_name: fullName} = userData;
      const {full_name, phone_number, address} = JSON.parse(fullName);
      delete userData.full_name;
      const userInfo = {...userData, full_name, phone_number, address};
      setUser(userInfo);
      console.log('checkToken', userInfo);
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
          source={require('../assets/renewLogo.png')}
        ></Image>
      </View>
      <TouchableOpacity style={styles.registerButton}>
        <Button
          title="REGISTER"
          buttonStyle={{
            backgroundColor: colors.primary,
            borderWidth: 0,
            borderColor: 'transparent',
            borderRadius: 30,
          }}
          containerStyle={{
            width: 350,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          titleStyle={{fontWeight: 'bold'}}
          onPress={handleRegistrationPress}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton}>
        <Button
          title="LOGIN"
          buttonStyle={{
            backgroundColor: colors.primary,
            borderWidth: 0,
            borderColor: 'transparent',
            borderRadius: 30,
          }}
          containerStyle={{
            width: 350,
            marginHorizontal: 50,
            marginVertical: 10,
            marginBottom: 30,
          }}
          titleStyle={{fontWeight: 'bold'}}
          onPress={handleLoginPress}
        />
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
    top: 70,
  },
  logo: {
    width: 400,
    height: 400,
  },
  logoText: {
    color: colors.black,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

WelcomeScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default WelcomeScreen;
