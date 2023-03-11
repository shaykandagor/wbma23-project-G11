import React, {useContext, useEffect, useState} from 'react';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button, Card} from '@rneui/themed';
import {View, StyleSheet} from 'react-native';
import colors from '../config/colors';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import * as ImagePicker from 'expo-image-picker';
import {useFocusEffect} from '@react-navigation/native';

const UpdateUserForm = ({navigation}) => {
  const [token, setToken] = useState('');
  const {user, setUser} = useContext(MainContext);
  const [updated, setUpdated] = useState(false);
  const {putUser, getUserByToken} = useUser();
  const [avatar, setAvatar] = useState('');
  const {postMedia} = useMedia();
  const {postTag} = useTag();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      address: user.address,
    },
    mode: 'onBlur',
  });

  const pickFile = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateUser = async (userData) => {
    const {full_name, email, phone_number, address} = userData;
    const fullName = JSON.stringify({phone_number, address, full_name});
    const profileInfo = {full_name: fullName, email};
    try {
      const updateMessage = await putUser(profileInfo, token);
      console.log(updateMessage);
      const formData = new FormData();
      formData.append('file', {
        uri: avatar,
        name: 'file',
        type: 'image/jpg',
      });
      formData.append('title', avatar);
      const {file_id} = await postMedia(formData, token);
      await postTag({file_id, tag: 'avatar_' + user.user_id}, token);
      setUpdated(true);
      navigation.navigate('Profile');
    } catch (error) {
      console.error('updateUser', error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      setToken(userToken);
      if (updated) {
        try {
          const response = await getUserByToken(userToken);
          const {full_name: fullName} = response;
          const {full_name, phone_number, address} = JSON.parse(fullName);
          delete response.full_name;
          const userInfo = {...response, full_name, phone_number, address};
          console.log('User Info', userInfo);
          setUser(userInfo);
          setUpdated(false);
          // const {full_name, username, user_id, email} = response;
          // reset({full_name, email});
          // console.log('User token', userData);
        } catch (error) {
          console.log('Fetch user info', error);
        }
      }
    };
    fetchUserInfo();
  }, [updated]);

  return (
    <View style={styles.container}>
      <Card containerStyle={{marginTop: 50, borderRadius: 20}}>
        <Card.Title>Update Profile</Card.Title>
        <View style={{position: 'relative', alignItems: 'center'}}>
          <Card.Image
            style={styles.imagestyle}
            placeholderStyle={{}}
            onPress={pickFile}
            source={{
              uri:
                avatar ||
                'https://t4.ftcdn.net/jpg/04/81/13/43/240_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg',
            }}
          />
        </View>
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
        <Button
          title="UPDATE"
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
          onPress={handleSubmit(updateUser)}
        />
      </Card>
    </View>
  );
};

UpdateUserForm.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 250,
    height: 200,
  },
  imagestyle: {
    resizeMode: 'center',
    height: 150,
    width: 150,
    marginBottom: 20,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
});

export default UpdateUserForm;
