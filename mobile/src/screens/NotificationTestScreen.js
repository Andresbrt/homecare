import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import notificationService from '../services/notificationService';

const NotificationTestScreen = ({ navigation }) => {
  const [badgeCount, setBadgeCount] = useState(0);

  const handleTestNewRequest = () => {
    notificationService.simulateNewRequest();
    Alert.alert('Notificación enviada', 'Deberías ver una notificación de nueva solicitud');
  };

  const handleTestServiceAccepted = () => {
    const mockBooking = {
      id: '123',
      providerName: 'Juan Pérez',
      time: '3:00 PM',
    };
    notificationService.notifyServiceAccepted(mockBooking);
    Alert.alert('Notificación enviada', 'Servicio aceptado');
  };

  const handleTestUpcomingService = () => {
    const mockBooking = {
      id: '123',
      customerName: 'María González',
    };
    // Notificación en 10 segundos para testing
    notificationService.notifyUpcomingService(mockBooking, 0.16);
    Alert.alert('Notificación programada', 'Recibirás una notificación en 10 segundos');
  };

  const handleTestNewMessage = () => {
    notificationService.notifyNewMessage('Hola, ¿a qué hora llegas?', 'Cliente Ana');
    Alert.alert('Notificación enviada', 'Nuevo mensaje');
  };

  const handleTestServiceCompleted = () => {
    const mockBooking = { id: '123' };
    notificationService.notifyServiceCompleted(mockBooking);
    Alert.alert('Notificación enviada', 'Servicio completado');
  };

  const handleTestPaymentReceived = () => {
    notificationService.notifyPaymentReceived(155880);
    Alert.alert('Notificación enviada', 'Pago recibido');
  };

  const handleTestCounterOffer = () => {
    const mockRequest = {
      id: '456',
      customerName: 'Carlos López',
      amount: 120000,
    };
    notificationService.notifyCounterOffer(mockRequest);
    Alert.alert('Notificación enviada', 'Contraoferta recibida');
  };

  const handleIncrementBadge = async () => {
    const newCount = badgeCount + 1;
    await notificationService.setBadgeCount(newCount);
    setBadgeCount(newCount);
  };

  const handleClearBadge = async () => {
    await notificationService.clearBadge();
    setBadgeCount(0);
  };

  const handleGetScheduledNotifications = async () => {
    const scheduled = await notificationService.getAllScheduledNotifications();
    Alert.alert(
      'Notificaciones programadas',
      `Total: ${scheduled.length}\n\n${JSON.stringify(scheduled, null, 2)}`
    );
  };

  const testButtons = [
    {
      id: 'new-request',
      title: 'Nueva Solicitud de Servicio',
      icon: 'bell-ring',
      color: '#EF4444',
      onPress: handleTestNewRequest,
    },
    {
      id: 'service-accepted',
      title: 'Servicio Aceptado',
      icon: 'check-circle',
      color: '#10B981',
      onPress: handleTestServiceAccepted,
    },
    {
      id: 'upcoming',
      title: 'Servicio Próximo (10s)',
      icon: 'clock-alert',
      color: '#F59E0B',
      onPress: handleTestUpcomingService,
    },
    {
      id: 'message',
      title: 'Nuevo Mensaje',
      icon: 'message-text',
      color: '#3B82F6',
      onPress: handleTestNewMessage,
    },
    {
      id: 'completed',
      title: 'Servicio Completado',
      icon: 'check-all',
      color: '#8B5CF6',
      onPress: handleTestServiceCompleted,
    },
    {
      id: 'payment',
      title: 'Pago Recibido',
      icon: 'cash-fast',
      color: '#10B981',
      onPress: handleTestPaymentReceived,
    },
    {
      id: 'counter-offer',
      title: 'Contraoferta Recibida',
      icon: 'cash-refund',
      color: '#F59E0B',
      onPress: handleTestCounterOffer,
    },
  ];

  const badgeButtons = [
    {
      id: 'increment',
      title: 'Incrementar Badge',
      icon: 'plus-circle',
      color: '#3B82F6',
      onPress: handleIncrementBadge,
    },
    {
      id: 'clear',
      title: 'Limpiar Badge',
      icon: 'minus-circle',
      color: '#EF4444',
      onPress: handleClearBadge,
    },
    {
      id: 'scheduled',
      title: 'Ver Programadas',
      icon: 'calendar-clock',
      color: '#8B5CF6',
      onPress: handleGetScheduledNotifications,
    },
  ];

  return (
    <GradientBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test de Notificaciones</Text>
        <View style={styles.badgeContainer}>
          <MaterialCommunityIcons name="bell" size={24} color={colors.primary} />
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Prueba las diferentes notificaciones que recibirán los usuarios. Las notificaciones
            aparecerán incluso si la app está en segundo plano.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Notificaciones de Servicio</Text>
        {testButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={styles.testButton}
            onPress={button.onPress}
          >
            <View style={[styles.iconContainer, { backgroundColor: button.color + '20' }]}>
              <MaterialCommunityIcons name={button.icon} size={24} color={button.color} />
            </View>
            <View style={styles.buttonInfo}>
              <Text style={styles.buttonTitle}>{button.title}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Badge & Programadas</Text>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeInfoLabel}>Badge actual:</Text>
          <Text style={styles.badgeInfoValue}>{badgeCount}</Text>
        </View>
        {badgeButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={styles.testButton}
            onPress={button.onPress}
          >
            <View style={[styles.iconContainer, { backgroundColor: button.color + '20' }]}>
              <MaterialCommunityIcons name={button.icon} size={24} color={button.color} />
            </View>
            <View style={styles.buttonInfo}>
              <Text style={styles.buttonTitle}>{button.title}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  buttonInfo: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  badgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  badgeInfoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  badgeInfoValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  bottomPadding: {
    height: 40,
  },
});

export default NotificationTestScreen;
