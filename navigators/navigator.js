import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Upload from '../views/Upload';
import Search from '../views/Search';
import Single from '../views/Single';
import WelcomeScreen from '../views/WelcomeScreen';
import {Icon} from '@rneui/themed';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import Login from '../views/Login';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

// Create the native stack navigator
const Stack = createNativeStackNavigator();

// Returns the options object for each tab screen
const getTabScreenOptions = (iconName) => {
  return {
    tabBarIcon: ({color}) => <Icon name={iconName} color={color} />,
  };
};

// Component for the tab navigator
const TabScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={getTabScreenOptions('home')}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={getTabScreenOptions('cloud-upload')}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={getTabScreenOptions('person')}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={getTabScreenOptions('search')}
      />
    </Tab.Navigator>
  );
};

// Component for the stack navigator
const StackScreen = () => {
  // Get the isLoggedIn value from the MainContext
  const {isLoggedIn} = useContext(MainContext);

  // Function that returns the screens to be rendered based on the isLoggedIn value
  const getScreens = () => {
    if (isLoggedIn) {
      return (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen name="MyFiles" component={MyFiles} />
          <Stack.Screen name="Modify" component={Modify} />
        </>
      );
    } else {
      return (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={Login} />
        </>
      );
    }
  };

  return <Stack.Navigator>{getScreens()}</Stack.Navigator>;
};

// Component for the navigation container
const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
