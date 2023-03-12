import {FlatList, TouchableOpacity} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import colors from '../config/colors.js';
import {View} from 'react-native';
import {useState} from 'react';
import {Text} from '@rneui/themed';

const customerCategories = [
  {label: 'All', value: 'all'},
  {label: 'Women', value: 'women'},
  {label: 'Men', value: 'men'},
  {label: 'Kids', value: 'kids'},
];

const List = ({navigation, myFilesOnly = false}) => {
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({});
  // Loading the app components with the useMedia hook
  const {mediaArray, setMediaArray} = useMedia(myFilesOnly);
  const handleCategoryClicked = (category) => {
    setCurrentCategory(category);
  };
  const filteredMediaArray = mediaArray.filter((media) => {
    const {customerCategory} = JSON.parse(media.description);
    if (currentCategory.value === 'all') return true;
    if (currentCategory.value) {
      const wantedCategory =
        customerCategory.toLowerCase() === currentCategory.value.toLowerCase();
      return wantedCategory;
    }
    return true;
  });
  return (
    <View containerStyle={styles.container}>
      <View styles={styles.categoryContainer}>
        <FlatList
          data={customerCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleCategoryClicked(item)}>
              <View style={styles.listitem}>
                <Text style={styles.label}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.value}
        />
      </View>
      <FlatList
        data={filteredMediaArray}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        refreshing={loading}
        contentContainerStyle={{paddingBottom: 60}}
        renderItem={({item}) => (
          <ListItem
            navigation={navigation}
            singleMedia={item}
            profile={myFilesOnly}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.white,
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  categoryText: {
    marginTop: 10,
    color: colors.white,
    fontWeight: 'bold',
  },
  listitem: {
    backgroundColor: colors.primary,
    margin: 5,
    padding: 10,
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    color: colors.white,
  },
});

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
