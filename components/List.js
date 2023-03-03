import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

// define the List component as a functional component
const List = ({navigation, myFilesOnly = false}) => {
  // Call the useMedia hook to fetch and filter media items
  const {mediaArray} = useMedia(myFilesOnly);

  // render the FlatList component with the fetched media items
  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

// define the navigation and myFilesOnly prop types and default values for the List component
List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

// export the List component as the default export for the module
export default List;
