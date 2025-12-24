import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

const FavoritesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [favoriteProviders, setFavoriteProviders] = useState([]);
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [animatedValue] = useState(new Animated.Value(0));

  const providers = [
    {
      id: '1',
      name: 'María González',
      rating: 4.9,
      completedJobs: 245,
      specialty: 'Limpieza Profunda',
      responseTime: '15 min',
      priceRange: 'Desde $80,000 COP',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&w=120&q=80',
      badges: ['⚡ Rápida', '🏆 Premium', '🌟 Top Rated'],
      description: 'Especialista en limpieza profunda con 8 años de experiencia.',
      availability: 'Disponible hoy',
      isFavorite: true,
      distance: '1.2 km',
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      rating: 4.8,
      completedJobs: 189,
      specialty: 'Limpieza Express',
      responseTime: '12 min',
      priceRange: 'Desde $80,000 COP',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      badges: ['⚡ Express', '💚 Eco-friendly'],
      description: 'Experto en servicios rápidos y productos ecológicos.',
      availability: 'Disponible mañana',
      isFavorite: true,
      distance: '2.1 km',
    },
    {
      id: '3',
      name: 'Ana Patricia Silva',
      rating: 4.9,
      completedJobs: 312,
      specialty: 'Hogar & Oficina',
      responseTime: '18 min',
      priceRange: 'Desde $80,000 COP',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
      badges: ['👑 VIP', '🏢 Oficinas', '🏠 Hogar'],
      description: 'Versatil en espacios residenciales y comerciales.',
      availability: 'Disponible ahora',
      isFavorite: false,
      distance: '0.8 km',
    },
  ];

  const services = [
    {
      id: 'deep-clean',
      name: 'Limpieza Profunda',
      description: 'Renovación completa de cada rincón del hogar',
      icon: '🧽',
      price: 'Desde $80,000 COP',
      duration: '4-5h',
      popularity: '95%',
      isFavorite: true,
      gradient: ['#2563EB', '#1D4ED8'], // Azul moderno
    },
    {
      id: 'express',
      name: 'Express 60min',
      description: 'Limpieza rápida para espacios clave',
      icon: '⚡',
      price: 'Desde $80,000 COP',
      duration: '1h',
      popularity: '87%',
      isFavorite: true,
      gradient: ['#F59E0B', '#D97706'], // Ámbar vibrante
    },
    {
      id: 'eco-friendly',
      name: 'Eco-Friendly',
      description: 'Productos naturales para familias',
      icon: '🌿',
      price: 'Desde $80,000 COP',
      duration: '3-4h',
      popularity: '78%',
      isFavorite: false,
      gradient: ['#10B981', '#059669'], // Verde esmeralda
    },
  ];

  const searches = [
    'Limpieza urgente',
    'Proveedor cerca de mí',
    'Limpieza de oficina',
    'Servicio nocturno',
    'Limpieza post-evento',
  ];

  useEffect(() => {
    loadFavorites();
    loadRecentSearches();

    // Animación de entrada
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedProviders = await AsyncStorage.getItem('favoriteProviders');
      const savedServices = await AsyncStorage.getItem('favoriteServices');
      
      if (savedProviders) {
        const providerIds = JSON.parse(savedProviders);
        setFavoriteProviders(providers.filter(p => providerIds.includes(p.id)));
      } else {
        // Inicializar con algunos favoritos por defecto
        setFavoriteProviders(providers.filter(p => p.isFavorite));
      }
      
      if (savedServices) {
        const serviceIds = JSON.parse(savedServices);
        setFavoriteServices(services.filter(s => serviceIds.includes(s.id)));
      } else {
        // Inicializar con algunos servicios favoritos
        setFavoriteServices(services.filter(s => s.isFavorite));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      } else {
        setRecentSearches(searches.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading searches:', error);
    }
  };

  const toggleProviderFavorite = async (providerId) => {
    try {
      const provider = providers.find(p => p.id === providerId);
      const isCurrentlyFavorite = favoriteProviders.some(p => p.id === providerId);
      
      let updatedFavorites;
      if (isCurrentlyFavorite) {
        updatedFavorites = favoriteProviders.filter(p => p.id !== providerId);
      } else {
        updatedFavorites = [...favoriteProviders, provider];
      }
      
      setFavoriteProviders(updatedFavorites);
      await AsyncStorage.setItem(
        'favoriteProviders',
        JSON.stringify(updatedFavorites.map(p => p.id))
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const toggleServiceFavorite = async (serviceId) => {
    try {
      const service = services.find(s => s.id === serviceId);
      const isCurrentlyFavorite = favoriteServices.some(s => s.id === serviceId);
      
      let updatedFavorites;
      if (isCurrentlyFavorite) {
        updatedFavorites = favoriteServices.filter(s => s.id !== serviceId);
      } else {
        updatedFavorites = [...favoriteServices, service];
      }
      
      setFavoriteServices(updatedFavorites);
      await AsyncStorage.setItem(
        'favoriteServices',
        JSON.stringify(updatedFavorites.map(s => s.id))
      );
    } catch (error) {
      console.error('Error toggling service favorite:', error);
    }
  };

  const clearRecentSearches = () => {
    Alert.alert(
      'Limpiar historial',
      '¿Estás seguro de que quieres eliminar todas las búsquedas recientes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            setRecentSearches([]);
            await AsyncStorage.removeItem('recentSearches');
          },
        },
      ]
    );
  };

  const bookProvider = (provider) => {
    navigation.navigate('HousekeeperDetail', { housekeeper: provider });
  };

  const bookService = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  const renderProviderCard = (provider, index) => (
    <Animated.View
      key={provider.id}
      style={[
        styles.providerCard,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleProviderFavorite(provider.id)}
      >
        <MaterialCommunityIcons
          name="heart"
          size={20}
          color={colors.error}
        />
      </TouchableOpacity>

      <View style={styles.providerHeader}>
        <Image source={{ uri: provider.avatar }} style={styles.avatar} />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{provider.rating}</Text>
            <Text style={styles.jobCount}>({provider.completedJobs} trabajos)</Text>
          </View>
        </View>
        <View style={styles.availabilityBadge}>
          <Text style={styles.availabilityText}>{provider.availability}</Text>
        </View>
      </View>

      <View style={styles.providerDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textMuted} />
          <Text style={styles.detailText}>Responde en {provider.responseTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="map-marker" size={16} color={colors.textMuted} />
          <Text style={styles.detailText}>{provider.distance}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="currency-usd" size={16} color={colors.textMuted} />
          <Text style={styles.detailText}>{provider.priceRange}</Text>
        </View>
      </View>

      <View style={styles.badgesContainer}>
        {provider.badges.map((badge, badgeIndex) => (
          <View key={badgeIndex} style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => bookProvider(provider)}
      >
        <Text style={styles.bookButtonText}>Reservar ahora</Text>
        <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderServiceCard = (service, index) => (
    <Animated.View
      key={service.id}
      style={[
        styles.serviceCard,
        {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.serviceGradient}>
        <TouchableOpacity
          style={styles.serviceFavoriteButton}
          onPress={() => toggleServiceFavorite(service.id)}
        >
          <MaterialCommunityIcons
            name="heart"
            size={18}
            color={colors.error}
          />
        </TouchableOpacity>

        <Text style={styles.serviceIcon}>{service.icon}</Text>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>

        <View style={styles.serviceDetails}>
          <View style={styles.serviceDetailItem}>
            <Text style={styles.servicePrice}>{service.price}</Text>
            <Text style={styles.serviceDuration}>{service.duration}</Text>
          </View>
          <View style={styles.popularityContainer}>
            <MaterialCommunityIcons name="trending-up" size={14} color={colors.textSecondary} />
            <Text style={styles.popularityText}>{service.popularity} popular</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => bookService(service)}
        >
          <Text style={styles.serviceButtonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
            <Text style={styles.headerTitle}>Mis Favoritos</Text>
            <Text style={styles.headerSubtitle}>Acceso rápido a tus preferencias</Text>
          </View>
        </View>

        {/* Proveedores Favoritos */}
        {favoriteProviders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Proveedores Favoritos</Text>
              <Text style={styles.sectionCount}>{favoriteProviders.length}</Text>
            </View>
            {favoriteProviders.map((provider, index) => renderProviderCard(provider, index))}
          </View>
        )}

        {/* Servicios Favoritos */}
        {favoriteServices.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💎 Servicios Favoritos</Text>
              <Text style={styles.sectionCount}>{favoriteServices.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.servicesContainer}>
                {favoriteServices.map((service, index) => renderServiceCard(service, index))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Búsquedas Recientes */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔍 Búsquedas Recientes</Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={styles.clearButton}>Limpiar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchesList}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity key={index} style={styles.searchItem}>
                  <MaterialCommunityIcons name="history" size={16} color={colors.textMuted} />
                  <Text style={styles.searchText}>{search}</Text>
                  <MaterialCommunityIcons name="arrow-top-right" size={14} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Estado vacío */}
        {favoriteProviders.length === 0 && favoriteServices.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="heart-outline" size={80} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
            <Text style={styles.emptySubtitle}>
              Marca proveedores y servicios como favoritos para acceso rápido
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('ServiceCatalog')}
            >
              <Text style={styles.exploreButtonText}>Explorar servicios</Text>
            </TouchableOpacity>
          </View>
        )}
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCount: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    color: colors.textMuted,
    fontSize: 14,
  },
  providerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  providerSpecialty: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: colors.textDark,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  jobCount: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: 4,
  },
  availabilityBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  providerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  badge: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  bookButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  servicesContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceCard: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceGradient: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 20,
    height: 220,
    justifyContent: 'space-between',
  },
  serviceFavoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  serviceIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  serviceName: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  serviceDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  serviceDetails: {
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servicePrice: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  serviceDuration: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  popularityText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  serviceButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  serviceButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  searchesList: {
    gap: 12,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchText: {
    color: colors.textDark,
    fontSize: 14,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FavoritesScreen;