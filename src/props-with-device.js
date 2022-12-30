import {Device} from 'react-native-ble-plx';

interface PropsWithDevice {
  device: Device;
  setDevice: (device: Device) => void;
}

export default PropsWithDevice;
