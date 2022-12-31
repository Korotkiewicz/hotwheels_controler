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
import type PropsWithDevice from '../props-with-device';
import {BleManager, Characteristic} from 'react-native-ble-plx';
import {useFocusEffect} from '@react-navigation/native';

const SERVICE_UUID = '5dfa6919-ce04-4e7c-8ddd-3d7a4060a2e0';

const SelectBluetooth: () => Node = (props: PropsWithDevice) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [bleState, setBleState] = useState('unknown');
  const [blePoweredOn, setBlePoweredOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [bleManager: BleManager, setBleManager] = useState(null);

  useEffect(() => {
    return () => {
      if (bleManager !== null) {
        bleManager.destroy();
      }
    };
  }, [bleManager]);

  useFocusEffect(
    React.useCallback(() => {
      const manager = bleManager || new BleManager();
      if (bleManager === null) {
        setBleManager(manager);
      }

      const subscription = manager.onStateChange(state => {
        setBleState(state);
        const isPoweredOn = state === 'PoweredOn';
        setBlePoweredOn(isPoweredOn);
        if (isPoweredOn) {
          scanDevices();
          subscription.remove();
        }
      }, true);

      return () => {
        subscription.remove();
        manager.stopDeviceScan();
      };
    }, [bleManager, scanDevices]),
  );

  const scanDevices = React.useCallback(() => {
    setDevices([]);
    bleManager.startDeviceScan(null, {allowDuplicates: false}, (error, device) => {
      if (error) {
        Alert.alert('error', error.message);
        // Handle error (scanning will be stopped automatically)
        return;
      }

      setDevices(oldDevices => {
        if (oldDevices.indexOf(device) !== false) {
          return oldDevices;
        }

        return [...oldDevices, device]
      });
    });
  }, [bleManager]);

  const selectDevice = (device: Device) => {
    device
      .connect()
      .then(device => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        props.setDevice(device);
        Alert.prompt(
          'Success',
          'Correctly connected to ' + (device.localName || device.name),
        );

        device
          .characteristicsForService(SERVICE_UUID)
          .then((characteristics: Characteristic) => {
            Alert.alert('Characteristics', characteristics);
          })
          .catch(error => {
            Alert.alert('Error durring connection', error);
          });

        return device.services();
      })
      .then((services: Service[]) => {
        services.forEach((service: Service) =>
          Alert.prompt('Service', service.toString()),
        );
        return;
      })
      .catch(error => {
        Alert.prompt('Error durring connection', error);
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
              <DevicesList devices={devices} setDevice={selectDevice} />
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
