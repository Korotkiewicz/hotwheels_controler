import {BleManager, Device} from 'react-native-ble-plx';

interface PropsWithDeviceAndManager {
  device: Device;
  setDevice: (device: Device) => void;
  bleManager: BleManager;
}

export default PropsWithDeviceAndManager;
