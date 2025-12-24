import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const ModernNotification = ({
  visible = false,
  type = 'success', // success, error, warning, info
  title,
  message,
  onClose,
  duration = 4000,
  position = 'top', // top, bottom
  hasAction = false,
  actionText = 'Acción',
  onActionPress,
  autoHide = true,
}) => {
  const slideAnim = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoHide && duration > 0) {
        const timer = setTimeout(() => {
          hideNotification();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideNotification();
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getNotificationConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          colors: [colors.success, colors.successLight],
          borderColor: colors.success,
          textColor: colors.white,
        };
      case 'error':
        return {
          icon: 'alert-circle',
          colors: [colors.error, colors.errorLight],
          borderColor: colors.error,
          textColor: colors.white,
        };
      case 'warning':
        return {
          icon: 'alert',
          colors: [colors.warning, colors.warningLight],
          borderColor: colors.warning,
          textColor: colors.white,
        };
      case 'info':
        return {
          icon: 'information',
          colors: [colors.info, colors.infoLight],
          borderColor: colors.info,
          textColor: colors.white,
        };
      default:
        return {
          icon: 'check-circle',
          colors: [colors.success, colors.successLight],
          borderColor: colors.success,
          textColor: colors.white,
        };
    }
  };

  const config = getNotificationConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        [position]: 60,
        left: 20,
        right: 20,
        zIndex: 9999,
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
      }}
    >
      <LinearGradient
        colors={config.colors}
        style={{
          borderRadius: 16,
          padding: 16,
          shadowColor: config.borderColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          borderLeftWidth: 4,
          borderLeftColor: config.borderColor,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
          {/* Ícono */}
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <MaterialCommunityIcons
              name={config.icon}
              size={24}
              color={config.textColor}
            />
          </View>

          {/* Contenido */}
          <View style={{ flex: 1, marginRight: 8 }}>
            {title && (
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: config.textColor,
                marginBottom: message ? 4 : 0,
              }}>
                {title}
              </Text>
            )}
            {message && (
              <Text style={{
                fontSize: 14,
                color: config.textColor,
                opacity: 0.9,
                lineHeight: 20,
              }}>
                {message}
              </Text>
            )}

            {/* Botón de acción */}
            {hasAction && (
              <TouchableOpacity
                onPress={onActionPress}
                style={{
                  marginTop: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  alignSelf: 'flex-start',
                }}
              >
                <Text style={{
                  color: config.textColor,
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  {actionText}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botón cerrar */}
          <TouchableOpacity
            onPress={hideNotification}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={18}
              color={config.textColor}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default ModernNotification;