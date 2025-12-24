import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, gradients } from '../theme/index';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend, // 'up', 'down', 'neutral'
  trendValue,
  variant = 'primary', // primary, secondary, success, warning, error
  animated = true,
  style,
  iconBackgroundColor,
  compact = false,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          gradient: gradients.glassPrimary,
          iconColor: colors.primary,
          valueColor: colors.textDark,
        };
      case 'secondary':
        return {
          gradient: gradients.glassSecondary,
          iconColor: colors.secondary,
          valueColor: colors.textDark,
        };
      case 'success':
        return {
          gradient: gradients.glassSuccess,
          iconColor: colors.success,
          valueColor: colors.textDark,
        };
      case 'warning':
        return {
          gradient: ['rgba(250,173,20,0.15)', 'rgba(250,173,20,0.05)'],
          iconColor: colors.warning,
          valueColor: colors.textDark,
        };
      case 'error':
        return {
          gradient: ['rgba(255,77,79,0.15)', 'rgba(255,77,79,0.05)'],
          iconColor: colors.error,
          valueColor: colors.textDark,
        };
      default:
        return {
          gradient: gradients.glassPrimary,
          iconColor: colors.primary,
          valueColor: colors.textDark,
        };
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'neutral':
        return 'trending-neutral';
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.success;
      case 'down':
        return colors.error;
      case 'neutral':
        return colors.textMuted;
      default:
        return colors.textMuted;
    }
  };

  const variantColors = getVariantColors();

  return (
    <Animated.View
      style={[
        {
          opacity: animated ? fadeAnim : 1,
          transform: [
            {
              translateY: animated 
                ? slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                : 0,
            },
            { scale: animated ? scaleAnim : 1 },
          ],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={variantColors.gradient}
        style={{
          padding: compact ? 16 : 20,
          borderRadius: 16,
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.textDark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          {/* Ícono */}
          {icon && (
            <View style={{
              width: compact ? 40 : 48,
              height: compact ? 40 : 48,
              borderRadius: compact ? 12 : 16,
              backgroundColor: iconBackgroundColor || `${variantColors.iconColor}20`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: compact ? 8 : 12,
            }}>
              <MaterialCommunityIcons
                name={icon}
                size={compact ? 20 : 24}
                color={variantColors.iconColor}
              />
            </View>
          )}

          {/* Trend indicator */}
          {trend && trendValue && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: `${getTrendColor()}15`,
            }}>
              <MaterialCommunityIcons
                name={getTrendIcon()}
                size={14}
                color={getTrendColor()}
                style={{ marginRight: 4 }}
              />
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: getTrendColor(),
              }}>
                {trendValue}
              </Text>
            </View>
          )}
        </View>

        {/* Valor principal */}
        <Text style={{
          fontSize: compact ? 24 : 32,
          fontWeight: 'bold',
          color: variantColors.valueColor,
          marginBottom: 4,
        }}>
          {value}
        </Text>

        {/* Título */}
        <Text style={{
          fontSize: compact ? 14 : 16,
          fontWeight: '600',
          color: colors.textDark,
          marginBottom: subtitle ? 4 : 0,
        }}>
          {title}
        </Text>

        {/* Subtítulo */}
        {subtitle && (
          <Text style={{
            fontSize: 12,
            color: colors.textMuted,
            lineHeight: 16,
          }}>
            {subtitle}
          </Text>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

export default StatsCard;