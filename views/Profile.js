import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Button, Icon, Card, ListItem} from '@rneui/themed';
import PropTypes from 'prop-types';

const Profile = ({navigation}) => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      // Getting the latest profile if you have uploaded many files
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <Card>
      <Card.Title>{user.username}</Card.Title>
      <Card.Image source={{uri: uploadsUrl + avatar}} />
      <ListItem>
        <Icon name="badge" />
        <ListItem.Title>{user.full_name}</ListItem.Title>
      </ListItem>
      <ListItem>
        <Icon name="person" />
        <ListItem.Title>{user.username}</ListItem.Title>
      </ListItem>
      <ListItem>
        <Icon name="email" />
        <ListItem.Title>{user.email}</ListItem.Title>
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
      <Button
        title="My Files"
        onPress={() => {
          navigation.navigate('MyFiles');
        }}
      />
    </Card>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
