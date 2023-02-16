import React from 'react';
import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/navigator';

const App = () => {
  return (
    <>
      <Navigator />
      <StatusBar style="auto" />
    </>
  );
};

export default App;
