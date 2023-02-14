import React from 'react';
import {SafeAreaView, Platform, StatusBar, StyleSheet} from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';

const App = () => {
  // console.log('App Starting!');
  return (
    <>
      <SafeAreaView style={styles.container}>
        <WelcomeScreen />
      </SafeAreaView>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
