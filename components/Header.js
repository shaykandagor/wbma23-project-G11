import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import colors from '../config/colors';

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.labelStyle}>ReNew</Text>
    </View>
  );
};

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: 60,
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
    paddingBottom: 15,
    alignItems: 'center',
  },
  labelStyle: {
    color: colors.lightgray,
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});

export default Header;
