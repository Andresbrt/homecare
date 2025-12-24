import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import appTheme from '../theme/theme';

const FALLBACK_SERVICE = {
  id: 'custom',
  title: 'Servicio personalizado',
  description: 'Cuéntanos qué necesitas y diseñamos un plan de limpieza a medida.',
  duration: 'Flexible',
  priceRange: 'A cotizar',
  emoji: '🧹',
  includes: ['Plan a medida', 'Productos adaptados', 'Asignación de especialista'],
};

const ServiceDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const service = route.params?.service ?? FALLBACK_SERVICE;

  const handleSchedule = () => {
    // Navegación directa dentro del stack para preservar params
    navigation.navigate('ScheduleService', { service });
  };

  return (
    <GradientBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={appTheme.COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service.title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>{service.emoji ?? '🧹'}</Text>
          <Text style={styles.heroPrice}>{service.priceRange}</Text>
          <Text style={styles.heroDescription}>{service.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Qué incluye?</Text>
          {service.includes?.map((item) => (
            <View key={item} style={styles.listItem}>
              <MaterialCommunityIcons name="check-circle-outline" color={appTheme.COLORS.primary} size={20} />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Duración Estimada</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={appTheme.COLORS.darkGray} />
            <Text style={styles.infoText}>{service.duration}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8} onPress={handleSchedule}>
          <Text style={styles.ctaText}>Agendar este servicio</Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color={appTheme.COLORS.white} />
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: appTheme.COLORS.background,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: appTheme.SIZES.h3,
    fontFamily: appTheme.FONTS.bold,
    color: appTheme.COLORS.text,
    marginRight: 30, // Espacio para compensar el botón de back
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: appTheme.COLORS.white,
    borderRadius: 20,
    marginHorizontal: -24, // Extender a los bordes
    paddingHorizontal: 24,
  },
  heroEmoji: {
    fontSize: 60,
  },
  heroPrice: {
    fontFamily: appTheme.FONTS.bold,
    fontSize: appTheme.SIZES.h2,
    color: appTheme.COLORS.primary,
    marginTop: 16,
  },
  heroDescription: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.darkGray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  card: {
    marginTop: 24,
    backgroundColor: appTheme.COLORS.white,
    borderRadius: 20,
    padding: 20,
    ...appTheme.SHADOWS.light,
  },
  cardTitle: {
    fontFamily: appTheme.FONTS.bold,
    fontSize: appTheme.SIZES.h3,
    color: appTheme.COLORS.text,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listItemText: {
    marginLeft: 12,
    color: appTheme.COLORS.text,
    fontSize: appTheme.SIZES.font,
    fontFamily: appTheme.FONTS.regular,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: appTheme.COLORS.white,
    borderTopWidth: 1,
    borderTopColor: appTheme.COLORS.gray,
  },
  ctaButton: {
    backgroundColor: appTheme.COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: appTheme.COLORS.white,
    fontSize: appTheme.SIZES.medium,
    fontFamily: appTheme.FONTS.bold,
    marginRight: 8,
  },
});

export default ServiceDetailScreen;
