import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  ScreenOrientation,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, Text, Icon, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {ListItem} from '@rneui/themed';
import colors from '../config/colors';
import Headers from '../components/Header';

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

  const handleBackPress = () => {
    route.goBack('Home');
  };

  const video = useRef(null);
  const [owner, setOwner] = useState({});
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
    //     if (video.current) showVideoInFullScreen();
    //   }
    // });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, []);

  return (
    <Card style={styles.container}>
      <Image style={styles.itemImage} source={{uri: uploadsUrl + filename}} />
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>Women</Text>
        <Text style={styles.categoryText}>Size 38</Text>
        <Text style={styles.categoryText}>Trousers</Text>
      </View>
      <Text style={styles.itemName}>{title}</Text>
      <ListItem>
        {userLikesIt ? (
          <Icon name="favorite" color="red" onPress={dislikeFile} />
        ) : (
          <Icon name="favorite-border" onPress={likeFile} />
        )}
        <Text style={{color: colors.primary}}>Total likes: {likes.length}</Text>
      </ListItem>

      <Text style={styles.itemPrice}>€100</Text>
      <Text style={styles.itemLocation}>Helsinki</Text>
      <Text style={styles.itemDescription}>{description}</Text>
      <Text style={styles.postedDate}>{timeAdded}</Text>
      <Button
        icon={<Icon name="envelope" type="font-awesome" color="#ffffff" />}
        title="Send message"
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightgray,
  },
  itemImage: {
    width: '100%',
    height: 300,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryText: {
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
    color: '#517fa4',
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
  shoppingBagIcon: {
    marginLeft: 5,
    marginRight: 5,
  },
  sellerItemsCount: {
    color: '#517fa4',
  },
  postedDate: {
    color: '#517fa4',
    marginTop: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
