import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { gradients } from '../theme/gradients';
import { typography, textStyles } from '../theme/typography';

const ModernButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'medium', // small, medium, large
  icon = null,
  iconPosition = 'left', // left, right
  disabled = false,
  gradient = null,
  style = {},
  textStyle = {},
  fullWidth = false,
}) => {
  const getButtonStyles = () => {
    const baseStyle = [
      styles.button,
      styles[`${size}Button`],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      style,
    ];

    if (variant === 'primary') {
      return [...baseStyle, styles.primaryButton];
    } else if (variant === 'secondary') {
      return [...baseStyle, styles.secondaryButton];
    } else if (variant === 'outline') {
      return [...baseStyle, styles.outlineButton];
    } else if (variant === 'ghost') {
      return [...baseStyle, styles.ghostButton];
    }
    
    return baseStyle;
  };

  const getTextStyles = () => {
    const baseTextStyle = [
      styles.text,
      styles[`${size}Text`],
      disabled && styles.disabledText,
      textStyle,
    ];

    if (variant === 'primary') {
      return [...baseTextStyle, styles.primaryText];
    } else if (variant === 'secondary') {
      return [...baseTextStyle, styles.secondaryText];
    } else if (variant === 'outline') {
      return [...baseTextStyle, styles.outlineText];
    } else if (variant === 'ghost') {
      return [...baseTextStyle, styles.ghostText];
    }
    
    return baseTextStyle;
  };

  const renderContent = () => (
    <View style={styles.content}>
      {icon && iconPosition === 'left' && (
        <MaterialCommunityIcons 
          name={icon} 
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
          color={variant === 'primary' ? colors.white : colors.primary}
          style={styles.iconLeft}
        />
      )}
      <Text style={getTextStyles()}>{title}</Text>
      {icon && iconPosition === 'right' && (
        <MaterialCommunityIcons 
          name={icon} 
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
          color={variant === 'primary' ? colors.white : colors.primary}
          style={styles.iconRight}
        />
      )}
    </View>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}>
        <LinearGradient colors={gradient} style={getButtonStyles()}>
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={getButtonStyles()} 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  
  // Sizes
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  
  // Text variants
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  
  // Disabled states
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textMuted,
  },
  
  // Content layout
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default ModernButton;