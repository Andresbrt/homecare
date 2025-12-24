import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const ModernCard = ({ 
  children, 
  gradient = null, 
  glassEffect = false, 
  glowEffect = false,
  style = {},
  padding = 20,
}) => {
  const cardStyles = [
    styles.card,
    { padding },
    glowEffect && styles.glow,
    style,
  ];

  if (gradient) {
    return (
      <LinearGradient colors={gradient} style={cardStyles}>
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[
      cardStyles,
      glassEffect ? styles.glassCard : styles.solidCard
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  solidCard: {
    backgroundColor: colors.glassWhite,
    borderColor: 'rgba(248, 250, 252, 0.1)',
  },
  glassCard: {
    backgroundColor: 'rgba(248, 250, 252, 0.05)',
    borderColor: 'rgba(248, 250, 252, 0.15)',
    backdropFilter: 'blur(10px)',
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default ModernCard;