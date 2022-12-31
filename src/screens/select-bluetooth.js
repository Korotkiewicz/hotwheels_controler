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

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import mainStyle from '../styles/main-style';
import Section from '../components/section';
import DevicesList from '../components/devices-list';
import type PropsWithDevice from '../props-with-device';
import {BleManager, Characteristic} from 'react-native-ble-plx';

const SERVICE_UUID = '5dfa6919-ce04-4e7c-8ddd-3d7a4060a2e0';

const SelectBluetooth: () => Node = (props: PropsWithDevice) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [blePoweredOn, setBlePoweredOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [bleManager: BleManager, setBleManager] = useState(new BleManager());

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      console.log(state);
      const isPoweredOn = state === 'PoweredOn';
      setBlePoweredOn(isPoweredOn);
      if (isPoweredOn) {
        Alert.prompt('Status', 'ble power on');
        scanDevices();
      }
    }, true);
  }, [props.device, bleManager]);

  const scanDevices = () => {
    Alert.prompt('Status', 'start scan devices');
    setDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }
      Alert.prompt('Detect device', device.localName || device.name);

      setDevices(oldDevices => [...oldDevices, device]);
    });
  };

  const selectDevice = (device: Device) => {
    device.connect()
      .then((device) => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        props.setDevice(device);
        Alert.prompt(
          'Success',
          'Correctly connected to ' + (device.localName || device.name),
        );

        device.characteristicsForService(SERVICE_UUID)
          .then((characteristics: Characteristic) => {
          Alert.prompt('Characteristics', characteristics);
        })
          .catch((error) => {
          Alert.prompt(
            'Error durring connection',
            error
          );
        });


        return device.services();
      })
      .then((services: Service[]) => {
        services.forEach((service: Service) => Alert.prompt('Service', service.toString()));
        return;
      })
      .catch((error) => {
        Alert.prompt(
          'Error durring connection',
          error
        );
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
            Select Hot Wheels with Bluetooth remote control
          </Section>
          <Section title="Devices:">
            {blePoweredOn ?
              <DevicesList devices={devices} setDevice={selectDevice}/> :
              <View style={styles.device}>
                <Text style={styles.disabledText}>Waiting for bluetooth...</Text>
              </View>
            }
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(mainStyle);

export default SelectBluetooth;
