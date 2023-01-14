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

  const requestDeviceInfo = () => {
    if (commandCharacteristic && readCharacteristic) {
      commandCharacteristic
        ?.writeWithResponse(btoa(COMMAND_GET_INFO))
        .then(characteristic => {
          //Alert.alert('Get info request goes');
        })
        .catch(error => {
          Alert.alert('Error getting device info');
        });
    }
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

  const monitorDevice = (err, update) => {
    if (err) {
      console.log(`characteristic error: ${err}`);
      console.log(JSON.stringify(err));
    } else {
      let updateValue = atob(update.value);
      if (updateValue.startsWith(COMMAND_CHANGE_MIN_TURN_PREFIX)) {
        setMinTurn(
          Number(
            updateValue.substring(
              COMMAND_CHANGE_MIN_TURN_PREFIX.length,
              updateValue.indexOf(';'),
            ),
          ),
        );
      } else if (updateValue.startsWith(COMMAND_CHANGE_MAX_TURN_PREFIX)) {
        setMaxTurn(
          Number(
            updateValue.substring(
              COMMAND_CHANGE_MAX_TURN_PREFIX.length,
              updateValue.indexOf(';'),
            ),
          ),
        );
      } else if (updateValue.startsWith(COMMAND_CHANGE_MIN_THROTTLE_PREFIX)) {
        setMinThrottle(
          Number(
            updateValue.substring(
              COMMAND_CHANGE_MIN_THROTTLE_PREFIX.length,
              updateValue.indexOf(';'),
            ),
          ),
        );
      } else if (updateValue.startsWith(COMMAND_CHANGE_MAX_THROTTLE_PREFIX)) {
        setMaxThrottle(
          Number(
            updateValue.substring(
              COMMAND_CHANGE_MAX_THROTTLE_PREFIX.length,
              updateValue.indexOf(';'),
            ),
          ),
        );
      } else {
        Alert.alert('Data from HW', updateValue);
      }
    }
  };

  const cancelOptions = () => {
    setOptionModalVisible(false);
  };

  const saveOptions = () => {
    setOptionModalVisible(false);
    commandCharacteristic
      ?.writeWithResponse(btoa(COMMAND_CHANGE_MIN_TURN_PREFIX + minTurn + ';'))
      .then(characteristic => {
        //min turn set correctly
      })
      .catch(error => {
        Alert.alert('Error change min turn', isWorking() ? 'true' : 'false');
      });
    commandCharacteristic
      ?.writeWithResponse(btoa(COMMAND_CHANGE_MAX_TURN_PREFIX + maxTurn + ';'))
      .then(characteristic => {
        //max turn ser correctly
      })
      .catch(error => {
        Alert.alert('Error change max turn', isWorking() ? 'true' : 'false');
      });
    commandCharacteristic
      ?.writeWithResponse(
        btoa(COMMAND_CHANGE_MIN_THROTTLE_PREFIX + minThrottle + ';'),
      )
      .then(characteristic => {
        //min throttle set correctly
      })
      .catch(error => {
        Alert.alert(
          'Error change min throttle',
          isWorking() ? 'true' : 'false',
        );
      });
    commandCharacteristic
      ?.writeWithResponse(
        btoa(COMMAND_CHANGE_MAX_THROTTLE_PREFIX + maxThrottle + ';'),
      )
      .then(characteristic => {
        //max throttle ser correctly
      })
      .catch(error => {
        Alert.alert(
          'Error change max throttle',
          isWorking() ? 'true' : 'false',
        );
      });
  };

  const showOptionsModal = () => {
    requestDeviceInfo();
    setOptionModalVisible(true);
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
                characteristic.monitor(monitorDevice);
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
          <TouchableOpacity
            style={[
              styles.optionButtonTouchable,
              !isWorking() ? styles.disabledButton : {},
            ]}
            disabled={!isWorking()}
            onPress={showOptionsModal}>
            <View style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Options</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.steeringContainer, isPortrait ? styles.steeringContainerPortrait : styles.steeringContainerLandscape]}>
          <TouchPad onMove={move} disabled={!isWorking()}/>
        </View>
      </View>
      <View style={styles.modalWrapper}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={optionModalVisible}
          onRequestClose={() => {
            setOptionModalVisible(!optionModalVisible);
          }}>
          <View>
            <View style={[styles.modalView, {marginTop: statusBarHeight + 50}]}>
              <Text style={styles.modalText}>Adjust steerage:</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputText}>Left Max turn:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMinTurn}
                  keyboardType="numeric">
                  {minTurn}
                </TextInput>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputText}>Right Max turn:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMaxTurn}
                  keyboardType="numeric">
                  {maxTurn}
                </TextInput>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputText}>Min Throttle:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMinThrottle}
                  keyboardType="numeric">
                  {minThrottle}
                </TextInput>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputText}>Max throttle:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMaxThrottle}
                  keyboardType="numeric">
                  {maxThrottle}
                </TextInput>
              </View>
              <View style={styles.centeredView}>
                <Pressable
                  style={[styles.modalButton]}
                  onPress={() => cancelOptions()}>
                  <Text style={styles.modalButtonTextStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={() => saveOptions()}>
                  <Text style={styles.modalButtonTextStyle}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(mainStyle);

export default Drive;
