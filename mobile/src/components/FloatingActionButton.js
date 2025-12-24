import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, gradients } from '../theme/index';

const FloatingActionButton = ({
  icon = 'plus',
  onPress,
  size = 56,
  variant = 'primary', // primary, secondary, accent
  position = 'bottomRight', // bottomRight, bottomLeft, bottomCenter
  offsetX = 20,
  offsetY = 20,
  elevation = 8,
  style,
  disabled = false,
  badge = null,
  pulsing = false,
  children,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (pulsing) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [pulsing]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute',
      zIndex: 1000,
    };

    switch (position) {
      case 'bottomRight':
        return { ...baseStyle, bottom: offsetY, right: offsetX };
      case 'bottomLeft':
        return { ...baseStyle, bottom: offsetY, left: offsetX };
      case 'bottomCenter':
        return { 
          ...baseStyle, 
          bottom: offsetY, 
          left: '50%', 
          marginLeft: -size / 2 
        };
      default:
        return { ...baseStyle, bottom: offsetY, right: offsetX };
    }
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return gradients.primary;
      case 'secondary':
        return gradients.secondary;
      case 'accent':
        return [colors.accent, colors.accentAlt];
      default:
        return gradients.primary;
    }
  };

  const getShadowColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        getPositionStyle(),
        {
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) }
          ],
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={disabled}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          shadowColor: getShadowColor(),
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: elevation,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children || (
            <MaterialCommunityIcons
              name={icon}
              size={size * 0.4}
              color={colors.white}
            />
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Badge de notificación */}
      {badge && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            backgroundColor: colors.error,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.white,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: 12,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default FloatingActionButton;