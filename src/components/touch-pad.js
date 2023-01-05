/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
import {
  Alert,
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import mainStyle from '../styles/main-style';
import {useRef} from 'react';
import {
  BACKWARD_MAX_THROTTLE,
  FORWARD_MAX_THROTTLE,
  LEFT_MAX_TURN,
  RIGHT_MAX_TURN,
} from '../device-config';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const styles = StyleSheet.create(mainStyle);

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

const CURSOR_SIDE_SIZE = 20;
const CURSOR_HALF_SIDE_SIZE = CURSOR_SIDE_SIZE / 2;
const MIN_DELAY_BETWEEN_MOVE = 1; //milisec

const TouchPad = ({onMove, disabled}): Node => {
  const touch = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const lastMove = useRef(Date.now());
  const touchCenterX = useRef(0);
  const touchCenterY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  const scale = (number, inMin, inMax, outMin, outMax) => {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  const vibrate = () => {
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
  };

  const move = (x: number, y: number) => {
    if (touchEndX.current && x > touchEndX.current) {
      x = touchEndX.current;
    } else if (x < 0) {
      x = 0;
    }

    if (touchEndY.current && y > touchEndY.current) {
      y = touchEndY.current;
    } else if (y < 0) {
      y = 0;
    }

    if (x === touchCenterX.current) {
      vibrate();
    }

    touch.setValue({
      x: x,
      y: y,
    });
    onMove(
      scale(x, 0, touchEndX.current, LEFT_MAX_TURN, RIGHT_MAX_TURN),
      scale(
        y,
        0,
        touchEndY.current,
        FORWARD_MAX_THROTTLE,
        BACKWARD_MAX_THROTTLE,
      ),
    );
  };

  const onLayout = event => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      touchCenterX.current = width / 2;
      touchCenterY.current = height / 2;
      touchEndX.current = width;
      touchEndY.current = height;
      move(touchCenterX.current, touchCenterY.current);
    });
  };

  return (
    <View
      style={[
        styles.touchPadWrapper,
        disabled ? styles.disabledTouchPad : {},
        {padding: CURSOR_HALF_SIDE_SIZE},
      ]}>
      <View
        style={styles.touchPad}
        onStartShouldSetResponder={() => !disabled}
        onMoveShouldSetResponder={() => !disabled}
        onResponderMove={event => {
          if (Date.now() - lastMove.current > MIN_DELAY_BETWEEN_MOVE) {
            move(event.nativeEvent.locationX, event.nativeEvent.locationY);
            lastMove.current = Date.now();
          }
        }}
        onResponderRelease={() => {
          move(touchCenterX.current, touchCenterY.current);
        }}
        onLayout={onLayout}>

        <View style={styles.touchHorizontalLine} />
        <View style={styles.touchVerticallLine} />
        <Animated.View
          style={{
            position: 'absolute',
            left: Animated.subtract(touch.x, CURSOR_HALF_SIDE_SIZE),
            top: Animated.subtract(touch.y, CURSOR_HALF_SIDE_SIZE),
            height: CURSOR_SIDE_SIZE,
            width: CURSOR_SIDE_SIZE,
            borderRadius: CURSOR_HALF_SIDE_SIZE,
            backgroundColor: 'orange',
          }}
        />
      </View>
    </View>
  );
};

export default TouchPad;
