import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import mainStyle from '../styles/main-style';
import type PropsWithDevice from '../props-with-device';
import {BleManager} from 'react-native-ble-plx';
import {useEffect, useState} from 'react';

const styles = StyleSheet.create(mainStyle);

const SelectDevice = (props: PropsWithDevice): Node => {
  const name =
    props.device.title ||
    props.device.name ||
    props.device.localName ||
    props.device.id ||
    'Unknown';
  const [rssi, setRssi] = useState(props.device.rssi);

  useEffect(() => {
    props.device.readRSSI().then(device => {
      setRssi(device.rssi);
    });
  }, [props]);

  return (
    <View style={styles.selectDevice}>
      <TouchableOpacity
        disabled={props.disabled}
        style={[
          styles.selectDeviceButton,
          props.disabled ? styles.disabledButton : {},
        ]}
        onPress={() => props.setDevice(props.device)}>
        <View style={styles.selectDeviceContainer}>
          <View style={styles.selectDeviceInfoWrapper}>
            <View style={styles.selectDeviceNameWrapper}>
              <Text style={styles.selectDeviceName}>{name}</Text>
            </View>
            <View style={styles.selectDeviceIdWrapper}>
              <Text style={styles.selectDeviceId}>{props.device.id}</Text>
            </View>
          </View>
          <View style={styles.selectDeviceSignalWrapper}>
            <Text style={styles.selectDeviceSignal}>{props.device.rssi}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SelectDevice;
