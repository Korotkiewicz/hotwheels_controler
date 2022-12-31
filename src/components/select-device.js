import {Button, StyleSheet, Text, useColorScheme, View} from 'react-native';
import mainStyle from '../styles/main-style';
import type PropsWithDevice from '../props-with-device';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create(mainStyle);

const SelectDevice = (props: PropsWithDevice): Node => {
  const navigation = useNavigation();

  return (
    <View style={styles.selectDevice}>
      <Text>{props.device.id}</Text>
      <Text>{props.device.title}</Text>
      <Text>{props.device.name}</Text>
      <Text>{props.device.localName}</Text>
      <Button
        title={props.device?.title || props.device?.name || props.device?.localName || 'Unknown'}
        onPress={() => {
          props.setDevice(props.device);
          return navigation.navigate('Options');
        }}
      />
    </View>
  );
};

export default SelectDevice;
