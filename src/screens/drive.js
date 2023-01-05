/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useRef, useState} from 'react';
import type {Node} from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  useWindowDimensions,
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
  COMMAND_CHARACTERISTIC_UUID,
  TURN_CHARACTERISTIC_UUID,
  THROTTLE_CHARACTERISTIC_UUID,
} from '../device-config';
import {btoa} from 'react-native-quick-base64';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import TouchPad from '../components/touch-pad';

const Drive: () => Node = (props: PropsWithDeviceAndManager) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [commandCharacteristic: Characteristic, setCommandCharacteristic] =
    useState(null);
  const [turnCharacteristic: Characteristic, setTurnCharacteristic] =
    useState(null);
  const [throttleCharacteristic: Characteristic, setThrottleCharacteristic] =
    useState(null);
  const [lights, setLights] = useState(false);
  const statusBarHeight = getStatusBarHeight();
  const canMoveX = useRef(true);
  const canMoveY = useRef(true);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const toggleLight = () => {
    commandCharacteristic
      ?.writeWithResponse(
        btoa(lights ? TURN_LIGHTS_OFF_COMMAND : TURN_LIGHTS_ON_COMMAND),
      )
      .then(characteristic => {
        //lighs toggled correctly
      })
      .catch(error => {
        Alert.alert('Error change lights', isWorking() ? 'true' : 'false');
        isWorking();
      });
    setLights(!lights);
  };

  const turn = (number: number) => {
    if (canMoveX.current === true) {
      canMoveX.current = false;
      turnCharacteristic
        ?.writeWithResponse(btoa(number + ''))
        .then(characteristic => {
          canMoveX.current = true;
        })
        .catch(error => {
          canMoveX.current = true;
          if (isWorking()) {
            Alert.alert('Error during turrning', error.message);
          }
        });
    } else {
      //waiting
    }
  };

  const throttle = (number: number) => {
    if (canMoveY.current === true) {
      canMoveY.current = false;
      throttleCharacteristic
        ?.writeWithResponse(btoa(number + ''))
        .then(characteristic => {
          canMoveY.current = true;
          //throttle correctly
        })
        .catch(error => {
          canMoveY.current = true;
          if (isWorking()) {
            Alert.alert('Error during throttling', error.message);
          }
        });
    } else {
      //waiting
    }
  };

  const move = (x: number, y: number) => {
    turn(x);
    throttle(y);
  };

  const dimensions = useWindowDimensions();

  const isWorking = () =>
    props.device?.isConnected() &&
    commandCharacteristic &&
    turnCharacteristic &&
    throttleCharacteristic;

  useFocusEffect(
    useCallback(() => {
      props.device
        ?.characteristicsForService(SERVICE_UUID)
        .then((characteristics: Characteristic[]) => {
          characteristics.forEach((characteristic: Characteristic) => {
            if (characteristic.isWritableWithResponse) {
              if (characteristic.uuid === COMMAND_CHARACTERISTIC_UUID) {
                setCommandCharacteristic(characteristic);
              } else if (characteristic.uuid === TURN_CHARACTERISTIC_UUID) {
                setTurnCharacteristic(characteristic);
              } else if (characteristic.uuid === THROTTLE_CHARACTERISTIC_UUID) {
                setThrottleCharacteristic(characteristic);
              }
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
      <View
        style={[
          {
            width: '100%',
            height: dimensions.height - statusBarHeight,
            marginTop: -statusBarHeight,
          },
          backgroundStyle,
        ]}>
        <View style={[styles.driveWrapper, {marginTop: statusBarHeight}]}>
          <View style={styles.controlButtonsContainer}>
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
          <View style={styles.steeringContainer}>
            <TouchPad onMove={move}></TouchPad>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(mainStyle);

export default Drive;
