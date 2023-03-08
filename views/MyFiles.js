import List from '../components/List';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import {Button, Card, Image, Text} from '@rneui/themed';
import colors from '../config/colors';
import {useContext, useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';
import {ScrollView} from 'react-native';

const MyFiles = ({navigation}) => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      // Getting the latest profile if you have uploaded many files
      setAvatar(avatarArray.pop().filename);
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>My Profile</Card.Title>
        <Card.Divider />
        <Card.Image style={styles.avatar} source={{uri: uploadsUrl + avatar}} />
        <View style={styles.card}>
          <Text style={styles.text}>{user.username}</Text>
          <Button
            title="EDIT PROFILE"
            buttonStyle={{
              backgroundColor: colors.secondary,
              borderRadius: 5,
            }}
            titleStyle={{fontWeight: 'bold', fontSize: 15}}
            containerStyle={{
              marginHorizontal: 50,
              height: 50,
              width: 200,
              marginVertical: 10,
            }}
            onPress={() => {
              navigation.navigate('UpdateUser');
            }}
          />
        </View>
      </Card>

      <View>
        <List navigation={navigation} myFilesOnly={true} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightgreen,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  card: {
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
});

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;
