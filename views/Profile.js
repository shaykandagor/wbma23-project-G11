import React, {useContext, useEffect, useState} from 'react';
import {Button} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Card, ListItem} from '@rneui/themed';
import {Icon} from '@rneui/themed';

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
    <Card>
      <Card.Image source={{uri: uploadsUrl + avatar}} />
      <ListItem>
        <ListItem.Title>
          <Icon name="badge"></Icon>
          {user.full_name}
        </ListItem.Title>
      </ListItem>
      <ListItem>
        <ListItem.Title>
          <Icon name="person"></Icon>
          {user.username}
        </ListItem.Title>
      </ListItem>
      <ListItem>
        <ListItem.Title>
          <Icon name="email"></Icon>
          {user.email}
        </ListItem.Title>
      </ListItem>
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
    </Card>
  );
};

export default Profile;
