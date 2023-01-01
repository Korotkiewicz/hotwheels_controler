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
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Section from '../components/section';
import {useNavigation} from '@react-navigation/native';
import type PropsWithDevice from '../props-with-device';
import mainStyle from '../styles/main-style';

const Options: (screenProps) => Node = (props: PropsWithDevice) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
            <Button
              styles={styles.optionsButton}
              title={!props.device ? 'Connect to hot wheels' : 'Disconnect from hot wheels'}
              onPress={() => navigation.navigate('SelectBluetooth')}
            />
            <Button
              styles={styles.optionsButton}
              title="Drive a car"
              disabled={!props.device}
              onPress={() => Alert.alert('Simple Button pressed')}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(mainStyle);

export default Options;
