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
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import mainStyle from '../styles/main-style';
import {Characteristic} from 'react-native-ble-plx';
import {useFocusEffect} from '@react-navigation/native';
import type PropsWithDeviceAndManager from '../props-with-device-and-manager';
import {
  SERVICE_UUID,
  TURN_LIGHTS_OFF_COMMAND,
  TURN_LIGHTS_ON_COMMAND,
  WRITE_CHARACTERISTIC_UUID,
} from '../device-config';
import {btoa} from 'react-native-quick-base64';

const Drive: () => Node = (props: PropsWithDeviceAndManager) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [writeCharacteristic: Characteristic, setWriteCharacteristic] =
    useState(null);
  const [lights, setLights] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const toggleLight = () => {
    writeCharacteristic
      ?.writeWithResponse(
        btoa(lights ? TURN_LIGHTS_OFF_COMMAND : TURN_LIGHTS_ON_COMMAND),
      )
      .then(characteristic => {
        //lighs toggled correctly
      })
      .catch(error => {
        Alert.alert('Error change lights', error.message);
      });
    setLights(!lights);
  };

  const isWorking = () => props.device.isConnected() && writeCharacteristic;

  useFocusEffect(
    useCallback(() => {
      props.device
        .characteristicsForService(SERVICE_UUID)
        .then((characteristics: Characteristic[]) => {
          characteristics.forEach((characteristic: Characteristic) => {
            if (
              characteristic.uuid === WRITE_CHARACTERISTIC_UUID &&
              characteristic.isWritableWithResponse
            ) {
              setWriteCharacteristic(characteristic);
            }
          });
        });
    }, [props.device]),
  );

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
          <View styles={styles.controlButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.lightButtonTouchable,
                !isWorking() ? styles.disabledButton : {},
              ]}
              disabled={!isWorking()}
              onPress={() => toggleLight()}>
              <View
                style={[
                  styles.lightButton,
                  lights ? styles.lightButtonOn : styles.lightButtonOff,
                ]}>
                <Text style={styles.lightButtonText}>Lights</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(mainStyle);

export default Drive;
