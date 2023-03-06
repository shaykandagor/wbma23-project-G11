import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../config/colors';
import Constants from 'expo-constants';
import {useNetInfo} from '@react-native-community/netinfo';

export default function OfflineNotice() {
  const netInfo = useNetInfo();
  console.log(netInfo);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.lightgreen,
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 1,
    top: Constants.statusBarHeight,
  },
  text: {
    color: colors.white,
  },
});
