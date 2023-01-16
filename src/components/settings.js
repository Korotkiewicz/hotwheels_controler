import React, {useCallback, useState} from 'react';
import type {Node} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import mainStyle from '../styles/main-style';
import {Characteristic} from 'react-native-ble-plx';
import {useFocusEffect} from '@react-navigation/native';
import {
  COMMAND_GET_INFO,
  COMMAND_CHANGE_MIN_TURN_PREFIX,
  COMMAND_CHANGE_MAX_TURN_PREFIX,
  COMMAND_CHANGE_MIN_THROTTLE_PREFIX,
  COMMAND_CHANGE_MAX_THROTTLE_PREFIX,
} from '../device-config';
import {atob, btoa} from 'react-native-quick-base64';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const Settings: () => Node = ({
  commandCharacteristic,
  readCharacteristic,
  isWorking,
}) => {
  const [minTurn, setMinTurn] = useState(0);
  const [maxTurn, setMaxTurn] = useState(180);
  const [minThrottle, setMinThrottle] = useState(0);
  const [maxThrottle, setMaxThrottle] = useState(180);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [monitorSubscription, setMonitorSubscription] = useState(null);
  const statusBarHeight = getStatusBarHeight();

  const requestDeviceInfo = () => {
    if (commandCharacteristic && readCharacteristic) {
      commandCharacteristic
        ?.writeWithResponse(btoa(COMMAND_GET_INFO))
        .then(characteristic => {
          //done correctly
        })
        .catch(error => {
          Alert.alert('Error getting device info');
        });
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
        Alert.alert('Error change min turn', isWorking ? 'true' : 'false');
      });
    commandCharacteristic
      ?.writeWithResponse(btoa(COMMAND_CHANGE_MAX_TURN_PREFIX + maxTurn + ';'))
      .then(characteristic => {
        //max turn ser correctly
      })
      .catch(error => {
        Alert.alert('Error change max turn', isWorking ? 'true' : 'false');
      });
    commandCharacteristic
      ?.writeWithResponse(
        btoa(COMMAND_CHANGE_MIN_THROTTLE_PREFIX + minThrottle + ';'),
      )
      .then(characteristic => {
        //min throttle set correctly
      })
      .catch(error => {
        Alert.alert('Error change min throttle', isWorking ? 'true' : 'false');
      });
    commandCharacteristic
      ?.writeWithResponse(
        btoa(COMMAND_CHANGE_MAX_THROTTLE_PREFIX + maxThrottle + ';'),
      )
      .then(characteristic => {
        //max throttle ser correctly
      })
      .catch(error => {
        Alert.alert('Error change max throttle', isWorking ? 'true' : 'false');
      });
  };

  const showOptionsModal = () => {
    requestDeviceInfo();
    setOptionModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      if (monitorSubscription) {
        monitorSubscription.remove();
      }

      let subscription = readCharacteristic.monitor(monitorDevice);
      setMonitorSubscription(subscription);
    }, [readCharacteristic, monitorSubscription]),
  );

  return (
    <>
      <TouchableOpacity
        style={[
          styles.optionButtonTouchable,
          !isWorking ? styles.disabledButton : {},
        ]}
        disabled={!isWorking}
        onPress={showOptionsModal}>
        <View style={styles.optionButton}>
          <Text style={styles.optionButtonText}>Options</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.modalWrapper}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={optionModalVisible}
          onRequestClose={() => {
            setOptionModalVisible(!optionModalVisible);
          }}>
          <View>
            <View style={[styles.modalView, {marginTop: statusBarHeight + '50'}]}>
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
    </>
  );
};

const styles = StyleSheet.create(mainStyle);

export default Settings;
