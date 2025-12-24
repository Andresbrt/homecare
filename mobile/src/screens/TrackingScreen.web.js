import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const TrackingScreen = () => {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>🚧 Seguimiento en Vivo</Text>
        <Text style={styles.subtitle}>
          Esta función requiere GPS y mapas nativos.
        </Text>
        <Text style={styles.info}>
          Por favor, usa la aplicación móvil para acceder al seguimiento en tiempo real.
        </Text>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.textMuted,
    marginBottom: 12,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default TrackingScreen;
