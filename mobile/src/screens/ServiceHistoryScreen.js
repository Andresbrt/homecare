import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { commonStyles } from '../theme/commonStyles';
import { colors } from '../theme/colors';

const MOCK_HISTORY = [
  {
    id: 'hist-001',
    service: 'Limpieza profunda',
    date: '12/10/2025',
    time: '08:00',
    status: 'Completado',
    total: '$72,000 COP',
    specialist: 'Daniela R.',
  },
  {
    id: 'hist-002',
    service: 'Express 60min',
    date: '02/10/2025',
    time: '17:30',
    status: 'Completado',
    total: '$24,000 COP',
    specialist: 'Marta G.',
  },
];

const statusStyles = {
  Completado: {
    icon: 'check-decagram',
    color: colors.success,
  },
  Pendiente: {
    icon: 'clock-alert',
    color: colors.accent,
  },
  Cancelado: {
    icon: 'close-octagon',
    color: colors.danger,
  },
};

const ServiceHistoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const newBooking = route.params?.newBooking ?? null;

  const history = useMemo(() => {
    if (!newBooking) {
      return MOCK_HISTORY;
    }
    const formatted = {
      id: `hist-${Date.now()}`,
      service: newBooking.service?.title ?? 'Servicio',
      date: newBooking.date ?? 'Por confirmar',
      time: newBooking.time ?? '--',
      status: newBooking.status ?? 'Pendiente',
      total: newBooking.totalLabel ?? newBooking.total ?? '$0.00',
      specialist: newBooking.specialist ?? 'Asignar',
    };
    return [formatted, ...MOCK_HISTORY];
  }, [newBooking]);

  const handleBookAgain = (item) => {
    navigation.navigate('ScheduleService', {
      service: {
        title: item.service,
        duration: newBooking?.service?.duration ?? '3 horas',
        priceRange: item.total,
      },
    });
  };

  const renderItem = ({ item }) => {
    const meta = statusStyles[item.status] ?? statusStyles.Pendiente;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleWrapper}>
            <MaterialCommunityIcons name="broom" size={22} color={colors.accent} />
            <Text style={styles.cardTitle}>{item.service}</Text>
          </View>
          <TouchableOpacity onPress={() => handleBookAgain(item)} activeOpacity={0.8}>
            <Text style={styles.cardAction}>Agendar de nuevo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="calendar" size={18} color={colors.textMuted} />
          <Text style={styles.cardRowText}>
            {item.date} · {item.time}
          </Text>
        </View>
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="account" size={18} color={colors.textMuted} />
          <Text style={styles.cardRowText}>{item.specialist}</Text>
        </View>
        <View style={styles.cardFooter}>
          <View
            style={[styles.statusPill, { backgroundColor: `${meta.color}1a` }]}
          >
            <MaterialCommunityIcons name={meta.icon} size={16} color={meta.color} />
            <Text style={[styles.statusText, { color: meta.color }]}>{item.status}</Text>
          </View>
          <Text style={styles.totalText}>{item.total}</Text>
        </View>
        {item.status === 'En progreso' && (
          <TouchableOpacity
            style={styles.trackingButton}
            onPress={() => navigation.navigate('TrackingScreen', { booking: item, trackingActive: true })}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="map-marker-path" size={18} color={colors.primary} />
            <Text style={styles.trackingButtonText}>Ver ubicación en tiempo real</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <GradientBackground>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Historial de servicios</Text>
            <Text style={styles.subtitle}>
              Consulta tus reservas pasadas y agenda rápidamente una nueva visita.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 140,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: colors.textLight,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(13,12,38,0.9)',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    marginLeft: 12,
    color: colors.textLight,
    fontSize: 17,
    fontWeight: '600',
  },
  cardAction: {
    color: colors.primaryAlt,
    fontSize: 13,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  cardRowText: {
    marginLeft: 12,
    color: colors.textMuted,
    fontSize: 13,
  },
  cardFooter: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  totalText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  trackingButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  trackingButtonText: {
    marginLeft: 6,
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 18,
  },
});

export default ServiceHistoryScreen;
