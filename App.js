/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SelectBluetooth from './src/screens/select-bluetooth';
import Options from './src/screens/options';
import {BleManager, Device} from 'react-native-ble-plx';
import {useColorScheme} from 'react-native';
import Drive from './src/screens/drive';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  const [device, setDevice] = useState(null);
  const [bleManager: BleManager, setBleManager] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';

  const selectDevice = (newDevice: Device) => {
    if (newDevice && newDevice.isConnected()) {
      setDevice(newDevice);
    } else {
      setDevice(null);
    }
  };

  useEffect(() => {
    const manager = bleManager || new BleManager();
    if (bleManager === null) {
      setBleManager(manager);
      manager.connectedDevices().then(devices => {
        devices.forEach(oldDevice => {
          manager.cancelDeviceConnection(oldDevice.uuid);
        });
      });
    }

    // return () => {
    //   if (manager !== null) {
    //     manager.destroy();
    //   }
    // };
  }, [bleManager]);

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Options" options={{title: 'Hot Wheels RC'}}>
          {props => (
            <Options
              {...props}
              device={device}
              bleManager={bleManager}
              setDevice={selectDevice}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="SelectBluetooth" options={{title: 'Select a car'}}>
          {props => (
            <SelectBluetooth
              {...props}
              device={device}
              bleManager={bleManager}
              setDevice={selectDevice}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Drive" options={{title: 'Drive'}}>
          {props => (
            <Drive
              {...props}
              device={device}
              bleManager={bleManager}
              setDevice={() => {}}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
