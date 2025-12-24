import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const VacationModeScreen = ({ navigation }) => {
  const [isVacationMode, setIsVacationMode] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('weekly');
  const [selectedServices, setSelectedServices] = useState(['cleaning', 'inspection']);
  const [notifications, setNotifications] = useState(true);
  const [photoReports, setPhotoReports] = useState(true);

  const frequencies = [
    { id: 'daily', name: 'Diario', description: 'Ideal para ausencias largas', price: 45000 },
    { id: 'weekly', name: 'Semanal', description: 'Recomendado para vacaciones', price: 55000 },
    { id: 'biweekly', name: 'Quincenal', description: 'Para propiedades secundarias', price: 68000 },
  ];

  const services = [
    {
      id: 'cleaning',
      name: 'Limpieza ligera',
      description: 'Barrido, trapeo y ventilación',
      icon: 'broom',
      included: true,
    },
    {
      id: 'inspection',
      name: 'Inspección general',
      description: 'Revisión de seguridad y condiciones',
      icon: 'shield-search',
      included: true,
    },
    {
      id: 'plants',
      name: 'Riego de plantas',
      description: 'Cuidado de plantas de interior/exterior',
      icon: 'sprout',
      price: 15000,
    },
    {
      id: 'mail',
      name: 'Recolección de correo',
      description: 'Organización de correspondencia',
      icon: 'mailbox',
      price: 10000,
    },
    {
      id: 'windows',
      name: 'Apertura de ventanas',
      description: 'Ventilación programada',
      icon: 'window-open',
      price: 8000,
    },
    {
      id: 'maintenance',
      name: 'Alertas de mantenimiento',
      description: 'Detección de problemas (fugas, etc)',
      icon: 'alert',
      included: true,
    },
  ];

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const calculateTotal = () => {
    const basePrice = frequencies.find((f) => f.id === selectedFrequency)?.price || 0;
    const additionalServices = services
      .filter((s) => selectedServices.includes(s.id) && s.price)
      .reduce((sum, s) => sum + s.price, 0);
    return basePrice + additionalServices;
  };

  const handleActivate = () => {
    Alert.alert(
      '🏖️ Activar Modo Vacaciones',
      `Tu hogar estará protegido mientras no estás.\n\n📅 Frecuencia: ${
        frequencies.find((f) => f.id === selectedFrequency)?.name
      }\n📋 Servicios: ${selectedServices.length}\n💰 Costo por visita: ${formatCOP(calculateTotal())}\n\n¿Deseas activar el modo vacaciones?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Activar',
          onPress: () => {
            setIsVacationMode(true);
            Alert.alert(
              '✅ ¡Activado!',
              'Modo vacaciones activado. Tu hogar está protegido. ¡Disfruta tu viaje!'
            );
          },
        },
      ]
    );
  };

  const handleDeactivate = () => {
    Alert.alert('🏠 Desactivar Modo Vacaciones', '¿Has regresado de tu viaje?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Desactivar',
        onPress: () => {
          setIsVacationMode(false);
          Alert.alert('✅ Desactivado', '¡Bienvenido de vuelta! El modo vacaciones ha sido desactivado.');
        },
      },
    ]);
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modo Vacaciones</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="help-circle" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            isVacationMode && { backgroundColor: colors.success + '15', borderColor: colors.success },
          ]}
        >
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: isVacationMode ? colors.success : colors.textMuted },
              ]}
            >
              <MaterialCommunityIcons
                name={isVacationMode ? 'home-lock' : 'home-outline'}
                size={28}
                color={colors.white}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>
                {isVacationMode ? '🏖️ Modo activo' : 'Modo desactivado'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isVacationMode
                  ? 'Tu hogar está siendo monitoreado'
                  : 'Activa para proteger tu hogar'}
              </Text>
            </View>
          </View>
          <Switch
            value={isVacationMode}
            onValueChange={isVacationMode ? handleDeactivate : handleActivate}
            trackColor={{ false: colors.borderLight, true: colors.success }}
            thumbColor={colors.white}
          />
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Mientras estás fuera, un profesional visitará tu hogar según la frecuencia seleccionada
          </Text>
        </View>

        {/* Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frecuencia de visitas</Text>
          {frequencies.map((freq) => (
            <TouchableOpacity
              key={freq.id}
              style={[
                styles.frequencyCard,
                selectedFrequency === freq.id && styles.frequencyCardSelected,
              ]}
              onPress={() => setSelectedFrequency(freq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.frequencyLeft}>
                <View
                  style={[
                    styles.radioButton,
                    selectedFrequency === freq.id && styles.radioButtonSelected,
                  ]}
                >
                  {selectedFrequency === freq.id && <View style={styles.radioButtonInner} />}
                </View>
                <View style={styles.frequencyInfo}>
                  <Text style={styles.frequencyName}>{freq.name}</Text>
                  <Text style={styles.frequencyDescription}>{freq.description}</Text>
                </View>
              </View>
              <Text style={styles.frequencyPrice}>{formatCOP(freq.price)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios incluidos y adicionales</Text>
          {services.map((service) => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  isSelected && styles.serviceCardSelected,
                  service.included && styles.serviceCardIncluded,
                ]}
                onPress={() => !service.included && toggleService(service.id)}
                activeOpacity={service.included ? 1 : 0.7}
                disabled={service.included}
              >
                <View style={styles.serviceLeft}>
                  <View
                    style={[
                      styles.serviceIcon,
                      {
                        backgroundColor: isSelected
                          ? colors.primary + '20'
                          : colors.backgroundLight,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={service.icon}
                      size={24}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.serviceInfo}>
                    <View style={styles.serviceHeader}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      {service.included && (
                        <View style={styles.includedBadge}>
                          <Text style={styles.includedText}>Incluido</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  </View>
                </View>
                <View style={styles.serviceRight}>
                  {service.price && (
                    <Text style={styles.servicePrice}>+{formatCOP(service.price)}</Text>
                  )}
                  {!service.included && (
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <MaterialCommunityIcons name="check" size={16} color={colors.white} />
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opciones adicionales</Text>
          
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="bell" size={20} color={colors.primary} />
              <View style={styles.optionInfo}>
                <Text style={styles.optionName}>Notificaciones</Text>
                <Text style={styles.optionDescription}>
                  Recibe alertas después de cada visita
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.borderLight, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="camera" size={20} color={colors.primary} />
              <View style={styles.optionInfo}>
                <Text style={styles.optionName}>Reportes fotográficos</Text>
                <Text style={styles.optionDescription}>
                  Fotos de cada habitación en cada visita
                </Text>
              </View>
            </View>
            <Switch
              value={photoReports}
              onValueChange={setPhotoReports}
              trackColor={{ false: colors.borderLight, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Beneficios del Modo Vacaciones</Text>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="shield-check" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Seguridad: Detección temprana de problemas</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="camera-account" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Evidencia fotográfica de cada visita</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="home-heart" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Hogar fresco y ventilado a tu regreso</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="account-check" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Profesionales verificados y de confianza</Text>
          </View>
        </View>

        {/* Total & CTA */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Costo por visita</Text>
            <Text style={styles.totalValue}>{formatCOP(calculateTotal())}</Text>
          </View>
          <Text style={styles.totalNote}>
            Cobro después de cada visita completada • Cancela cuando quieras
          </Text>
        </View>

        {!isVacationMode && (
          <TouchableOpacity
            style={styles.activateButton}
            onPress={handleActivate}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="shield-home" size={20} color={colors.white} />
            <Text style={styles.activateButtonText}>Activar Modo Vacaciones</Text>
          </TouchableOpacity>
        )}

        {isVacationMode && (
          <View style={styles.activeInfo}>
            <View style={styles.activeInfoRow}>
              <MaterialCommunityIcons name="calendar-check" size={20} color={colors.success} />
              <Text style={styles.activeInfoText}>Próxima visita: Mañana 10:00 AM</Text>
            </View>
            <TouchableOpacity style={styles.deactivateButton} onPress={handleDeactivate}>
              <Text style={styles.deactivateButtonText}>Desactivar modo vacaciones</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  frequencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  frequencyCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  frequencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  frequencyInfo: {
    flex: 1,
  },
  frequencyName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  frequencyDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  frequencyPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  serviceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  serviceCardIncluded: {
    backgroundColor: colors.backgroundLight,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 8,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  includedBadge: {
    backgroundColor: colors.success + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  includedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  serviceDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  serviceRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  benefitsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    fontSize: 13,
    color: colors.textSecondary,
  },
  totalCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  totalNote: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  activateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  activeInfo: {
    backgroundColor: colors.success + '15',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  activeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  activeInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  deactivateButton: {
    alignItems: 'center',
    padding: 12,
  },
  deactivateButtonText: {
    fontSize: 13,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default VacationModeScreen;
