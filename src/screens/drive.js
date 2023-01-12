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
  useWindowDimensions, Modal, Pressable, TextInput,
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
  MOVE_CHARACTERISTIC_UUID, COMMAND_CHANGE_MIN_TURN_PREFIX, COMMAND_CHANGE_MAX_TURN_PREFIX,
} from '../device-config';
import {btoa} from 'react-native-quick-base64';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import TouchPad from '../components/touch-pad';

const Drive: () => Node = (props: PropsWithDeviceAndManager) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [commandCharacteristic: Characteristic, setCommandCharacteristic] =
    useState(null);
  const [moveCharacteristic: Characteristic, setMoveCharacteristic] =
    useState(null);
  const [lights, setLights] = useState(false);
  const [minTurn, setMinTurn] = useState(0);
  const [maxTurn, setMaxTurn] = useState(100);
  const [minThrottle, setMinThrottle] = useState(0);
  const [maxThrottle, setMaxThrottle] = useState(180);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const statusBarHeight = getStatusBarHeight();
  const canMove = useRef(true);
  const dimensions = useWindowDimensions();

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

  const saveOptions = () => {
    setOptionModalVisible(false);
    commandCharacteristic
      ?.writeWithResponse(
        btoa(COMMAND_CHANGE_MIN_TURN_PREFIX + minTurn + ';'),
      )
      .then(characteristic => {
        //min turn set correctly
      })
      .catch(error => {
        Alert.alert('Error change min turn', isWorking() ? 'true' : 'false');
        isWorking();
      });
    commandCharacteristic
      ?.writeWithResponse(
        btoa(COMMAND_CHANGE_MAX_TURN_PREFIX + maxTurn + ';'),
      )
      .then(characteristic => {
        //max turn ser correctly
      })
      .catch(error => {
        Alert.alert('Error change max turn', isWorking() ? 'true' : 'false');
        isWorking();
      });
    commandCharacteristic
      ?.writeWithResponse(
        btoa(COMMAND_CHANGE_MIN_THROTTLE_PREFIX + minThrottle + ';'),
      )
      .then(characteristic => {
        //min throttle set correctly
      })
      .catch(error => {
        Alert.alert('Error change min throttle', isWorking() ? 'true' : 'false');
        isWorking();
      });
    commandCharacteristic
      ?.writeWithResponse(
        btoa(COMMAND_CHANGE_MAX_THROTTLE_PREFIX + maxThrottle + ';'),
      )
      .then(characteristic => {
        //max throttle ser correctly
      })
      .catch(error => {
        Alert.alert('Error change max throttle', isWorking() ? 'true' : 'false');
        isWorking();
      });
  };

  useFocusEffect(
    useCallback(() => {
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
            <TouchableOpacity
              style={[
                styles.optionButtonTouchable,
                !isWorking() ? styles.disabledButton : {},
              ]}
              disabled={!isWorking()}
              onPress={() => setOptionModalVisible(true)}>
              <View
                style={styles.optionButton}>
                <Text style={styles.optionButtonText}>Options</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.steeringContainer}>
            <TouchPad onMove={move} disabled={!isWorking()} />
          </View>
        </View>
      </View>
      <View style={styles.modalWrapper}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={optionModalVisible}
          onRequestClose={() => {
            setOptionModalVisible(!optionModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, {marginTop: statusBarHeight + 50}]}>
              <Text style={styles.modalText}>Adjust steerage:</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.modalText}>Left Max turn:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMinTurn}
                  value={minTurn}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.modalText}>Right Max turn:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMaxTurn}
                  defaultValue={maxTurn}
                  value={maxTurn}
                  keyboardType="numeric"
                />
              </View>
               style={styles.inputWrapper}>
                <Text style={styles.modalText}>Min Throttle:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMinThrottle}
                  value={minThrottle}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.modalText}>Max throttle:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMaxThrottle}
                  defaultValue={maxThrottle}
                  value={maxThrottle}
                  keyboardType="numeric"
                />
              </View>
              <Pressable
                style={[styles.modalButton, styles.modalButtonClose]}
                onPress={() => saveOptions()}
              >
                <Text style={styles.modalButtonTextStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(mainStyle);

export default Drive;
