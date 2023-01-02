import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

const mainStyle = {
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  disabledText: {
    color: 'gray',
  },
  optionsButtonContainer: {
    alignItems: 'left',
    width: '100%',
  },
  optionsButton: {
    backgroundColor: '#007bff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  optionsButtonTextWrapper: {
    alignItems: 'center',
  },
  optionsButtonText: {
    color: 'white',
  },
  device: {
    flex: 1,
    paddingTop: 15,
    fontSize: 18,
    fontWeight: '400',
  },
  selectDevice: {
    borderBottomWidth: 1,
    borderBottomColor: '#B8B8B8',
    marginBottom: 5,
  },
  selectDeviceContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectDeviceInfoWrapper: {
    flex: 9,
  },
  selectDeviceSignalWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 30,
    paddingLeft: 10,
  },
  selectDeviceButton: {
    height: 70,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  selectDeviceNameWrapper: {
    flex: 1,
    marginBottom: 10,
  },
  selectDeviceName: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  selectDeviceIdWrapper: {
    flex: 1,
  },
  selectDeviceId: {
    fontSize: 12,
    color: 'gray',
  },
  selectDeviceSignal: {
    fontSize: 16,
    color: Colors.primary,
  },
  selectDeviceSignalDB: {
    fontSize: 10,
    color: 'gray',
  },
};

export default mainStyle;
