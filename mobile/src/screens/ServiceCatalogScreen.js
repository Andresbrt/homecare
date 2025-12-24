import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Diseño minimalista: sin gradientes pesados
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import appTheme from '../theme/theme';

// IDs de servicios que deben ocultarse en todo el catálogo
const HIDDEN_SERVICE_IDS = new Set(['allergy-free', 'office', 'move']);

const DEFAULT_SERVICES = [
  {
    id: 'deep-clean',
    title: 'Limpieza profunda',
    description: 'Ideal para una renovación completa del hogar con atención a baños, cocina y rincones difíciles.',
    duration: '4-5 horas',
    priceRange: 'Desde $80,000 COP',
    emoji: '🧽',
    category: 'deep',
    popular: true,
    includes: ['Desinfección de superficies', 'Limpieza de electrodomésticos', 'Detalles minuciosos'],
    tags: ['Profunda', 'Desinfección', 'Premium'],
    availability: { immediate: true, weekend: true },
  },
  {
    id: 'general-clean',
    title: 'Limpieza general',
    description: 'Mantenimiento regular perfecto para hogares que necesitan una limpieza completa y rápida.',
    duration: '2-3 horas',
    priceRange: 'Desde $60,000 COP',
    emoji: '🏠',
    category: 'general',
    popular: true,
    includes: ['Aspirado', 'Trapeado', 'Desempolvado', 'Baños básicos'],
    tags: ['General', 'Rápida', 'Económica'],
    availability: { immediate: true, weekend: true },
  },
  {
    id: 'express',
    title: 'Limpieza express',
    description: 'Solución rápida de 60 minutos para emergencias o visitas inesperadas.',
    duration: '1 hora',
    priceRange: 'Desde $45,000 COP',
    emoji: '⚡',
    category: 'express',
    popular: true,
    includes: ['Áreas principales', 'Baño principal', 'Cocina básica'],
    tags: ['Express', 'Urgente', '1 Hora'],
    availability: { immediate: true, weekend: false },
  },
    id: 'express',
    title: 'Express 60min',
    description: 'Refresca tu hogar cuando necesitas resultados rápidos y efectivos en zonas clave.',
    duration: '1 hora',
    priceRange: 'Desde $80,000 COP',
    emoji: '⚡',
    includes: ['Sala y comedor', 'Limpieza rápida de baño', 'Organización ligera'],
  },
];

const ServiceCatalogScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Normalizar params con defaults seguros
  const {
    services: incomingServices,
    selectedServiceId: selectedId = null,
    filterType = null,
    showFeatured = false,
    fromRecommendation = false,
  } = route.params || {};

  // Usar lista entrante o default y ocultar servicios no permitidos
  const services = (incomingServices ?? DEFAULT_SERVICES).filter(
    (s) => !HIDDEN_SERVICE_IDS.has(s.id)
  );

  const sortedServices = useMemo(() => {
    if (!selectedId) {
      return services;
    }
    return services.slice().sort((a, b) => {
      if (a.id === selectedId) {
        return -1;
      }
      if (b.id === selectedId) {
        return 1;
      }
      return 0;
    });
  }, [services, selectedId]);

  const handleSelectService = (service) => {
    // Preferir navegación directa al stack interno para asegurar recepción de params
    if (navigation.canGoBack()) {
      navigation.navigate('ServiceDetail', { service });
    } else {
      navigation.navigate('Home', { screen: 'ServiceDetail', params: { service } });
    }
  };

  const renderService = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleSelectService(item)}
      style={styles.serviceItem}
    >
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceEmoji}>{item.emoji}</Text>
          <View style={styles.serviceTitleWrapper}>
            <Text style={styles.serviceTitle}>{item.title}</Text>
            <Text style={styles.servicePrice}>{item.priceRange}</Text>
          </View>
        </View>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        <View style={styles.serviceMetaRow}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={appTheme.COLORS.darkGray} />
          <Text style={styles.serviceMetaText}>{item.duration}</Text>
        </View>
        <View style={styles.serviceTagsRow}>
          {item.includes.map((tag) => (
            <View key={tag} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={sortedServices}
      keyExtractor={(item) => item.id}
      renderItem={renderService}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Selecciona tu servicio</Text>
          <Text style={styles.subtitle}>
            Conoce qué incluye cada plan y elige la opción que mejor se adapte a tu hogar.
          </Text>
          {filterType && (
            <Text style={styles.filterBadge}>Filtro: {filterType}</Text>
          )}
          {showFeatured && (
            <Text style={styles.featureBadge}>Destacados</Text>
          )}
          {fromRecommendation && (
            <Text style={styles.recoBadge}>Recomendado para ti</Text>
          )}
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: appTheme.COLORS.text,
  },
  subtitle: {
    marginTop: 10,
    color: appTheme.COLORS.darkGray,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: appTheme.FONTS.regular,
  },
  serviceItem: {
    borderRadius: 20,
    backgroundColor: appTheme.COLORS.white,
    marginBottom: 16,
    ...appTheme.SHADOWS.medium,
  },
  serviceContent: {
    padding: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  serviceTitleWrapper: {
    flex: 1,
  },
  serviceTitle: {
    color: appTheme.COLORS.text,
    fontSize: 18,
    fontFamily: appTheme.FONTS.bold,
  },
  servicePrice: {
    marginTop: 6,
    color: appTheme.COLORS.primary,
    fontSize: 14,
    fontFamily: appTheme.FONTS.semibold,
  },
  serviceDescription: {
    marginTop: 16,
    color: appTheme.COLORS.darkGray,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: appTheme.FONTS.regular,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  serviceMetaText: {
    marginLeft: 8,
    color: appTheme.COLORS.darkGray,
    fontSize: 13,
    fontFamily: appTheme.FONTS.regular,
  },
  serviceTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  serviceTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: appTheme.COLORS.lightGray,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceTagText: {
    color: appTheme.COLORS.darkGray,
    fontSize: 12,
    fontFamily: appTheme.FONTS.semibold,
  },
  separator: {
    height: 18,
  },
});

export default ServiceCatalogScreen;
