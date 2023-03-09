import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Text, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {ListItem} from '@rneui/themed';
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

  useEffect(() => {
    getOwner();
    getLikes();
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
          <Icon
            name="comment"
            color={colors.primary}
            onPress={() => {
              navigation.navigate('Comments');
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
        <Text style={styles.postedDate}>
          {moment(timeAdded).format('Do MMMM YYYY')}
        </Text>
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
  navigation: PropTypes.object,
};

export default Single;
