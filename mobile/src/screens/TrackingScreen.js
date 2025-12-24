import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Animated } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appTheme from '../theme/theme';

const TrackingScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { provider, booking } = route.params || {};
  const mapRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const [providerLocation, setProviderLocation] = useState({
    latitude: 4.7110,
    longitude: -74.0721,
  });

  const [clientLocation] = useState({
    latitude: 4.6485,
    longitude: -74.0785,
  });

  const [eta, setEta] = useState(provider?.eta || 30);
  const [distance, setDistance] = useState('3.2 km');
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false, 
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    if (mapRef.current) {
      mapRef.current.fitToCoordinates([providerLocation, clientLocation], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }

    const etaInterval = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : 0));
    }, 5000);

    // Solicitar permisos y suscribirse a actualizaciones de ubicación
    let subscription;
    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso de ubicación', 'Ubicación denegada, usando datos simulados.');
          return;
        }
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 4000,
            distanceInterval: 5,
          },
          (loc) => {
            setProviderLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        );
      } catch (e) {
        console.warn('Error iniciando tracking ubicación', e);
      }
    };
    startTracking();

    return () => {
      clearInterval(etaInterval);
      if (subscription) subscription.remove();
    };
  }, []);

  const centerMapOnRoute = () => {
    if (mapRef.current && providerLocation && clientLocation) {
      mapRef.current.fitToCoordinates([providerLocation, clientLocation], {
        edgePadding: { top: 100, right: 100, bottom: 400, left: 100 },
        animated: true,
      });
    }
  };

  const handleCallProvider = () => {
    Alert.alert('Llamar al proveedor', '¿Deseas llamar al proveedor de servicio?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Llamar', onPress: () => console.log('Llamando...') },
    ]);
  };

  const handleSendMessage = () => {
    navigation.navigate('ChatScreen', { booking });
  };

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webMapContainer}>
          <Text style={styles.webMapSubtitle}>La vista de mapa no está disponible en la web.</Text>
        </View>
      );
    }

    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...providerLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {providerLocation && (
          <Marker coordinate={providerLocation} title="Proveedor">
            <View style={styles.providerMarker}>
              <MaterialCommunityIcons name="account-hard-hat" size={24} color="white" />
            </View>
          </Marker>
        )}
        {clientLocation && (
          <Marker coordinate={clientLocation} title="Tu Ubicación">
            <View style={styles.clientMarker}>
              <MaterialCommunityIcons name="home" size={24} color="white" />
            </View>
          </Marker>
        )}
        {providerLocation && clientLocation && (
          <Polyline
            coordinates={[providerLocation, clientLocation]}
            strokeColor={appTheme.COLORS.primary}
            strokeWidth={4}
          />
        )}
      </MapView>
    );
  };

  return (
    <View style={styles.container}>
      {renderMap()}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={appTheme.COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Siguiendo al proveedor</Text>
          <Text style={styles.headerSubtitle}>
            {provider?.name || 'Carlos Rodríguez'} está en camino
          </Text>
        </View>
        <TouchableOpacity style={styles.centerButton} onPress={centerMapOnRoute}>
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color={appTheme.COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomPanel, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <View style={styles.timeInfo}>
          <View style={styles.timeCard}>
            <MaterialCommunityIcons name="clock-fast" size={24} color={appTheme.COLORS.primary} />
            <Text style={styles.timeLabel}>Tiempo estimado</Text>
            <Text style={styles.timeValue}>{eta} min</Text>
          </View>
          <View style={styles.timeCard}>
            <MaterialCommunityIcons name="map-marker-distance" size={24} color={appTheme.COLORS.primary} />
            <Text style={styles.timeLabel}>Distancia</Text>
            <Text style={styles.timeValue}>{distance}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSendMessage}>
            <MaterialCommunityIcons name="message-text" size={20} color={appTheme.COLORS.primary} />
            <Text style={styles.actionButtonText}>Mensaje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]} onPress={handleCallProvider}>
            <MaterialCommunityIcons name="phone" size={20} color={appTheme.COLORS.white} />
            <Text style={[styles.actionButtonText, { color: appTheme.COLORS.white }]}>Llamar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, isTracking && styles.statusIndicatorActive]} />
          <Text style={styles.statusText}>
            {isTracking ? 'Seguimiento activo' : 'Conectando...'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.COLORS.background,
  },
  map: {
    flex: 1,
  },
  webMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapSubtitle: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.medium,
    color: appTheme.COLORS.darkGray,
  },
  header: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appTheme.COLORS.white,
    borderRadius: 20,
    padding: 16,
    ...appTheme.SHADOWS.medium,
  },
  backButton: {
    marginRight: 12,
    padding: 4, // Aumenta el área de toque
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: appTheme.COLORS.text,
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.medium,
  },
  headerSubtitle: {
    color: appTheme.COLORS.darkGray,
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    marginTop: 2,
  },
  centerButton: {
    marginLeft: 12,
  },
  providerMarker: {
    backgroundColor: appTheme.COLORS.primary,
    borderRadius: 20,
    padding: 8,
  },
  clientMarker: {
    backgroundColor: appTheme.COLORS.accent,
    borderRadius: 20,
    padding: 8,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: appTheme.COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    ...appTheme.SHADOWS.large,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timeCard: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    color: appTheme.COLORS.darkGray,
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.small,
    marginTop: 8,
  },
  timeValue: {
    color: appTheme.COLORS.text,
    fontFamily: appTheme.FONTS.bold,
    fontSize: appTheme.SIZES.large,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.COLORS.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  primaryActionButton: {
    backgroundColor: appTheme.COLORS.primary,
  },
  actionButtonText: {
    color: appTheme.COLORS.primary,
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appTheme.COLORS.gray,
    marginRight: 8,
  },
  statusIndicatorActive: {
    backgroundColor: appTheme.COLORS.green,
  },
  statusText: {
    color: appTheme.COLORS.darkGray,
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.small,
  },
});

export default TrackingScreen;