import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import colors from '../config/colors.js';
import {Dimensions} from 'react-native';
import Constants from 'expo-constants';
import {View} from 'react-native';

const List = ({navigation, myFilesOnly = false}) => {
  // Loading the app components with the useMedia hook
  const {mediaArray} = useMedia(myFilesOnly);
  return (
    <View containerStyle={styles.container}>
      <FlatList
        data={mediaArray}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <ListItem navigation={navigation} singleMedia={item} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.white,
  },
});

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
