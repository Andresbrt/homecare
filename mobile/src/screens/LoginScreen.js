import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import GradientBackground from '../components/GradientBackground';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.0.10:8080/api'; // Cambia a la IP de tu backend cuando pruebes en dispositivo físico

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 3200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim, floatAnim]);

  const glowStyle = useMemo(
    () => ({
      transform: [
        {
          scale: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.12],
          }),
        },
      ],
      opacity: pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.6],
      }),
    }),
    [pulseAnim],
  );

  const floatingStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: floatAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -16],
          }),
        },
      ],
      opacity: floatAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.2, 0.45, 0.2],
      }),
    }),
    [floatAnim],
  );

  const validate = () => {
    const tempErrors = { email: '', password: '' };
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email.trim())) {
      tempErrors.email = 'Ingresa un correo válido';
    }
    if (password.trim().length < 6) {
      tempErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(tempErrors);
    return !tempErrors.email && !tempErrors.password;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Credenciales incorrectas');
      }

      const data = await response.json();
      Alert.alert('¡Bienvenido!', `Hola ${data.user.firstName}, tu sesión está activa.`);
      // Aquí puedes guardar el token con AsyncStorage y navegar al Home.
    } catch (error) {
      Alert.alert('Oops...', error.message || 'No pudimos iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          <View style={styles.headerContainer}>
            <Animated.View style={[styles.glowCircle, styles.glowOne, glowStyle]} />
            <Animated.View style={[styles.glowCircle, styles.glowTwo, floatingStyle]} />
            <LinearGradient
              colors={[colors.primary, colors.primaryAlt]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBadge}
            >
              <Text style={styles.logoEmoji}>🧽</Text>
            </LinearGradient>
            <Text style={styles.brandTitle}>CleanHome</Text>
            <Text style={styles.brandSubtitle}>Tu limpieza inteligente bajo demanda</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Inicia sesión</Text>
            <Text style={styles.cardSubtitle}>
              Conecta con profesionales verificados y agenda tu limpieza personalizada.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="ejemplo@cleanhome.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
              {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
              {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={styles.linkButton} onPress={() => Alert.alert('Recuperar contraseña', 'Implementar flujo de recuperación de contraseña')}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color={colors.textLight} />
                ) : (
                  <Text style={styles.primaryButtonText}>Ingresar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Google', 'Implementar inicio con Google')}>
                <Text style={styles.socialEmoji}>🔐</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Apple', 'Implementar inicio con Apple')}>
                <Text style={styles.socialEmoji}>🍎</Text>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>
                ¿Aún no tienes cuenta?
              </Text>
              <TouchableOpacity onPress={() => Alert.alert('Crear cuenta', 'Navega hacia el registro de usuarios')}>
                <Text style={styles.footerLink}> Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 64 : 80,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  glowCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: colors.primary,
  },
  glowOne: {
    top: -width * 0.5,
    right: -width * 0.3,
  },
  glowTwo: {
    bottom: -width * 0.3,
    left: -width * 0.4,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowRadius: 24,
    shadowOpacity: 0.4,
  },
  logoEmoji: {
    fontSize: 42,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textLight,
  },
  brandSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 16,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: 'rgba(13, 12, 38, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textLight,
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 12,
  },
  inputGroup: {
    marginTop: 24,
  },
  inputLabel: {
    color: colors.textMuted,
    marginBottom: 8,
    fontSize: 14,
  },
  inputWrapper: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
  },
  input: {
    color: colors.textLight,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    marginTop: 6,
    fontSize: 12,
  },
  linkButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  linkText: {
    color: colors.primaryAlt,
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 24,
    borderRadius: 18,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 18,
  },
  primaryButtonText: {
    color: colors.textLight,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textMuted,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 4,
  },
  socialEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  socialText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
