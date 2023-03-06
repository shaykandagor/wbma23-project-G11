import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import List from '../components/List';
import ListItem from '../components/ListItem';
import colors from '../config/colors.js';
import PropTypes from 'prop-types';
import Headers from '../components/Header';
import {Card, Icon} from 'react-native-elements';
import {uploadsUrl} from '../utils/variables';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Headers label="ReNew" />
      <List navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
