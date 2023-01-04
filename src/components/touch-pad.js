/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
import {
  Alert,
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import mainStyle from '../styles/main-style';
import {useRef, useState} from 'react';
import {Characteristic} from 'react-native-ble-plx';
import {
  BACKWARD_MAX_THROTTLE,
  FORWARD_MAX_THROTTLE,
  LEFT_MAX_TURN,
  RIGHT_MAX_TURN,
} from '../device-config';

const styles = StyleSheet.create(mainStyle);

const CURSOR_SIDE_SIZE = 20;
const CURSOR_HALF_SIDE_SIZE = CURSOR_SIDE_SIZE / 2;

const TouchPad = ({onMove}): Node => {
  const touch = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  const [touchCenterX, setTouchCenterX] = useState(0);
  const [touchCenterY, setTouchCenterY] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const scale = (number, inMin, inMax, outMin, outMax) => {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  const move = (x: number, y: number) => {
    if (touchEndX && x > touchEndX) {
      x = touchEndX;
    } else if (x < 0) {
      x = 0;
    }

    if (touchEndY && y > touchEndY) {
      y = touchEndY;
    } else if (y < 0) {
      y = 0;
    }
    touch.setValue({
      x: x,
      y: y,
    });
    onMove(
      scale(x, 0, touchEndX, LEFT_MAX_TURN, RIGHT_MAX_TURN),
      scale(y, 0, touchEndY, FORWARD_MAX_THROTTLE, BACKWARD_MAX_THROTTLE),
    );
  };

  const onLayout = event => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      const posX = width / 2;
      const posY = height / 2;
      setTouchCenterX(posX);
      setTouchCenterY(posY);
      setTouchEndX(width);
      setTouchEndY(height);
      move(posX, posY);
    });
  };

  return (
    <View
      style={styles.touchPad}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderMove={event =>
        move(event.nativeEvent.locationX, event.nativeEvent.locationY)
      }
      onResponderRelease={() => {
        Animated.spring(touch, {
          toValue: {
            x: touchCenterX,
            y: touchCenterY,
          },
          // left/top are not supported
          useNativeDriver: false,
        }).start();
        move(touchCenterX, touchCenterY);
      }}
      onLayout={onLayout}>
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
  );
};

export default TouchPad;
