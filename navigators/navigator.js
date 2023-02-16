import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Upload from '../views/Upload';
import Search from '../views/Search';
import Single from '../views/Single';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        return {
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            } else if (route.name === 'Upload') {
              iconName = 'cloud-upload';
            } else if (route.name === 'Search') {
              iconName = 'search';
            }
            return <Ionicons name={iconName} />;
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Upload" component={Upload} />
      <Tab.Screen name="Search" component={Search} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Single" component={Single} />
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
