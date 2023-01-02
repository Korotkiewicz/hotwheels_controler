import {StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import mainStyle from '../styles/main-style';
import type PropsWithDevice from '../props-with-device';

const styles = StyleSheet.create(mainStyle);

const SelectDevice = (props: PropsWithDevice): Node => {
  const name = props.device.title || props.device.name || props.device.localName || props.device.id || 'Unknown';

  return (
    <View style={styles.selectDevice}>
      <TouchableOpacity
        disabled={props.disabled}
        style={[styles.selectDeviceButton, props.disabled ? styles.disabledButton : {}]}
        onPress={() => props.setDevice(props.device)}
      >
        <View style={styles.selectDeviceNameWrapper}>
          <Text style={styles.selectDeviceName}>{name}</Text>
        </View>
        <View style={styles.selectDeviceIdWrapper}>
          <Text style={styles.selectDeviceId}>{props.device.id}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SelectDevice;
