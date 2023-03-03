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
        <Card.Title>Personal Details</Card.Title>
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
        <Card.Divider />
        <Button
          title="MY ACCOUNT"
          buttonStyle={{
            backgroundColor: colors.secondary,
            borderWidth: 0,
            borderColor: 'transparent',
            borderRadius: 30,
          }}
          containerStyle={{
            width: 350,
            marginHorizontal: 50,
            marginVertical: 10,
            alignSelf: 'center',
          }}
          titleStyle={{fontWeight: 'bold'}}
          onPress={() => {
            navigation.navigate('MyFiles');
          }}
        />
        <Button
          title="MY MESSAGES"
          buttonStyle={{
            backgroundColor: colors.secondary,
            borderWidth: 0,
            borderColor: 'transparent',
            borderRadius: 30,
          }}
          containerStyle={{
            width: 350,
            marginHorizontal: 50,
            marginVertical: 10,
            alignSelf: 'center',
          }}
          titleStyle={{fontWeight: 'bold'}}
          onPress={() => {
            navigation.navigate('MyFiles');
          }}
        />
      </Card>
      <Button
        title="LOG OUT"
        titleStyle={{fontWeight: 'bold', fontSize: 18}}
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
        buttonStyle={{
          borderWidth: 0,
          borderColor: 'transparent',
          borderRadius: 20,
          backgroundColor: colors.secondary,
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
          alignSelf: 'center',
          marginTop: 50,
        }}
        icon={{
          name: 'logout',
          size: 30,
          color: 'white',
        }}
        iconRight
        iconContainerStyle={{marginLeft: 10, marginRight: -10}}
      />
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
