import React from 'react';
import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/navigator.js';
import {MainProvider} from './contexts/MainContext';
import OfflineNotice from './components/OfflineNotice';

const App = () => {
  return (
    <>
      <OfflineNotice />
      <MainProvider>
        <Navigator />
        <StatusBar style="auto" />
      </MainProvider>
    </>
  );
};

export default App;
