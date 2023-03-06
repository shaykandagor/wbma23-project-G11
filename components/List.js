import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import colors from '../config/colors.js';
import {Dimensions} from 'react-native';
import {Constants} from 'expo';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const List = ({navigation, myFilesOnly = false}) => {
  // Loading the app components with the useMedia hook
  const {mediaArray} = useMedia(myFilesOnly);
  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.column}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'column',
  },
  list: {
    justifyContent: 'space-around',
  },
  column: {
    flexShrink: 1,
  },
});

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
