import List from '../components/List';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import {Button, Card} from '@rneui/themed';
import colors from '../config/colors';
import {useContext, useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';

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
      <Card style={styles.card}>
        <Card.Title>{user.username}</Card.Title>
        <Card.Image style={styles.avatar} source={{uri: uploadsUrl + avatar}} />
        <Button
          title="Edit Profile"
          color={colors.secondary}
          onPress={() => {
            navigation.navigate('Profile');
          }}
        />
      </Card>
      <List navigation={navigation} myFilesOnly={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightgreen,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  card: {
    alignItems: 'center',
  },
});

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;
