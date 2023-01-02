/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
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
import {Characteristic} from 'react-native-ble-plx';
import {useFocusEffect} from '@react-navigation/native';
import type PropsWithDeviceAndManager from '../props-with-device-and-manager';

const SERVICE_UUID = '5dfa6919-ce04-4e7c-8ddd-3d7a4060a2e0';

const SelectBluetooth: () => Node = (props: PropsWithDeviceAndManager) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [bleState, setBleState] = useState('unknown');
  const [blePoweredOn, setBlePoweredOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connecting, setConnecting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (props.bleManager === null) {
        return;
      }

      setConnecting(false);

      if(props.device && props.device.isConnected()) {
        props.bleManager.cancelDeviceConnection(props.device.uuid);
        props.setDevice(null);
      }

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
    }, [props, scanDevices]),
  );

  const scanDevices = React.useCallback(() => {
    setDevices([]);
    props.bleManager.startDeviceScan(null, {allowDuplicates: false}, (error, newDevice) => {
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

        return [newDevice, ...oldDevices]
      });
    });
  }, [props.bleManager]);

  const stopScanDevices = () => props.bleManager.stopDeviceScan();

  const selectDevice = (device: Device) => {
    stopScanDevices();
    setConnecting(true);
    setBleState('Connecting');

    device
      .connect({
        // timeout: 5,
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
          (device.localName || device.name || device.title || device.id),
        );

        return device.services();
      })
      .then((services: Service[]) => {
        services.forEach((service: Service) => {
          Alert.alert('Service', service.uuid);

          device
            // .characteristicsForService(SERVICE_UUID)
            .characteristicsForService(service.uuid)
            // .characteristics()
            .then((characteristics: Characteristic) => {
              characteristics.forEach((characteristic) => {
                Alert.alert('characteristic', characteristic.uuid);
              });
            })
            .catch(error => {
              Alert.alert('Error durring fetching characteristics', error.message);
            });
        });
        return;
      })
      .catch(error => {
        Alert.alert('Error durring connection', error.message + ' Reason: ' + error.reason);
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
              <DevicesList devices={devices} setDevice={selectDevice} disabled={connecting}/>
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
