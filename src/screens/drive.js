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
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Modal,
  Pressable,
  TextInput, Dimensions,
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
  READ_CHARACTERISTIC_UUID,
  COMMAND_CHARACTERISTIC_UUID,
  MOVE_CHARACTERISTIC_UUID,
  COMMAND_GET_INFO,
  COMMAND_CHANGE_MIN_TURN_PREFIX,
  COMMAND_CHANGE_MAX_TURN_PREFIX,
  COMMAND_CHANGE_MIN_THROTTLE_PREFIX,
  COMMAND_CHANGE_MAX_THROTTLE_PREFIX,
} from '../device-config';
import {atob, btoa} from 'react-native-quick-base64';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import TouchPad from '../components/touch-pad';
import Settings from '../components/settings';
import {SafeAreaView} from 'react-native-safe-area-context';

const Drive: () => Node = (props: PropsWithDeviceAndManager) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [commandCharacteristic: Characteristic, setCommandCharacteristic] =
    useState(null);
  const [moveCharacteristic: Characteristic, setMoveCharacteristic] =
    useState(null);
  const [readCharacteristic: Characteristic, setReadCharacteristic] =
    useState(null);
  const [lights, setLights] = useState(false);
  const [minTurn, setMinTurn] = useState(0);
  const [maxTurn, setMaxTurn] = useState(180);
  const [minThrottle, setMinThrottle] = useState(0);
  const [maxThrottle, setMaxThrottle] = useState(180);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const statusBarHeight = getStatusBarHeight();
  const canMove = useRef(true);
  const dimensions = useWindowDimensions();
  const [isPortrait, setIsPortrait] = useState(true);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const isWorking = () =>
    props.device?.isConnected() && commandCharacteristic && moveCharacteristic;

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

  const move = (x: number, y: number) => {
    if (canMove.current === true || (x === 0 && y === 0)) {
      canMove.current = false;
      moveCharacteristic
        ?.writeWithResponse(btoa(x + ':' + y))
        .then(characteristic => {
          canMove.current = true;
        })
        .catch(error => {
          canMove.current = true;
          if (isWorking()) {
            Alert.alert('Error during moving', error.message);
          }
        });
    } else {
      //waiting
    }
  };


  useFocusEffect(
    useCallback(() => {
      Dimensions.addEventListener('change', ({window: {width, height}}) => {
        if (width < height) {
          setIsPortrait(true);
        } else {
          setIsPortrait(false);
        }
      });

      props.device
        ?.characteristicsForService(SERVICE_UUID)
        .then((characteristics: Characteristic[]) => {
          characteristics.forEach((characteristic: Characteristic) => {
            if (characteristic.isWritableWithResponse) {
              if (characteristic.uuid === COMMAND_CHARACTERISTIC_UUID) {
                setCommandCharacteristic(characteristic);
              } else if (characteristic.uuid === MOVE_CHARACTERISTIC_UUID) {
                setMoveCharacteristic(characteristic);
              }
            } else {
              if (
                characteristic.uuid === READ_CHARACTERISTIC_UUID &&
                readCharacteristic?.id !== characteristic.id
              ) {
                setReadCharacteristic(characteristic);
              }
            }
          });
        });
    }, [props.device]),
  );

  return (
    <SafeAreaView style={[styles.driver, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={[styles.driveWrapper, isPortrait ? styles.driverWrapperPortrait : styles.driverWrapperLandscape]}>
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
          <Settings 
            isWorking={isWorking()} 
            commandCharacteristic={commandCharacteristic}
            readCharacteristic={readCharacteristic}
          />
        </View>
        <View style={[styles.steeringContainer, isPortrait ? styles.steeringContainerPortrait : styles.steeringContainerLandscape]}>
          <TouchPad onMove={move} disabled={!isWorking()}/>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(mainStyle);

export default Drive;
