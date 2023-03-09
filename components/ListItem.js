import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import {ButtonGroup} from '@rneui/themed';
import {Alert, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {Image, ListItem as RNEListItem} from '@rneui/themed';
import colors from '../config/colors';
import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';

const width = Dimensions.get('window').width - 50;

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
                fontSize: 13,
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
              {'20€'}
              {item.price}
            </RNEListItem.Subtitle>

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
        </View>
      </View>
    </RNEListItem>
  );
};

// Defining the singleMedia and navigation PropTypes for the ListItem component
ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
