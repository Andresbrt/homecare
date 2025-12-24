import React, { useContext, useState } from 'react';
import {
  Alert,
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

const JobApplicationScreen = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user?.lastName ?? ''}`.trim() : '',
    email: user?.email ?? '',
    phone: '',
    experience: '',
    specialties: '',
    availability: '',
    motivation: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      Alert.alert('Datos faltantes', 'Nombre, correo y teléfono son obligatorios.');
      return;
    }

    try {
      setSubmitting(true);
      // Aquí podrías llamar a tu API: await fetch(...)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      Alert.alert(
        '¡Postulación enviada!',
        'Nuestro equipo revisará tu perfil y te contactará dentro de las próximas 48 horas.',
      );
      setForm((prev) => ({
        ...prev,
        experience: '',
        specialties: '',
        availability: '',
        motivation: '',
      }));
    } catch (error) {
      Alert.alert('No pudimos enviar tu postulación', error.message || 'Intenta nuevamente');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <LinearGradient colors={[colors.primary, colors.primaryAlt]} style={styles.heroGradient}>
              <MaterialCommunityIcons name="briefcase-check" size={48} color="rgba(255,255,255,0.9)" />
              <View style={styles.heroTextWrapper}>
                <Text style={styles.heroTitle}>Únete a Homecare Pro</Text>
                <Text style={styles.heroSubtitle}>
                  Conecta con cientos de familias que buscan tu talento en limpieza profesional.
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Datos personales</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre completo *</Text>
              <TextInput
                value={form.fullName}
                onChangeText={(text) => updateField('fullName', text)}
                placeholder="Tu nombre y apellidos"
                placeholderTextColor={colors.inputPlaceholder}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo electrónico *</Text>
              <TextInput
                value={form.email}
                onChangeText={(text) => updateField('email', text)}
                placeholder="nombre@dominio.com"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                value={form.phone}
                onChangeText={(text) => updateField('phone', text)}
                placeholder="Número con WhatsApp"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Experiencia</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Cuéntanos sobre tu experiencia</Text>
              <TextInput
                value={form.experience}
                onChangeText={(text) => updateField('experience', text)}
                placeholder="Años de experiencia, certificaciones, clientes destacados"
                placeholderTextColor={colors.inputPlaceholder}
                multiline
                style={[styles.input, styles.multiline]}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Especialidades</Text>
              <TextInput
                value={form.specialties}
                onChangeText={(text) => updateField('specialties', text)}
                placeholder="Ej. limpieza profunda, pet-friendly, oficinas"
                placeholderTextColor={colors.inputPlaceholder}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Disponibilidad y zonas</Text>
              <TextInput
                value={form.availability}
                onChangeText={(text) => updateField('availability', text)}
                placeholder="Días, horarios y zonas donde puedes trabajar"
                placeholderTextColor={colors.inputPlaceholder}
                multiline
                style={[styles.input, styles.multiline]}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Carta de motivación</Text>
            <TextInput
              value={form.motivation}
              onChangeText={(text) => updateField('motivation', text)}
              placeholder="¿Por qué quieres ser parte de CleanHome?"
              placeholderTextColor={colors.inputPlaceholder}
              multiline
              style={[styles.input, styles.multiline]}
            />
          </View>

          <LinearGradient colors={[colors.primary, colors.accent]} style={styles.submitGradient}>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <MaterialCommunityIcons name="send" size={20} color={colors.white} />
              <Text style={styles.submitText}>{submitting ? 'Enviando...' : 'Enviar postulación'}</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.helperTextContainer}>
            <MaterialCommunityIcons name="shield-check" size={18} color={colors.primary} />
            <Text style={styles.helperText}>
              Revisamos cada solicitud manualmente. Tus datos se usarán solo para validar tu perfil profesional.
            </Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 140,
  },
  header: {
    marginBottom: 24,
  },
  heroGradient: {
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextWrapper: {
    flex: 1,
    marginLeft: 20,
  },
  heroTitle: {
    color: colors.textLight,
    fontSize: 22,
    fontWeight: '700',
  },
  heroSubtitle: {
    marginTop: 8,
    color: colors.textLight,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: '700',
  },
  fieldGroup: {
    marginTop: 18,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    color: colors.inputText,
    fontSize: 15,
    fontWeight: '500',
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  submitGradient: {
    borderRadius: 20,
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButton: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
  helperTextContainer: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 102, 255, 0.08)',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 102, 255, 0.15)',
  },
  helperText: {
    marginLeft: 12,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});

export default JobApplicationScreen;
