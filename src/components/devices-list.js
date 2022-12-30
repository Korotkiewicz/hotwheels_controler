/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import mainStyle from '../styles/main-style';
import {Device} from 'react-native-ble-plx';
import SelectDevice from '../components/select-device';

const DevicesList: () => Node = ({devices, setDevice}) => {
  const devicesList = devices.map((device: Device) => <SelectDevice key={device.id} device={device} setDevice={setDevice}/>);

  return (
    <View style={styles.device}>
      {devicesList && devicesList.length ? (
        devicesList
      ) : (
        <Text style={styles.disabledText}>No devices detected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create(mainStyle);

export default DevicesList;
