import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import {ButtonGroup} from '@rneui/themed';
import {Alert, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {Avatar, ListItem as RNEListItem} from '@rneui/themed';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';
import {Card} from 'react-native-elements';
import colors from '../config/colors';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width - 50;

const ListItem = ({singleMedia, navigation}) => {
  const {user, setUpdate, update} = useContext(MainContext);
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

  return (
    <RNEListItem
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <Card
        style={{
          width: width,
          flexWrap: 'wrap',
          flex: 1,
          backgroundColor: colors.lightgray,
        }}
      >
        <Avatar
          size="large"
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
          style={{width: width / 2, height: width / 2, flex: 1}}
        />

        <RNEListItem.Content
          containerStyle={{backgroundColor: colors.lightgray}}
        >
          <RNEListItem.Title style={{fontWeight: 'bold', fontSize: 13}}>
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
      </Card>
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
