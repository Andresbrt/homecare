import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const SearchingProviderScreen = ({ route, navigation }) => {
  const { address, amount, serviceType } = route.params;
  const [searching, setSearching] = useState(true);
  const [providerFound, setProviderFound] = useState(false);
  const pulseAnim = new Animated.Value(0);

  useEffect(() => {
    // Animación de pulso
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simular búsqueda de proveedor (reemplazar con lógica real)
    const timer = setTimeout(() => {
      setSearching(false);
      setProviderFound(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleProviderAccepted = () => {
    // Navegar a pantalla de tracking cuando un proveedor acepta
    navigation.replace('TrackingScreen', {
      provider: {
        name: 'María González',
        rating: 4.8,
        photo: null,
        eta: 30, // minutos
      },
      booking: {
        address,
        amount,
        serviceType,
      },
    });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="close" size={24} color={colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buscando profesional</Text>
          <View style={styles.backButton} />
        </View>

        {/* Searching Animation */}
        {searching && (
          <View style={styles.searchingContainer}>
            <Animated.View
              style={[
                styles.pulseCircle,
                {
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3],
                      }),
                    },
                  ],
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 0],
                  }),
                },
              ]}
            />
            <View style={styles.searchIconContainer}>
              <MaterialCommunityIcons name="account-search" size={64} color={colors.primary} />
            </View>
            <Text style={styles.searchingTitle}>Buscando profesionales cerca de ti...</Text>
            <Text style={styles.searchingSubtitle}>
              Tu solicitud está siendo enviada a profesionales disponibles
            </Text>
            <ActivityIndicator
              size="large"
              color={colors.textLight}
              style={styles.loader}
            />
          </View>
        )}

        {/* Provider Found */}
        {!searching && providerFound && (
          <View style={styles.foundContainer}>
            <View style={styles.successIconContainer}>
              <MaterialCommunityIcons name="check-circle" size={80} color={colors.success} />
            </View>
            <Text style={styles.foundTitle}>¡Profesional encontrado!</Text>
            <Text style={styles.foundSubtitle}>Un profesional aceptó tu solicitud</Text>

            <TouchableOpacity style={styles.continueButton} onPress={handleProviderAccepted}>
              <LinearGradient
                colors={[colors.success, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueGradient}
              >
                <Text style={styles.continueButtonText}>Ver en el Mapa</Text>
                <MaterialCommunityIcons name="map-marker" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Service Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={24} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Dirección</Text>
              <Text style={styles.detailValue}>{address}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="cash" size={24} color={colors.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Monto ofrecido</Text>
              <Text style={styles.detailValue}>
                {formatCOP(amount)}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name={serviceType === 'premium' ? 'star-circle' : 'home-heart'}
              size={24}
              color={serviceType === 'premium' ? colors.secondary : colors.primary}
            />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tipo de servicio</Text>
              <Text style={styles.detailValue}>
                {serviceType === 'premium' ? 'Premium' : 'Confort'}
              </Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar búsqueda</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
  },
  searchingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  searchIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  searchingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  searchingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  loader: {
    marginTop: 24,
  },
  foundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  foundTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  foundSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default SearchingProviderScreen;
