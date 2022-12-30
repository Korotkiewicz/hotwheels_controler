import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import mainStyle from '../styles/main-style';
import type PropsWithDevice from '../props-with-device';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create(mainStyle);

const SelectDevice = (props: PropsWithDevice): Node => {
  const navigation = useNavigation();

  return (
    <View style={styles.selectDevice}>
      <Button
        title={props.device.title}
        onPress={() => {
          props.setDevice(props.device);
          return navigation.navigate('Options');
        }}
      />
    </View>
  );
};

export default SelectDevice;
