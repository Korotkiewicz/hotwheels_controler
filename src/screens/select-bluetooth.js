/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useState} from 'react';
import type {Node} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import mainStyle from '../styles/main-style';
import Section from '../components/section';
import DevicesList from '../components/devices-list';
import {Characteristic, Service} from 'react-native-ble-plx';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type PropsWithDeviceAndManager from '../props-with-device-and-manager';
import {SERVICE_UUID} from '../device-config';

const SelectBluetooth: () => Node = (props: PropsWithDeviceAndManager) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [bleState, setBleState] = useState('unknown');
  const [blePoweredOn, setBlePoweredOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connecting, setConnecting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (props.bleManager === null) {
        return;
      }

      setConnecting(false);

      const subscription = props.bleManager.onStateChange(state => {
        const isPoweredOn = state === 'PoweredOn';
        setBleState(state);
        setBlePoweredOn(isPoweredOn);
        if (isPoweredOn) {
          subscription.remove();
          scanDevices();
        }
      }, true);

      return () => {
        subscription.remove();
        stopScanDevices();
      };
    }, [props.bleManager, scanDevices, stopScanDevices]),
  );

  const scanDevices = React.useCallback(() => {
    setDevices([]);
    props.bleManager.startDeviceScan(
      null,
      {allowDuplicates: false},
      (error, newDevice) => {
        setBleState('Scanning');
        if (error) {
          Alert.alert('error', error.message);
          // Handle error (scanning will be stopped automatically)
          setTimeout(() => scanDevices(), 100);
          return;
        }

        setDevices(oldDevices => {
          oldDevices = oldDevices.filter(
            oldDevice => oldDevice.id !== newDevice.id,
          );

          return [newDevice, ...oldDevices];
        });
      },
    );
  }, [props.bleManager]);

  const stopScanDevices = useCallback(() => props.bleManager.stopDeviceScan());

  const selectDevice = (device: Device) => {
    stopScanDevices();
    setConnecting(true);
    setBleState('Connecting');

    device
      .connect({
        timeout: 5000,
      })
      .then(device => {
        device.readRSSI();
        setConnecting(false);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        props.setDevice(device);
        Alert.alert(
          'Correctly connected to',
          device.localName || device.name || device.title || device.id,
        );

        navigation.navigate('Options');

        return device.services();
      })
      .catch(error => {
        Alert.alert(
          'Error durring connection',
          error.message + ' Reason: ' + error.reason,
        );
        setConnecting(false);
        scanDevices();
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section>
            Select Hot Wheels RC with Bluetooth (state: {bleState})
          </Section>
          <Section title="Devices:">
            {blePoweredOn ? (
              <DevicesList
                devices={devices}
                setDevice={selectDevice}
                disabled={connecting}
              />
            ) : (
              <View style={styles.device}>
                <Text style={styles.disabledText}>
                  Waiting for bluetooth...
                </Text>
              </View>
            )}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(mainStyle);

export default SelectBluetooth;
