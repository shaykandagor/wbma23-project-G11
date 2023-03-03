import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import {ButtonGroup} from '@rneui/themed';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {Avatar, ListItem as RNEListItem} from '@rneui/themed';

const ListItem = ({singleMedia, navigation}) => {
  // Accessing data from the main context provider
  const {user, setUpdate, update} = useContext(MainContext);

  // Fetching the deleteMedia function from the custom hook
  const {deleteMedia} = useMedia();

  // Extracting the item object from the props
  const item = singleMedia;

  // Function to handle media deletion
  const doDelete = () => {
    try {
      // Displaying an alert to confirm the deletion
      Alert.alert('Delete', 'this file permanently', [
        {text: 'Cancel'},
        {
          text: 'OK',
          // Deleting the media with the deleteMedia function
          onPress: async () => {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(item.file_id, token);
            // Updating the media list if the deletion is successful
            response && setUpdate(!update);
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <RNEListItem
      // Navigating to the Single screen when the ListItem is pressed
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      {/* Displaying the media thumbnail with the Avatar component */}
      <Avatar size="large" source={{uri: uploadsUrl + item.thumbnails?.w160}} />

      <RNEListItem.Content>
        <RNEListItem.Title>{item.title}</RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={3}>
          {item.description}
        </RNEListItem.Subtitle>
        {/* Displaying Modify and Delete buttons if the media is uploaded by the user */}
        {item.user_id === user.user_id && (
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
      <RNEListItem.Chevron />
    </RNEListItem>
  );
};

// Defining the singleMedia and navigation PropTypes for the ListItem component
ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
