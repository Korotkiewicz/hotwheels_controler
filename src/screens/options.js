/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar, StyleSheet, Text, TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Section from '../components/section';
import {useNavigation} from '@react-navigation/native';
import mainStyle from '../styles/main-style';
import type PropsWithDeviceAndManager from '../props-with-device-and-manager';

const Options: (screenProps) => Node = (props: PropsWithDeviceAndManager) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const selectBluetooth = () => {
    if(props.device && props.device.isConnected()) {
      props.bleManager
        .cancelDeviceConnection(props.device.id)
        .then(device => {})
        .catch(error => Alert.alert('Disconnecting error', error.message + ' Reason: ' + error.reason));
      props.setDevice(null);
    }

    navigation.navigate('SelectBluetooth');
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
            This app will help you to drive your hot wheels via Bluetooth.
          </Section>
          <Section title="Options:">
            <View styles={styles.optionsButtonContainer}>
              <TouchableOpacity
                style={styles.optionsButton}
                onPress={() => selectBluetooth()}
              >
                <View style={styles.optionsButtonTextWrapper}>
                  <Text style={styles.optionsButtonText}>{!props.device ? 'Connect to hot wheels' : 'Disconnect from hot wheels'}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionsButton, !props.device ? styles.disabledButton : {}]}
                disabled={!props.device}
                onPress={() => navigation.navigate('Drive')}
              >
                <View style={styles.optionsButtonTextWrapper}>
                  <Text style={styles.optionsButtonText}>Drive a car</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
    ;
};

const styles = StyleSheet.create(mainStyle);

export default Options;
