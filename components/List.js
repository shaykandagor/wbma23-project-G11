import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import colors from '../config/colors.js';
import {View} from 'react-native';
import {useState} from 'react';
import {shuffleArray} from '../utils/helper';

const List = ({navigation, myFilesOnly = false}) => {
  const [loading, setLoading] = useState(false);
  // Loading the app components with the useMedia hook
  const {mediaArray, setMediaArray} = useMedia(myFilesOnly);
  return (
    <View containerStyle={styles.container}>
      {/* <View styles={styles.categoryContainer}>
        <Button
          title="Women"
          styles={styles.categoryText}
          buttonStyle={{
            backgroundColor: colors.primary,
            borderRadius: 10,
          }}
          containerStyle={{
            width: 100,
          }}
        />
        <Button
          title="Men"
          styles={styles.categoryText}
          buttonStyle={{
            backgroundColor: colors.primary,
            borderRadius: 10,
          }}
          containerStyle={{
            width: 100,
          }}
        />
        <Button
          title="Kids"
          styles={styles.categoryText}
          buttonStyle={{
            backgroundColor: colors.primary,
            borderRadius: 10,
          }}
          containerStyle={{
            width: 100,
          }}
        />
      </View> */}
      <FlatList
        data={mediaArray}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        refreshing={loading}
        onRefresh={() => {
          const shuffledArray = shuffleArray(mediaArray);
          setMediaArray(shuffledArray);
        }}
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
});

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
