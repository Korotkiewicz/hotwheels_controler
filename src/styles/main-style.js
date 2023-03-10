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
  driver: {
    flex: 1,
  },
  driveWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  driverWrapperPortrait: {
    flexDirection: 'column',
  },
  driverWrapperLandscape: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  steeringContainer: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  steeringContainerPortrait: {
    alignItems: 'center',
  },
  steeringContainerLandscape: {
    flex: 3,
    alignItems: 'flex-end',
  },
  modalWrapper: {
    height: 0,
  },
  touchPadWrapper: {
    aspectRatio: 1,
    padding: 10,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: Colors.lighter,
    backgroundColor: Colors.darker,
  },
  touchPad: {
    position: 'relative',
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
  },
  disabledTouchPad: {
    opacity: 0.4,
  },
  touchPadCursor: {
    backgroundColor: 'orange',
  },
  lightButtonTouchable: {
    width: 80,
    height: 80,
    margin: 2,
  },
  optionButtonTouchable: {
    width: 80,
    height: 80,
    margin: 2,
  },
  adjustButtonTouchable: {
    width: 80,
    height: 80,
  },
  lightButton: {
    borderWidth: 5,
    backgroundColor: 'gray',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  optionButton: {
    backgroundColor: 'gray',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  lightButtonOff: {
    borderColor: 'red',
    backgroundColor: 'gray',
  },
  lightButtonOn: {
    borderColor: 'green',
  },
  lightButtonText: {
    color: Colors.white,
    fontSize: 20,
  },
  optionButtonText: {
    color: Colors.white,
    fontSize: 18,
  },
  turnButton: {
    borderWidth: 5,
    backgroundColor: 'gray',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  turnButtonText: {
    color: Colors.white,
    fontSize: 18,
  },
  throttleButton: {
    borderWidth: 5,
    backgroundColor: 'gray',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderTopEndRadius: 20,
  },
  throttleButtonText: {
    color: Colors.white,
    fontSize: 15,
  },
  movingButtonWrapper: {
    padding: 5,
  },
  turnTouchable: {
    width: 80,
    height: 80,
  },
  throttleTouchable: {
    width: 80,
    height: 80,
  },
  touchHorizontalLine: {
    backgroundColor: Colors.lighter,
    width: '100%',
    height: 1,
    position: 'absolute',
    left: 0,
    top: '50%',
  },
  touchVerticallLine: {
    backgroundColor: Colors.lighter,
    height: '100%',
    width: 1,
    position: 'absolute',
    left: '50%',
    top: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#a1a1a1',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  modalButtonPrimary: {
    backgroundColor: '#2196F3',
  },
  modalButtonTextStyle: {
    color: 'white',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    border: 1,
    borderColor: 'gray',
    height: 40,
    width: 80,
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  inputText: {
    justifyContent: 'center',
  },
};

export default mainStyle;
