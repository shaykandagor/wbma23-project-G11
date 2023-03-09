import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Button, Icon, Card, ListItem} from '@rneui/themed';
import PropTypes from 'prop-types';
import {ScrollView, StyleSheet, View} from 'react-native';
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
    <ScrollView>
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
            <Icon name="badge" color={colors.primary} />
            <ListItem.Title>{user.full_name}</ListItem.Title>
          </ListItem>
          <ListItem>
            <Icon name="person" color={colors.primary} />
            <ListItem.Title>{user.username}</ListItem.Title>
          </ListItem>
          <ListItem>
            <Icon name="email" color={colors.primary} />
            <ListItem.Title>{user.email}</ListItem.Title>
          </ListItem>
          <ListItem>
            <Icon name="call" color={colors.primary} />
            <ListItem.Title>{user.phone_number}</ListItem.Title>
          </ListItem>
          <ListItem>
            <Icon name="pin-drop" color={colors.primary} />
            <ListItem.Title>{user.address}</ListItem.Title>
          </ListItem>
          <Card.Divider />
          <Button
            title="MY ACCOUNT"
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
              alignSelf: 'center',
            }}
            titleStyle={{fontWeight: 'bold'}}
            onPress={() => {
              navigation.navigate('MyFiles');
            }}
          />
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
              backgroundColor: colors.primary,
            }}
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
              alignSelf: 'center',
            }}
            icon={{
              name: 'logout',
              size: 30,
              color: 'white',
            }}
            iconRight
            iconContainerStyle={{marginLeft: 10, marginRight: -10}}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightgreen,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
