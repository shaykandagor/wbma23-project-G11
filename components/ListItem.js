import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useContext, useState} from 'react';
import {ButtonGroup, Icon, Text} from '@rneui/themed';
import {Alert, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia} from '../hooks/ApiHooks';
import {Image, ListItem as RNEListItem} from '@rneui/themed';
import colors from '../config/colors';
import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';

const width = Dimensions.get('window').width - 50;

const ListItem = ({singleMedia, navigation, profile = true, route}) => {
  const {file_id: fileId} = singleMedia;

  const {user, setUpdate, update} = useContext(MainContext);
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const [userLikesIt, setUserLikesIt] = useState(false);
  const [likes, setLikes] = useState([]);
  const {deleteMedia} = useMedia();
  const item = singleMedia;
  const doDelete = () => {
    try {
      Alert.alert('Delete', 'this file permanently', [
        {text: 'Cancel'},
        {
          text: 'OK',
          onPress: async () => {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(item.file_id, token);
            response && setUpdate(!update);
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
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

  return (
    <RNEListItem
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <View style={styles.cardShadow}>
        <View style={styles.itemContainer}>
          <Image
            source={{uri: uploadsUrl + item.thumbnails?.w160}}
            containerStyle={styles.itemImage}
          />

          <RNEListItem.Content
            containerStyle={{backgroundColor: colors.lightgray}}
          >
            <RNEListItem.Title
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                marginTop: 10,
                marginRight: 10,
              }}
            >
              {item.title}
            </RNEListItem.Title>
            <RNEListItem.Subtitle
              numberOfLines={3}
              style={{color: colors.secondary}}
            >
              <Icon name="euro" color={colors.primary} size={18} />
              <Text style={styles.price}>
                {JSON.parse(item.description).price}
              </Text>
            </RNEListItem.Subtitle>
            <RNEListItem.Subtitle style={styles.heartIcon}>
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
            </RNEListItem.Subtitle>

            {profile && item.user_id === user.user_id && (
              <ButtonGroup
                buttons={['Modify', 'Delete']}
                rounded
                onPress={(index) => {
                  if (index === 0) {
                    navigation.navigate('Modify', {file: item});
                  } else {
                    doDelete();
                  }
                }}
              />
            )}
          </RNEListItem.Content>
        </View>
      </View>
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.lightgreen,
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: width / 2,
  },
  itemImage: {
    width: '100%',
    height: 200,
    alignContent: 'center',
    justifyContent: 'center',
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
  price: {
    color: colors.primary,
    fontSize: 15,
    flexDirection: 'row',
  },
  heartIcon: {
    paddingEnd: 20,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  profile: PropTypes.bool,
  route: PropTypes.object,
};

export default ListItem;
