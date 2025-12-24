import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Image, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

console.log('📦 LoadingScreen cargado');

const LoadingScreen = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const appName = Constants?.expoConfig?.name || 'CleanHome';
  const brandLogoUri = Constants?.expoConfig?.extra?.brand?.logoUri || Constants?.expoConfig?.extra?.brand?.logoPrimary || null;

  return (
    <GradientBackground>
      <View style={styles.container}>
        {brandLogoUri ? (
          <Image source={{ uri: brandLogoUri }} style={styles.logoImage} resizeMode="contain" />
        ) : (
          <View style={styles.badgePlain}>
            <Text style={styles.badgeEmoji}>🧽</Text>
          </View>
        )}
        <Text style={styles.title}>{appName}</Text>
        <Text style={styles.subtitle}>Preparando tu experiencia…</Text>
        <ActivityIndicator color="#0E4D68" style={styles.loader} size="large" />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  // Se elimina el glow para mantener fondo blanco puro
  badge: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 8,
  },
  badgePlain: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
  },
  logoImage: {
    width: 160,
    height: 80,
    marginBottom: 18,
  },
  badgeEmoji: {
    fontSize: 42,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#001B38',
  },
  subtitle: {
    marginTop: 12,
    color: '#0E4D68',
    fontSize: 16,
  },
  loader: {
    marginTop: 32,
  },
});

export default LoadingScreen;
