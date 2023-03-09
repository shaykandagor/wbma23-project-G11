import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Text, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Button, ListItem} from '@rneui/themed';
import colors from '../config/colors';
import {ScrollView} from 'react-native';
import moment from 'moment/moment';

const Single = ({route, navigation}) => {
  console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    user_id: userId,
    file_id: fileId,
    username: userName,
  } = route.params;

  const [owner, setOwner] = useState({});
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const {user} = useContext(MainContext);
  const {getUserById} = useUser();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const owner = await getUserById(userId, token);
    console.log(owner);
    setOwner(owner);
  };

  const getLikes = async () => {
    const likes = await getFavouritesByFileId(fileId);
    console.log('likes', likes, 'user', user);
    setLikes(likes);
    // checks if the current user id is included in the 'likes' array and
    // set the 'userLikesIt' accordingly
    for (const like of likes) {
      if (like.user_id === user.user_id) {
        setUserLikesIt(true);
        break;
      }
    }
  };

  const likeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postFavourite(fileId, token);
      setUserLikesIt(true);
      getLikes();
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
    }
  };
  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteFavourite(fileId, token);
      setUserLikesIt(false);
      getLikes();
    } catch (error) {
      // you cannot dislike same file multiple times
      console.log(error);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={[styles.card, styles.shadowProp, styles.elevation]}>
          <Image
            style={styles.itemImage}
            source={{uri: uploadsUrl + filename}}
          />
          <View style={styles.categoryContainer}>
            <Button
              title="Women"
              style={styles.categoryText}
              buttonStyle={{
                backgroundColor: colors.primary,
                borderRadius: 20,
              }}
              containerStyle={{
                width: 100,
              }}
            />
            {/* <Text style={styles.categoryText}>Women</Text> */}
            <Button
              title="Size 38"
              style={styles.categoryText}
              buttonStyle={{
                backgroundColor: colors.primary,
                borderRadius: 20,
              }}
              containerStyle={{
                width: 100,
              }}
            />
            <Button
              title="Trouser"
              style={styles.categoryText}
              buttonStyle={{
                backgroundColor: colors.primary,
                borderRadius: 20,
              }}
              containerStyle={{
                width: 100,
              }}
            />
          </View>
          <Text style={styles.itemName}>{title}</Text>

          <ListItem containerStyle={{backgroundColor: colors.lightgreen}}>
            <Icon name="person" color={colors.primary} />
            <Text style={styles.items}>{owner.username}</Text>
          </ListItem>

          <ListItem containerStyle={{backgroundColor: colors.lightgreen}}>
            <Icon name="euro" color={colors.primary} />
            <Text style={styles.items}> 20</Text>
          </ListItem>

          <ListItem containerStyle={{backgroundColor: colors.lightgreen}}>
            <Icon name="pin-drop" color={colors.primary} />
            <Text style={styles.items}>Helsinki</Text>
          </ListItem>

          <ListItem containerStyle={{backgroundColor: colors.lightgreen}}>
            <Icon
              name="comment"
              color={colors.primary}
              onPress={() => {
                navigation.navigate('Comments', {fileId});
              }}
            />
            {userLikesIt ? (
              <Icon
                name="favorite"
                color={colors.primary}
                onPress={dislikeFile}
              />
            ) : (
              <Icon
                name="favorite-border"
                color={colors.primary}
                onPress={likeFile}
              />
            )}
            <Text style={{color: colors.primary}}>
              Total likes: {likes.length}
            </Text>
          </ListItem>

          <Text style={styles.itemDescription}>{description}</Text>

          <ListItem
            containerStyle={{
              backgroundColor: colors.lightgreen,
            }}
          >
            <Icon name="schedule" color={colors.primary} />
            <Text style={styles.postedDate}>
              {moment(timeAdded).format('Do MMMM YYYY')}
            </Text>
          </ListItem>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    alignContent: 'center',
  },
  card: {
    backgroundColor: colors.lightgreen,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 14,
    marginRight: 14,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 10,
    shadowColor: '#52006A',
  },
  itemImage: {
    width: '100%',
    height: 450,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  categoryText: {
    marginTop: 10,
    color: colors.white,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  heartIcon: {
    position: 'absolute',
    left: 0,
    top: 10,
  },
  items: {
    color: colors.primary,
    fontSize: 15,
    flexDirection: 'column',
  },
  sellerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sellerName: {
    fontWeight: 'bold',
  },
  postedDate: {
    color: colors.primary,
    marginTop: 10,
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    marginBottom: 30,
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
