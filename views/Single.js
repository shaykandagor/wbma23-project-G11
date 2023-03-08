import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Image, View, ScreenOrientation} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, Text, Icon, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {ListItem} from '@rneui/themed';
import colors from '../config/colors';
import {Dimensions, ScrollView, TouchableOpacity} from 'react-native';

const width = Dimensions.get('window').width;

const Single = ({route}) => {
  console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    user_id: userId,
    media_type: type,
    file_id: fileId,
    username: userName,
  } = route.params;

  const [setOwner] = useState({});
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

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
    unlock();

    // const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
    //   console.log('orientation', evt);
    //   if (evt.orientationInfo.orientation > 2) {
    //     // show video in fullscreen
    //     // if (video.current) showVideoInFullScreen();
    //   }
    // });
    // return () => {
    //   ScreenOrientation.removeOrientationChangeListener(orientSub);
    //   lock();
    // };
  }, []);

  return (
    <View style={styles.cardShadow}>
      <ScrollView style={styles.scrollView}>
        <Image style={styles.itemImage} source={{uri: uploadsUrl + filename}} />
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>Women</Text>
          <Text style={styles.categoryText}>Size 38</Text>
          <Text style={styles.categoryText}>Trousers</Text>
        </View>
        <Text style={styles.itemName}>{title}</Text>
        <Text style={styles.itemPrice}>€20</Text>
        <Text style={styles.itemLocation}>Helsinki</Text>
        <ListItem containerStyle={{backgroundColor: colors.lightgray}}>
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
        <Text style={styles.postedDate}>{timeAdded}</Text>
        <TouchableOpacity style={styles.button}>
          <Icon
            name="envelope"
            type="font-awesome"
            color={colors.white}
            style={{marginRight: 10}}
          />
          <Text>Leave a comment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.lightgray,
    padding: 10,
    borderRadius: 10,
    overflow: 'scroll',
    // width: width,
    justifyContent: 'center',
    marginTop: 15,
    // width: width - 20,
  },
  cardShadow: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 450,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryText: {
    marginTop: 10,
    color: colors.primary,
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
  itemPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
  },
  itemLocation: {
    color: colors.primary,
    marginTop: 10,
  },
  itemDescription: {
    marginTop: 10,
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
  },
  scrollView: {
    backgroundColor: colors.lightgray,
    marginHorizontal: 20,
    padding: 15,
    marginBottom: 20,
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
};

export default Single;
