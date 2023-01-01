/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SelectBluetooth from './src/screens/select-bluetooth';
import Options from './src/screens/options';
import {Device} from 'react-native-ble-plx';
import {useColorScheme} from 'react-native';


const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  const [device, setDevice] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';

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
          {props => <SelectBluetooth {...props} device={device} setDevice={setDevice} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
