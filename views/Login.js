import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Image, Text} from '@rneui/themed';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import colors from '../config/colors';
import Input from 'react-native-input-style';

// Login function is called when the login button is pressed
const Login = ({navigation, route}) => {
  const [isRegister, setisRegister] = useState(route.params.register);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.card}>
        <Image
          style={styles.logo}
          source={require('../assets/renewLogo.png')}
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
  scrollView: {
    backgroundColor: colors.lightgreen,
  },
  container: {
    padding: 16,
    flex: 1,
  },
  card: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 10,
  },
  logo: {
    width: 250,
    height: 250,
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
