import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {SwipeListView} from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia} from '../hooks/ApiHooks';
import {Avatar, Icon, ListItem} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import {uploadsUrl} from '../utils/variables';
import colors from '../config/colors';
import PropTypes from 'prop-types';

const Favourites = ({navigation}) => {
  const [favouriteItems, setFavouritesItems] = useState([]);
  const {getFavourites, deleteFavourite} = useFavourite();
  const {getMediaByFileId} = useMedia(true);

  const renderItem = ({item}) => {
    const media = getMediaByFileId(item.file_id);
    return (
      <ListItem bottomDivider>
        {media && (
          <>
            <Avatar
              containerStyle={{
                marginRight: 20,
              }}
              rounded
              source={{uri: uploadsUrl + media.filename}}
            />
            <ListItem.Content>
              <ListItem.Title style={{color: 'black', fontWeight: 'bold'}}>
                {media.title}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron
              color="black"
              onPress={() => {
                console.log('Item', item);
                navigation.navigate('Single', getMediaByFileId(item.file_id));
              }}
            />
          </>
        )}
      </ListItem>
    );
  };

  const renderDelete = ({item}) => (
    <View style={styles.container}>
      <Icon
        name="delete"
        color="white"
        size={30}
        onPress={async () => {
          await handleDeleteFavourite(item);
        }}
      />
    </View>
  );

  const handleDeleteFavourite = async (item) => {
    const userToken = await AsyncStorage.getItem('userToken');
    await deleteFavourite(item.file_id, userToken);
    await fetchFavourites();
  };

  useFocusEffect(() => {
    fetchFavourites();
  });

  const fetchFavourites = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await getFavourites(userToken);
    setFavouritesItems(response);
  };
  return (
    <View style={styles.list}>
      <SwipeListView
        data={favouriteItems}
        useFlatList={true}
        keyExtractor={(item) => item.favourite_id}
        renderItem={renderItem}
        disableRightSwipe={true}
        rightOpenValue={-50}
        renderHiddenItem={renderDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'red',
  },
  list: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
});

Favourites.propTypes = {
  navigation: PropTypes.object,
};

export default Favourites;
