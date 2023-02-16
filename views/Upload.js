import React from 'react';
import {StyleSheet, SafeAreaView, Text} from 'react-native';

const Upload = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Upload</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

export default Upload;
