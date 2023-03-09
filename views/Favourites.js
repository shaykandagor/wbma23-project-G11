import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {SwipeListView} from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia} from '../hooks/ApiHooks';
import {Avatar, Icon, ListItem} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import {uploadsUrl} from '../utils/variables';
import colors from '../config/colors';

const Favourites = () => {
  const [favouriteItems, setFavouritesItems] = useState([]);
  const {getFavourites, deleteFavourite} = useFavourite();
  const {getMediaByFileId} = useMedia(true);

  const renderItem = ({item}) => {
    const media = getMediaByFileId(item.file_id);
    return (
      <ListItem key={item.id}>
        {media && (
          <>
            <Avatar rounded source={{uri: uploadsUrl + media.filename}} />
            <ListItem.Content>
              <ListItem.Title>{media.title}</ListItem.Title>
            </ListItem.Content>
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

export default Favourites;
