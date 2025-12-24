import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const GlassCard = ({ 
  children, 
  style = {}, 
  blur = 'light', // light, medium, heavy
  variant = 'glass', // glass, neomorphism, elevated
  ...props 
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return [
          styles.glassBase,
          blur === 'light' && styles.glassLight,
          blur === 'medium' && styles.glassMedium,
          blur === 'heavy' && styles.glassHeavy,
          style
        ];
      case 'neomorphism':
        return [styles.neomorphismCard, style];
      case 'elevated':
        return [styles.elevatedCard, style];
      default:
        return [styles.glassBase, styles.glassLight, style];
    }
  };

  if (variant === 'neomorphism') {
    return (
      <View style={getCardStyle()} {...props}>
        <View style={styles.neomorphismInner}>
          {children}
        </View>
      </View>
    );
  }

  if (variant === 'elevated') {
    return (
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
        style={getCardStyle()}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Glassmorphism styles
  glassBase: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8,
  },
  glassLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  glassMedium: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
  },
  glassHeavy: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(40px)',
  },
  
  // Neomorphism styles
  neomorphismCard: {
    borderRadius: 20,
    backgroundColor: colors.background,
    shadowColor: '#D1D9E6',
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  neomorphismInner: {
    flex: 1,
    borderRadius: 20,
    shadowColor: 'rgba(163, 177, 198, 0.6)',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  
  // Elevated card styles
  elevatedCard: {
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default GlassCard;