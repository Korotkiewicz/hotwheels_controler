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
import SelectBluetooth from './src/screens/select-bluetooth';
import Options from './src/screens/options';
import {Device} from 'react-native-ble-plx';


const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  let device: Device;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Options"
          options={{title: 'Hot Wheels RC'}}
        >
          {props => <Options {...props} device={device} />}
        </Stack.Screen>
        <Stack.Screen
          name="SelectBluetooth"
          options={{title: 'Select a car'}}
        >
          {props => <SelectBluetooth {...props} device={device} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
