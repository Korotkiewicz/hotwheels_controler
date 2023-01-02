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
  TouchableOpacity,
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

const Drive: () => Node = (props: PropsWithDeviceAndManager) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const toggleLight = () => {
    Alert.alert('Lights ');
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
          <View styles={styles.controlButtonsContainer}>
            <TouchableOpacity
              style={styles.lightButton}
              onPress={() => toggleLight()}>
              <View style={styles.lightButtonTextWrapper}>
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
