import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../config/colors';
import Constants from 'expo-constants';
import {useNetInfo} from '@react-native-community/netinfo';

const OfflineNotice = () => {
  const netInfo = useNetInfo();
  if (netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );

  return null;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'red',
    height: 50,
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 1,
    top: Constants.statusBarHeight,
  },
  text: {
    color: colors.white,
  },
});

export default OfflineNotice;
