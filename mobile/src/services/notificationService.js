import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { formatCOP } from '../utils/currency';

// Configuración del comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Registrar para recibir notificaciones push
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });

      // Canal para solicitudes urgentes
      await Notifications.setNotificationChannelAsync('urgent-requests', {
        name: 'Solicitudes Urgentes',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#EF4444',
        sound: 'default',
      });

      // Canal para mensajes del chat
      await Notifications.setNotificationChannelAsync('chat-messages', {
        name: 'Mensajes de Chat',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
        sound: 'default',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);
      this.expoPushToken = token;
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Enviar notificación local (para testing o modo offline)
  async sendLocalNotification(title, body, data = {}, channelId = 'default') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        vibrate: [0, 250, 250, 250],
        priority: Notifications.AndroidNotificationPriority.MAX,
        categoryIdentifier: channelId,
      },
      trigger: null, // Enviar inmediatamente
    });
  }

  // Notificación para nueva solicitud de servicio
  async notifyNewServiceRequest(request) {
    const { customerName, serviceType, amount, address } = request;
    
    await this.sendLocalNotification(
      '🔔 Nueva solicitud de servicio',
      `${customerName} solicita ${serviceType} por ${formatCOP(Math.round(amount))}`,
      {
        type: 'new_request',
        requestId: request.id,
        screen: 'IncomingRequests',
      },
      'urgent-requests'
    );

    // Vibrar en patrón especial
    if (Platform.OS === 'android') {
      // Android vibration is handled by notification channel
    } else if (Platform.OS === 'ios') {
      // iOS vibration
      const { default: Haptics } = await import('expo-haptics');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  // Notificación para contraoferta del cliente
  async notifyCounterOffer(request) {
    await this.sendLocalNotification(
      '💰 Contraoferta recibida',
      `${request.customerName} ofrece ${formatCOP(Math.round(request.amount))}`,
      {
        type: 'counter_offer',
        requestId: request.id,
        screen: 'IncomingRequests',
      },
      'urgent-requests'
    );
  }

  // Notificación para aceptación de servicio
  async notifyServiceAccepted(booking) {
    await this.sendLocalNotification(
      '✅ Servicio aceptado',
      `${booking.providerName} aceptó tu solicitud. Inicia en ${booking.time}`,
      {
        type: 'service_accepted',
        bookingId: booking.id,
        screen: 'TrackingScreen',
      }
    );
  }

  // Notificación para recordatorio de servicio próximo
  async notifyUpcomingService(booking, minutesBefore = 30) {
    const trigger = new Date(Date.now() + (minutesBefore * 60 * 1000));
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Servicio próximo',
        body: `Tu servicio con ${booking.customerName || booking.providerName} comienza en ${minutesBefore} minutos`,
        data: {
          type: 'upcoming_service',
          bookingId: booking.id,
          screen: 'BookingDetail',
        },
        sound: true,
      },
      trigger,
    });
  }

  // Notificación para nuevo mensaje en chat
  async notifyNewMessage(message, senderName) {
    await this.sendLocalNotification(
      `💬 ${senderName}`,
      message,
      {
        type: 'new_message',
        screen: 'ChatScreen',
      },
      'chat-messages'
    );
  }

  // Notificación para servicio completado
  async notifyServiceCompleted(booking) {
    await this.sendLocalNotification(
      '✨ Servicio completado',
      'Por favor califica tu experiencia y deja una propina si quedaste satisfecho',
      {
        type: 'service_completed',
        bookingId: booking.id,
        screen: 'EnhancedRating',
      }
    );
  }

  // Notificación para pago recibido
  async notifyPaymentReceived(amount) {
    await this.sendLocalNotification(
      '💵 Pago recibido',
      `Has recibido ${formatCOP(Math.round(amount))}`,
      {
        type: 'payment_received',
        screen: 'ProviderFinancial',
      }
    );
  }

  // Configurar listeners para manejar notificaciones
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    // Listener para cuando llega una notificación mientras la app está abierta
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      }
    );

    // Listener para cuando el usuario toca una notificación
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        if (onNotificationResponse) {
          onNotificationResponse(response);
        }
      }
    );
  }

  // Limpiar listeners
  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Obtener badge count actual
  async getBadgeCount() {
    return await Notifications.getBadgeCountAsync();
  }

  // Actualizar badge count
  async setBadgeCount(count) {
    await Notifications.setBadgeCountAsync(count);
  }

  // Limpiar badge
  async clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }

  // Cancelar todas las notificaciones programadas
  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Obtener notificaciones programadas
  async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Simular llegada de nueva solicitud (para testing)
  simulateNewRequest() {
    const mockRequest = {
      id: Date.now().toString(),
      customerName: 'Ana García',
      serviceType: 'Limpieza profunda',
      amount: 150000,
      address: 'Calle 123 #45-67',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
    };

    this.notifyNewServiceRequest(mockRequest);
  }
}

// Instancia singleton
const notificationService = new NotificationService();

export default notificationService;
