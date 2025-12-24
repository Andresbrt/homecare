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

const SmartHomeScreen = ({ navigation }) => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Cerradura inteligente',
      type: 'lock',
      brand: 'August',
      connected: true,
      enabled: true,
      icon: 'lock-smart',
      color: colors.primary,
      action: 'Acceso temporal durante servicio',
    },
    {
      id: 2,
      name: 'Cámara frontal',
      type: 'camera',
      brand: 'Ring',
      connected: true,
      enabled: false,
      icon: 'cctv',
      color: colors.primary, // Turquesa Homecare
      action: 'Grabación durante servicio',
    },
    {
      id: 3,
      name: 'Termostato',
      type: 'thermostat',
      brand: 'Nest',
      connected: true,
      enabled: true,
      icon: 'thermostat',
      color: colors.secondary,
      action: 'Ajuste automático de temperatura',
    },
    {
      id: 4,
      name: 'Luces sala',
      type: 'lights',
      brand: 'Philips Hue',
      connected: false,
      enabled: false,
      icon: 'lightbulb',
      color: colors.warning, // Amarillo
      action: 'Encendido automático',
    },
    {
      id: 5,
      name: 'Aspiradora robot',
      type: 'vacuum',
      brand: 'Roomba',
      connected: true,
      enabled: false,
      icon: 'robot-vacuum',
      color: colors.accent, // Azul Petróleo
      action: 'Pausar durante servicio',
    },
  ]);

  const automations = [
    {
      id: 1,
      name: 'Acceso seguro',
      description: 'Genera código temporal para el proveedor',
      icon: 'key-variant',
      enabled: true,
      color: colors.success,
    },
    {
      id: 2,
      name: 'Monitoreo activo',
      description: 'Activa cámaras durante el servicio',
      icon: 'video',
      enabled: true,
      color: colors.primary,
    },
    {
      id: 3,
      name: 'Ambiente óptimo',
      description: 'Ajusta temperatura y luces',
      icon: 'home-thermometer',
      enabled: false,
      color: colors.secondary,
    },
    {
      id: 4,
      name: 'Notificaciones en tiempo real',
      description: 'Alertas de entrada/salida del proveedor',
      icon: 'bell-ring',
      enabled: true,
      color: colors.warning,
    },
  ];

  const toggleDevice = (deviceId) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              enabled: device.connected ? !device.enabled : false,
            }
          : device
      )
    );
  };

  const handleConnectDevice = (device) => {
    Alert.alert(
      `🔗 Conectar ${device.name}`,
      `Conectaremos tu dispositivo ${device.brand} con CleanHome.\n\n¿Continuar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Conectar',
          onPress: () => {
            Alert.alert('✅ Conectado', `${device.name} conectado exitosamente`);
            setDevices(
              devices.map((d) =>
                d.id === device.id ? { ...d, connected: true } : d
              )
            );
          },
        },
      ]
    );
  };

  const handleAddDevice = () => {
    Alert.alert(
      '➕ Agregar dispositivo',
      'Selecciona el tipo de dispositivo que deseas conectar:',
      [
        { text: 'Cerradura inteligente' },
        { text: 'Cámara de seguridad' },
        { text: 'Termostato' },
        { text: 'Luces inteligentes' },
        { text: 'Otro', style: 'cancel' },
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
          <Text style={styles.headerTitle}>Smart Home</Text>
          <TouchableOpacity onPress={handleAddDevice}>
            <MaterialCommunityIcons name="plus-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <MaterialCommunityIcons name="home-automation" size={40} color={colors.primary} />
          <Text style={styles.heroTitle}>Conecta tu hogar inteligente</Text>
          <Text style={styles.heroSubtitle}>
            Integra tus dispositivos para un servicio más seguro y conveniente
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="devices" size={20} color={colors.primary} />
            <Text style={styles.statValue}>{devices.filter((d) => d.connected).length}</Text>
            <Text style={styles.statLabel}>Conectados</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
            <Text style={styles.statValue}>{devices.filter((d) => d.enabled).length}</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="cog-sync" size={20} color={colors.secondary} />
            <Text style={styles.statValue}>{automations.filter((a) => a.enabled).length}</Text>
            <Text style={styles.statLabel}>Automaciones</Text>
          </View>
        </View>

        {/* Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivos conectados</Text>

          {devices.map((device) => (
            <View
              key={device.id}
              style={[
                styles.deviceCard,
                !device.connected && styles.deviceCardDisconnected,
              ]}
            >
              <View style={styles.deviceLeft}>
                <View
                  style={[
                    styles.deviceIcon,
                    {
                      backgroundColor: device.connected
                        ? device.color + '20'
                        : colors.backgroundLight,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={device.icon}
                    size={28}
                    color={device.connected ? device.color : colors.textMuted}
                  />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceBrand}>{device.brand}</Text>
                  <Text style={styles.deviceAction}>{device.action}</Text>
                  {!device.connected && (
                    <TouchableOpacity
                      style={styles.connectButton}
                      onPress={() => handleConnectDevice(device)}
                    >
                      <MaterialCommunityIcons name="link" size={14} color={colors.primary} />
                      <Text style={styles.connectButtonText}>Conectar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {device.connected && (
                <Switch
                  value={device.enabled}
                  onValueChange={() => toggleDevice(device.id)}
                  trackColor={{ false: colors.borderLight, true: device.color }}
                  thumbColor={colors.white}
                />
              )}
            </View>
          ))}
        </View>

        {/* Automations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automatizaciones</Text>
          {automations.map((automation) => (
            <View key={automation.id} style={styles.automationCard}>
              <View style={styles.automationLeft}>
                <View
                  style={[
                    styles.automationIcon,
                    { backgroundColor: automation.color + '20' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={automation.icon}
                    size={24}
                    color={automation.color}
                  />
                </View>
                <View style={styles.automationInfo}>
                  <Text style={styles.automationName}>{automation.name}</Text>
                  <Text style={styles.automationDescription}>
                    {automation.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={automation.enabled}
                trackColor={{ false: colors.borderLight, true: automation.color }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Beneficios de la integración</Text>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="shield-check" size={20} color={colors.success} />
            <Text style={styles.benefitText}>
              Acceso seguro sin necesidad de llaves físicas
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="eye" size={20} color={colors.success} />
            <Text style={styles.benefitText}>
              Monitoreo en tiempo real del servicio
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="clock-fast" size={20} color={colors.success} />
            <Text style={styles.benefitText}>
              Automatización total sin intervención manual
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="shield-lock" size={20} color={colors.success} />
            <Text style={styles.benefitText}>
              Seguridad y privacidad garantizadas
            </Text>
          </View>
        </View>

        {/* Supported Devices */}
        <View style={styles.supportedCard}>
          <Text style={styles.supportedTitle}>Dispositivos compatibles</Text>
          <View style={styles.brandLogos}>
            <View style={styles.brandLogo}>
              <Text style={styles.brandText}>August</Text>
            </View>
            <View style={styles.brandLogo}>
              <Text style={styles.brandText}>Ring</Text>
            </View>
            <View style={styles.brandLogo}>
              <Text style={styles.brandText}>Nest</Text>
            </View>
            <View style={styles.brandLogo}>
              <Text style={styles.brandText}>Philips Hue</Text>
            </View>
            <View style={styles.brandLogo}>
              <Text style={styles.brandText}>Roomba</Text>
            </View>
            <View style={styles.brandLogo}>
              <Text style={styles.brandText}>Alexa</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver todos los dispositivos compatibles</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={18} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Tus credenciales están encriptadas y nunca las compartimos. Los proveedores solo
            obtienen acceso temporal durante el servicio.
          </Text>
        </View>
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
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  deviceCardDisconnected: {
    backgroundColor: colors.backgroundLight,
    opacity: 0.7,
  },
  deviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  deviceBrand: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  deviceAction: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 6,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  connectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  automationCard: {
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
  automationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  automationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  automationInfo: {
    flex: 1,
  },
  automationName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 3,
  },
  automationDescription: {
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
  supportedCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  supportedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  brandLogos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  brandLogo: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export default SmartHomeScreen;
