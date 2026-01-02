package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.NotificationRequestDTO;
import com.cleanhome.backend.dto.NotificationResponseDTO;
import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.Notification;
import com.cleanhome.backend.entity.NotificationType;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.repository.BookingRepository;
import com.cleanhome.backend.repository.NotificationRepository;
import com.cleanhome.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ExpoPushNotificationService expoPushService;
    
    public NotificationService(NotificationRepository notificationRepository,
                              UserRepository userRepository,
                              BookingRepository bookingRepository,
                              ExpoPushNotificationService expoPushService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.expoPushService = expoPushService;
    }
    
    /**
     * Crea y envía una notificación a un usuario
     */
    public NotificationResponseDTO createNotification(NotificationRequestDTO request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return createNotificationForUser(request, user);
    }

    public NotificationResponseDTO createNotification(Long userId, String title, String message, NotificationType type, Long relatedBookingId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        NotificationRequestDTO request = new NotificationRequestDTO();
        request.setTitle(title);
        request.setMessage(message);
        request.setType(type);
        request.setRelatedBookingId(relatedBookingId);
        return createNotificationForUser(request, user);
    }
    
    /**
     * Crea una notificación para un usuario específico
     */
    public NotificationResponseDTO createNotificationForUser(NotificationRequestDTO request, User user) {
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType() != null ? request.getType() : NotificationType.INFO);
        notification.setData(request.getData());
        notification.setUser(user);
        
        // Asociar booking si existe
        if (request.getRelatedBookingId() != null) {
            Booking booking = bookingRepository.findById(request.getRelatedBookingId())
                    .orElse(null);
            notification.setRelatedBooking(booking);
        }
        
        // Guardar en BD
        Notification saved = notificationRepository.save(notification);
        
        // Intentar enviar push notification si el usuario tiene token
        if (user.getExpoPushToken() != null && !user.getExpoPushToken().isEmpty()) {
            boolean pushSent = expoPushService.sendPushNotification(
                user.getExpoPushToken(),
                request.getTitle(),
                request.getMessage(),
                request.getData()
            );
            saved.setPushSent(pushSent);
            saved = notificationRepository.save(saved);
        }
        
        return new NotificationResponseDTO(saved);
    }
    
    /**
     * Obtiene todas las notificaciones del usuario autenticado
     */
    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getUserNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        
        return notifications.stream()
                .map(NotificationResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene solo las notificaciones no leídas
     */
    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getUnreadNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<Notification> notifications = notificationRepository.findUnreadByUser(user);
        
        return notifications.stream()
                .map(NotificationResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Cuenta notificaciones no leídas
     */
    @Transactional(readOnly = true)
    public Long countUnreadNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return notificationRepository.countUnreadByUser(user);
    }
    
    /**
     * Marca una notificación como leída
     */
    public void markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar que la notificación pertenece al usuario
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No tienes permiso para modificar esta notificación");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    /**
     * Marca todas las notificaciones como leídas
     */
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<Notification> unreadNotifications = notificationRepository.findUnreadByUser(user);
        
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        
        notificationRepository.saveAll(unreadNotifications);
    }
    
    /**
     * Elimina una notificación
     */
    public void deleteNotification(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar permisos
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No tienes permiso para eliminar esta notificación");
        }
        
        notificationRepository.delete(notification);
    }
    
    /**
     * Notificación automática cuando se crea una reserva
     */
    public void notifyBookingCreated(Booking booking) {
        NotificationRequestDTO request = new NotificationRequestDTO(
            "Nueva reserva creada",
            "Tu reserva para " + booking.getService().getName() + " ha sido creada exitosamente.",
            NotificationType.BOOKING_CREATED
        );
        request.setRelatedBookingId(booking.getId());
        request.setData("{\"screen\":\"TrackingScreen\",\"bookingId\":" + booking.getId() + "}");
        
        createNotificationForUser(request, booking.getCustomer());
    }
    
    /**
     * Notificación cuando cambia el estado de una reserva
     */
    public void notifyBookingStatusChanged(Booking booking, String status) {
        NotificationRequestDTO request = new NotificationRequestDTO(
            "Estado de reserva actualizado",
            "Tu reserva ahora está " + status,
            getNotificationTypeForBookingStatus(status)
        );
        request.setRelatedBookingId(booking.getId());
        request.setData("{\"screen\":\"TrackingScreen\",\"bookingId\":" + booking.getId() + "}");
        
        createNotificationForUser(request, booking.getCustomer());
    }
    
    /**
     * Notificación cuando se completa un pago
     */
    public void notifyPaymentCompleted(Booking booking, String amount) {
        NotificationRequestDTO request = new NotificationRequestDTO(
            "Pago completado",
            "Tu pago de " + amount + " ha sido procesado exitosamente.",
            NotificationType.PAYMENT_COMPLETED
        );
        request.setRelatedBookingId(booking.getId());
        
        createNotificationForUser(request, booking.getCustomer());
    }
    
    private NotificationType getNotificationTypeForBookingStatus(String status) {
        return switch (status.toUpperCase()) {
            case "CONFIRMED" -> NotificationType.BOOKING_CONFIRMED;
            case "IN_PROGRESS" -> NotificationType.BOOKING_IN_PROGRESS;
            case "COMPLETED" -> NotificationType.BOOKING_COMPLETED;
            case "CANCELLED" -> NotificationType.BOOKING_CANCELLED;
            default -> NotificationType.INFO;
        };
    }
}
