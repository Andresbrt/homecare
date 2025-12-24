import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const GuaranteeScreen = ({ route, navigation }) => {
  const { booking } = route.params || {};
  const [selectedIssue, setSelectedIssue] = useState(null);

  const issues = [
    {
      id: 'incomplete',
      name: 'Servicio incompleto',
      description: 'Algunas áreas no fueron limpiadas',
      icon: 'clipboard-check-outline',
      color: colors.warning,
    },
    {
      id: 'quality',
      name: 'Calidad insatisfactoria',
      description: 'El resultado no cumplió las expectativas',
      icon: 'star-outline',
      color: colors.error,
    },
    {
      id: 'damage',
      name: 'Daño a propiedad',
      description: 'Se dañó algún objeto durante el servicio',
      icon: 'alert-circle',
      color: colors.error,
    },
    {
      id: 'delay',
      name: 'Atraso significativo',
      description: 'El proveedor llegó muy tarde',
      icon: 'clock-alert',
      color: colors.warning,
    },
    {
      id: 'unprofessional',
      name: 'Comportamiento no profesional',
      description: 'Actitud o conducta inapropiada',
      icon: 'account-alert',
      color: colors.error,
    },
    {
      id: 'other',
      name: 'Otro problema',
      description: 'Otro motivo de insatisfacción',
      icon: 'help-circle',
      color: colors.textSecondary,
    },
  ];

  const guaranteeSteps = [
    {
      step: 1,
      title: 'Reporta el problema',
      description: 'Describe lo sucedido dentro de las 24h',
      icon: 'file-document-edit',
      color: colors.primary,
    },
    {
      step: 2,
      title: 'Revisión inmediata',
      description: 'Analizamos tu caso en menos de 2 horas',
      icon: 'clock-fast',
      color: colors.secondary,
    },
    {
      step: 3,
      title: 'Solución garantizada',
      description: 'Re-limpieza gratis o reembolso 100%',
      icon: 'check-decagram',
      color: colors.success,
    },
  ];

  const handleSubmitClaim = () => {
    if (!selectedIssue) {
      Alert.alert('Selecciona un problema', 'Por favor indica qué salió mal con tu servicio');
      return;
    }

    const issue = issues.find((i) => i.id === selectedIssue);

    Alert.alert(
      '🛡️ Garantía activada',
      `Problema reportado: ${issue.name}\n\nNuestro equipo revisará tu caso y te contactará en las próximas 2 horas.\n\n¿Cómo deseas que resolvamos esto?`,
      [
        {
          text: 'Re-limpieza gratis',
          onPress: () => {
            Alert.alert(
              '✅ Servicio re-programado',
              'Un profesional diferente visitará tu hogar sin costo en las próximas 24 horas.'
            );
            navigation.goBack();
          },
        },
        {
          text: 'Reembolso 100%',
          onPress: () => {
            Alert.alert(
              '💰 Reembolso procesado',
              'El dinero será devuelto a tu medio de pago en 2-3 días hábiles.'
            );
            navigation.goBack();
          },
        },
        {
          text: 'Hablar con soporte',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Garantía 100%</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="shield-check" size={48} color={colors.success} />
          </View>
          <Text style={styles.heroTitle}>Tu satisfacción es nuestra prioridad</Text>
          <Text style={styles.heroSubtitle}>
            Si algo no cumplió tus expectativas, lo solucionamos de inmediato
          </Text>
        </View>

        {/* Guarantee Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>¿Cómo funciona?</Text>
          {guaranteeSteps.map((step) => (
            <View key={step.step} style={styles.stepRow}>
              <View style={[styles.stepIcon, { backgroundColor: step.color + '20' }]}>
                <Text style={[styles.stepNumber, { color: step.color }]}>{step.step}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
              <MaterialCommunityIcons name={step.icon} size={24} color={step.color} />
            </View>
          ))}
        </View>

        {/* Service Info */}
        {booking && (
          <View style={styles.serviceCard}>
            <Text style={styles.sectionTitle}>Servicio a reportar</Text>
            <View style={styles.serviceInfo}>
              <MaterialCommunityIcons name="broom" size={20} color={colors.primary} />
              <Text style={styles.serviceName}>Limpieza Profunda</Text>
            </View>
            <View style={styles.serviceInfo}>
              <MaterialCommunityIcons name="calendar" size={20} color={colors.textSecondary} />
              <Text style={styles.serviceDate}>
                Hoy, {new Date().toLocaleDateString('es-CO')}
              </Text>
            </View>
          </View>
        )}

        {/* Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué salió mal?</Text>
          <Text style={styles.sectionSubtitle}>Selecciona el problema principal</Text>

          {issues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={[
                styles.issueCard,
                selectedIssue === issue.id && styles.issueCardSelected,
              ]}
              onPress={() => setSelectedIssue(issue.id)}
              activeOpacity={0.7}
            >
              <View style={styles.issueLeft}>
                <View
                  style={[
                    styles.issueIcon,
                    {
                      backgroundColor:
                        selectedIssue === issue.id ? issue.color + '20' : colors.backgroundLight,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={issue.icon}
                    size={24}
                    color={selectedIssue === issue.id ? issue.color : colors.textSecondary}
                  />
                </View>
                <View style={styles.issueInfo}>
                  <Text style={styles.issueName}>{issue.name}</Text>
                  <Text style={styles.issueDescription}>{issue.description}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedIssue === issue.id && styles.radioButtonSelected,
                ]}
              >
                {selectedIssue === issue.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Incluido en tu garantía</Text>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="sync" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Re-limpieza completamente gratis</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="cash-refund" size={20} color={colors.success} />
            <Text style={styles.benefitText}>O reembolso 100% del servicio</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="account-switch" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Proveedor diferente para re-limpieza</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="shield-star" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Prioridad en futuros servicios</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !selectedIssue && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitClaim}
          disabled={!selectedIssue}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="shield-alert" size={20} color={colors.white} />
          <Text style={styles.submitButtonText}>Activar garantía</Text>
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.termsCard}>
          <MaterialCommunityIcons name="information" size={16} color={colors.textSecondary} />
          <Text style={styles.termsText}>
            Tienes 24 horas después del servicio para activar la garantía. Necesitarás evidencia
            fotográfica del problema.
          </Text>
        </View>

        {/* Support Link */}
        <TouchableOpacity style={styles.supportButton}>
          <MaterialCommunityIcons name="headset" size={20} color={colors.primary} />
          <Text style={styles.supportText}>¿Necesitas ayuda? Contacta soporte</Text>
        </TouchableOpacity>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stepsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  serviceCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  serviceDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  issueCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  issueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  issueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  issueInfo: {
    flex: 1,
  },
  issueName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  issueDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  benefitsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  termsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  supportText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default GuaranteeScreen;
