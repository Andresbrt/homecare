import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Linking,
  Share,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
 import { AuthContext } from '../context/AuthContext';
 import { colors } from '../theme/colors';
 import * as Location from 'expo-location';
 import Constants from 'expo-constants';const EmergencyServiceScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [coords, setCoords] = useState(null);
  const [pulseAnimation] = useState(new Animated.Value(1));
  // Números de emergencia (leídos de extra con fallback a 123)
  const EMERGENCY_NUMBERS = {
    unified: Constants?.expoConfig?.extra?.emergency?.unified || '123',
    police: Constants?.expoConfig?.extra?.emergency?.police || '123',
    ambulance: Constants?.expoConfig?.extra?.emergency?.ambulance || '123',
    fire: Constants?.expoConfig?.extra?.emergency?.fire || '123',
  };

  useEffect(() => {
    // Animación de pulso para el botón de emergencia
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const callNumber = async (number) => {
    try {
      await Linking.openURL(`tel:${number}`);
    } catch (e) {
      Alert.alert('No se pudo iniciar la llamada');
    }
  };

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de ubicación denegado');
        return null;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const c = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setCoords(c);
      return c;
    } catch (e) {
      Alert.alert('No se pudo obtener la ubicación');
      return null;
    }
  };

  const shareMyLocation = async () => {
    const c = coords || (await requestLocation());
    if (!c) return;
    const mapsLink = `https://maps.google.com/?q=${c.lat},${c.lng}`;
    const message = `Necesito ayuda. Mi ubicación: ${mapsLink}`;
    try {
      await Share.share({ message });
    } catch (e) {
      Alert.alert('No se pudo compartir la ubicación');
    }
  };

  const renderUrgencyOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.urgencyCard,
        selectedUrgency === option.id && styles.urgencyCardSelected,
        { borderColor: option.color },
      ]}
      onPress={() => setSelectedUrgency(option.id)}
    >
      <View style={styles.urgencyGradient}>
        <MaterialCommunityIcons name={option.icon} size={32} color={option.color} />
        <Text style={[styles.urgencyTitle, { color: option.color }]}>
          {option.title}
        </Text>
        <Text style={styles.urgencySubtitle}>{option.subtitle}</Text>
        <Text style={styles.urgencyMultiplier}>
          +{Math.round((option.multiplier - 1) * 100)}% precio
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderServiceCard = (service) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceCard}
      onPress={() => handleEmergencyRequest(service)}
    >
      <View style={styles.serviceHeader}>
        <View style={styles.serviceIcon}>
          <MaterialCommunityIcons name={service.icon} size={28} color={colors.primary} />
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
          <Text style={styles.serviceTime}>⏱️ {service.estimatedTime}</Text>
        </View>
        <View style={styles.servicePricing}>
          <Text style={styles.originalPrice}>{formatCOP(service.basePrice)}</Text>
          <Text style={styles.emergencyPrice}>{formatCOP(calculatePrice(service.basePrice))}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textLight} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>🆘 Emergencias</Text>
            <Text style={styles.headerSubtitle}>Llama al 123 o comparte tu ubicación</Text>
          </View>
        </View>
        {/* Tarjeta SOS */}
        <Animated.View style={[styles.emergencyAlert, { transform: [{ scale: pulseAnimation }] }]}>
          <View style={styles.emergencyGradient}>
            <MaterialCommunityIcons name="alarm-light" size={32} color={colors.white} />
            <Text style={styles.emergencyText}>SOS - EMERGENCIA</Text>
            <Text style={styles.emergencySubtext}>Usa las acciones rápidas a continuación</Text>
          </View>
        </Animated.View>

        {/* Acciones rápidas de emergencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#DC2626' }]}
              onPress={() => callNumber(EMERGENCY_NUMBERS.unified)}
            >
              <MaterialCommunityIcons name="phone" size={28} color={colors.white} />
              <Text style={styles.actionTitle}>Llamar 123</Text>
              <Text style={styles.actionSubtitle}>Línea unificada de emergencias</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.secondary }]} 
              onPress={shareMyLocation}
            >
              <MaterialCommunityIcons name="map-marker" size={28} color={colors.white} />
              <Text style={styles.actionTitle}>Compartir ubicación</Text>
              <Text style={styles.actionSubtitle}>Enviar enlace de Google Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.primary }]} 
              onPress={async () => {
                const c = coords || (await requestLocation());
                if (!c) return;
                const mapsLink = `https://maps.google.com/?q=${c.lat},${c.lng}`;
                Linking.openURL(mapsLink);
              }}
            >
              <MaterialCommunityIcons name="map" size={28} color={colors.white} />
              <Text style={styles.actionTitle}>Abrir mapa</Text>
              <Text style={styles.actionSubtitle}>Ver mi ubicación actual</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contactos por categoría (por defecto marcan 123) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contactos</Text>
          <View style={styles.contactsList}>
            <TouchableOpacity style={styles.contactItem} onPress={() => callNumber(EMERGENCY_NUMBERS.police)}>
              <MaterialCommunityIcons name="police-badge" size={22} color={colors.textDark} />
              <Text style={styles.contactText}>Policía</Text>
              <Text style={styles.contactNumber}>{EMERGENCY_NUMBERS.police}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={() => callNumber(EMERGENCY_NUMBERS.ambulance)}>
              <MaterialCommunityIcons name="ambulance" size={22} color={colors.textDark} />
              <Text style={styles.contactText}>Ambulancia</Text>
              <Text style={styles.contactNumber}>{EMERGENCY_NUMBERS.ambulance}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={() => callNumber(EMERGENCY_NUMBERS.fire)}>
              <MaterialCommunityIcons name="fire-truck" size={22} color={colors.textDark} />
              <Text style={styles.contactText}>Bomberos</Text>
              <Text style={styles.contactNumber}>{EMERGENCY_NUMBERS.fire}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>Puedes personalizar estos números en Ajustes.</Text>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  emergencyAlert: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emergencyGradient: {
    backgroundColor: colors.error,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emergencyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  emergencySubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    textAlign: 'center',
  },
  contactsList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  contactText: {
    flex: 1,
    marginLeft: 10,
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '600',
  },
  contactNumber: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  hint: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default EmergencyServiceScreen;