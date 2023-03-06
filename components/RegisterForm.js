import React from 'react';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button, Card} from '@rneui/themed';
import {View, StyleSheet} from 'react-native';
import colors from '../config/colors';

const RegisterForm = () => {
  // Destructuring postUser and checkUsername from the custom hook useUser
  const {postUser, checkUsername} = useUser();

  // Destructuring the useForm hook and getting values, errors, handleSubmit, and control from it.
  const {
    control,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      phone_number: '',
      address: '',
    },
    mode: 'onBlur',
  });

  // Function to handle registration
  const register = async (registerData) => {
    // Removing confirmPassword from the data because the field doesn't exist in the backend
    delete registerData.confirmPassword;
    delete registerData.phone_number;
    delete registerData.address;
    console.log('Registering', registerData);
    try {
      // Calling postUser function with the registerData
      const registerResult = await postUser(registerData);
      console.log('registeration result', registerResult);
    } catch (error) {
      console.error('register', error);
      // TODO: Notify user about failed registration attempt
    }
  };

  // Function to check if the entered username is available or not
  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('checkUser', userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        {/* Using Controller component to wrap the Input component and get the
        value and errors */}
        <Controller
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: 'Full name min length is 3 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Full name"
              leftIcon={{
                name: 'badge',
                color: colors.lightgray,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
              errorMessage={errors.full_name && errors.full_name.message}
            />
          )}
          name="full_name"
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Email is required.'},
            pattern: {
              value: /^[a-z0-9.-]{1,64}@[a-z0-9.-]{3,64}/i,
              message: 'Must be a valid email',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Email"
              onBlur={onBlur}
              leftIcon={{
                name: 'mail',
                color: colors.lightgray,
              }}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.email && errors.email.message}
            />
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Username is required.'},
            minLength: {
              value: 3,
              message: 'Username min length is 3 characters.',
            },
            validate: {checkUser},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Username"
              leftIcon={{
                name: 'person',
                color: colors.lightgray,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.username && errors.username.message}
            />
          )}
          name="username"
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Password is required.'},
            pattern: {
              value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
              message:
                'Min 5 characters, needs one number and one uppercase letter',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Password"
              leftIcon={{
                name: 'lock',
                color: colors.lightgray,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              errorMessage={errors.password && errors.password.message}
            />
          )}
          name="password"
        />
        <Controller
          control={control}
          rules={{
            validate: (value) => {
              if (value === getValues('password')) {
                return true;
              } else {
                return 'passwords must match';
              }
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Confirm Password"
              leftIcon={{
                name: 'lock',
                color: colors.lightgray,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              errorMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          )}
          name="confirmPassword"
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Phone Number is required.'},
            // pattern: {
            //   value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
            //   message:
            //     'Min 12 characters, needs one number and one uppercase letter',
            // },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Phone Number"
              leftIcon={{
                name: 'call',
                color: colors.lightgray,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.phone_number && errors.phone_number.message}
            />
          )}
          name="phone_number"
        />
        <Controller
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: 'Address min length is 3 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Address"
              leftIcon={{
                name: 'pin-drop',
                color: colors.lightgray,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          )}
          name="address"
        />
        {/* Render sign in button */}
        <Button
          title="SIGN IN"
          buttonStyle={{
            backgroundColor: colors.secondary,
            borderWidth: 0,
            borderColor: 'transparent',
            borderRadius: 30,
          }}
          containerStyle={{
            width: 300,
            marginHorizontal: 50,
            marginVertical: 10,
            alignSelf: 'center',
          }}
          titleStyle={{fontWeight: 'bold'}}
          onPress={handleSubmit(register)}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  logo: {
    width: 250,
    height: 200,
  },
});

export default RegisterForm;
