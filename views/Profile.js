import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Text, Button, Image} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const Profile = () => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      // Getting the latest profile if you have uploaded many files
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar failed', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Image style={styles.image} source={{uri: uploadsUrl + avatar}} />
      <Text>Full Name: {user.full_name}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
      <Button
        title="Logout!"
        onPress={async () => {
          console.log('Logging out!');
          setUser({});
          setIsLoggedIn(false);
          // Clears the users data from asyncstorage when the user logs out
          try {
            await AsyncStorage.clear();
          } catch (error) {
            console.error('Clearing asyncstorage failed');
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  image: {
    width: 200,
    height: 300,
  },
});

export default Profile;
