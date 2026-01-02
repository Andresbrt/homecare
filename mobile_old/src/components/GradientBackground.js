import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const GradientBackground = ({ children }) => (
  <LinearGradient
    colors={[colors.background, colors.backgroundAlt]}
    start={{ x: 0.1, y: 0 }}
    end={{ x: 0.9, y: 1 }}
    style={styles.gradient}
  >
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;
