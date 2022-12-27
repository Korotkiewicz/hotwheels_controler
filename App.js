/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/home';
import SelectBluetooth from './src/screens/select-bluetooth';


const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
              name="Home"
              component={Home}
              options={{title: 'Welcome'}}
          />
          <Stack.Screen name="SelectBluetooth" component={SelectBluetooth} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
