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

// Login function is called when the login button is pressed
const Login = ({navigation, route}) => {
  const [isRegister, setisRegister] = useState(route.params.register);

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
