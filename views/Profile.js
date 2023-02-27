import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Button, Icon, Card, ListItem} from '@rneui/themed';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import colors from '../config/colors';

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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title>{user.username}</Card.Title>
        <Card.Divider />
        <View style={{position: 'relative', alignItems: 'center'}}>
          <Card.Image
            style={styles.avatar}
            source={{uri: uploadsUrl + avatar}}
          />
        </View>

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
          color={colors.secondary}
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
          color={colors.secondary}
          onPress={() => {
            navigation.navigate('MyFiles');
          }}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightgreen,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'column',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
