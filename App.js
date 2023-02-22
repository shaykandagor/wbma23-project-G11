import React from 'react';
import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/navigator';
import {MainProvider} from './contexts/MainContext';

const App = () => {
  return (
    <MainProvider>
      <Navigator />
      <StatusBar style="auto" />
    </MainProvider>
  );
};

export default App;
