import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const BookingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const booking = route.params?.booking ?? null;
  const mode = route.params?.mode ?? 'view';

  const handleAction = (action) => {
    Alert.alert(
      'Acción registrada',
      `Acción "${action}" aplicada${booking ? ` en la cita de ${booking.client}.` : '.'}`,
    );
    navigation.goBack();
  };

  if (!booking) {
    return (
      <GradientBackground>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="calendar-remove" size={56} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No hay detalle disponible</Text>
          <Text style={styles.emptySubtitle}>
            Selecciona una cita desde tu agenda para ver los detalles completos.
          </Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cliente</Text>
          <View style={styles.row}>
            <MaterialCommunityIcons name="account" size={20} color={colors.textMuted} />
            <Text style={styles.rowText}>{booking.client}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Servicio</Text>
          <View style={styles.row}>
            <MaterialCommunityIcons name="spray" size={20} color={colors.textMuted} />
            <Text style={styles.rowText}>{booking.type}</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={colors.textMuted} />
            <Text style={styles.rowText}>{booking.start} • {booking.duration}</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="map-marker" size={20} color={colors.textMuted} />
            <Text style={styles.rowText}>{booking.address}</Text>
          </View>
          <View style={styles.badgesRow}>
            {booking.extras?.map((extra) => (
              <View key={extra} style={styles.badge}>
                <Text style={styles.badgeText}>{extra}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acciones rápidas</Text>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() => handleAction('Notificar llegada')}
          >
            <MaterialCommunityIcons name="bell-ring" size={20} color={colors.textLight} />
            <Text style={styles.actionText}>Notificar llegada al cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() => handleAction('Marcar en progreso')}
          >
            <MaterialCommunityIcons name="progress-clock" size={20} color={colors.textLight} />
            <Text style={styles.actionText}>Marcar servicio en progreso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            activeOpacity={0.85}
            onPress={() => handleAction('Solicitar reprogramación')}
          >
            <MaterialCommunityIcons name="calendar-edit" size={20} color={colors.primary} />
            <Text style={styles.actionTextSecondary}>Solicitar reprogramación</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() => {
              if (!booking?.id) {
                Alert.alert('Booking inválido', 'No se puede abrir tracking sin ID.');
                return;
              }
              navigation.navigate('TrackingScreen', { booking });
            }}
          >
            <MaterialCommunityIcons name="map-marker-path" size={20} color={colors.textLight} />
            <Text style={styles.actionText}>Seguir en vivo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            activeOpacity={0.85}
            onPress={() => {
              if (!booking?.id) {
                Alert.alert('Booking inválido', 'No se puede abrir chat sin ID.');
                return;
              }
              navigation.navigate('ChatScreen', { booking });
            }}
          >
            <MaterialCommunityIcons name="message-text" size={20} color={colors.primary} />
            <Text style={styles.actionTextSecondary}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            activeOpacity={0.85}
            onPress={() => {
              if (!booking?.id) {
                Alert.alert('Booking inválido', 'No se puede abrir evidencia sin ID.');
                return;
              }
              navigation.navigate('PhotoEvidence', { booking });
            }}
          >
            <MaterialCommunityIcons name="camera-account" size={20} color={colors.primary} />
            <Text style={styles.actionTextSecondary}>Evidencia</Text>
          </TouchableOpacity>
        </View>

        {mode === 'start' && (
          <TouchableOpacity
            style={styles.primaryCta}
            activeOpacity={0.85}
            onPress={() => handleAction('Servicio completado')}
          >
            <MaterialCommunityIcons name="check-decagram" size={22} color={colors.textLight} />
            <Text style={styles.primaryCtaText}>Cerrar servicio</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 140,
  },
  card: {
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  rowText: {
    marginLeft: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 12,
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionTextSecondary: {
    marginLeft: 12,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryCta: {
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.success,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryCtaText: {
    marginLeft: 12,
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 18,
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default BookingDetailScreen;
