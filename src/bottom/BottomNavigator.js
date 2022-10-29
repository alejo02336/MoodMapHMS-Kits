import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import List from '../screens/List';
import Map from '../screens/Map';
import React from 'react';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
        name="Map"
        component={Map}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="list" color={color} size={size} />
          ),
        }}
        name="List"
        component={List}
      />
    </Tab.Navigator>
  );
}
