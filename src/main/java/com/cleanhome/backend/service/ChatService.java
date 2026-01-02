package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.ChatMessageResponseDTO;
import com.cleanhome.backend.dto.SendMessageRequestDTO;
import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.ChatMessage;
import com.cleanhome.backend.entity.MessageType;
import com.cleanhome.backend.entity.NotificationType;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.exception.ResourceNotFoundException;
import com.cleanhome.backend.repository.BookingRepository;
import com.cleanhome.backend.repository.ChatMessageRepository;
import com.cleanhome.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ChatService(ChatMessageRepository chatMessageRepository,
                       BookingRepository bookingRepository,
                       UserRepository userRepository,
                       NotificationService notificationService) {
        this.chatMessageRepository = chatMessageRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ChatMessageResponseDTO sendMessage(SendMessageRequestDTO request, Long senderId) {
        // Validar que la reserva existe
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        // Obtener sender
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Determinar receiver (si sender es cliente -> receiver es proveedor, y viceversa)
        User receiver;
        if (sender.getId().equals(booking.getCustomer().getId())) {
            receiver = booking.getServiceProvider().getUser();
        } else if (sender.getId().equals(booking.getServiceProvider().getUser().getId())) {
            receiver = booking.getCustomer();
        } else {
            throw new IllegalStateException("No tienes permiso para enviar mensajes en esta reserva");
        }

        // Crear mensaje
        ChatMessage message = new ChatMessage();
        message.setBooking(booking);
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setMessage(request.getMessage());
        message.setMessageType(MessageType.valueOf(request.getMessageType()));
        message.setAttachmentUrl(request.getAttachmentUrl());
        message.setIsRead(false);

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Enviar notificación al receptor
        sendMessageNotification(receiver, sender, request.getMessage());

        return mapToResponseDTO(savedMessage);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponseDTO> getConversation(Long bookingId, Long userId) {
        // Validar que el usuario tenga acceso a esta conversación
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        if (!hasAccessToBooking(booking, userId)) {
            throw new IllegalStateException("No tienes acceso a esta conversación");
        }

        List<ChatMessage> messages = chatMessageRepository.findByBookingOrderByCreatedAtAsc(booking);
        return messages.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markMessagesAsRead(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        User receiver = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<ChatMessage> unreadMessages = chatMessageRepository
                .findUnreadByBookingAndReceiver(booking, receiver);

        unreadMessages.forEach(message -> message.setIsRead(true));
        chatMessageRepository.saveAll(unreadMessages);
    }

    @Transactional(readOnly = true)
    public Long countUnreadMessages(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return chatMessageRepository.countUnreadByReceiver(user);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponseDTO> getUnreadMessages(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        User receiver = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<ChatMessage> unreadMessages = chatMessageRepository
                .findUnreadByBookingAndReceiver(booking, receiver);

        return unreadMessages.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private void sendMessageNotification(User receiver, User sender, String messagePreview) {
        try {
            String title = "Nuevo mensaje de " + sender.getFirstName();
            String body = messagePreview.length() > 50 
                ? messagePreview.substring(0, 50) + "..." 
                : messagePreview;

            notificationService.createNotification(
                    receiver.getId(),
                    title,
                    body,
                    NotificationType.NEW_MESSAGE,
                    null
            );
        } catch (Exception e) {
            // Log error pero no fallar el envío del mensaje
            e.printStackTrace();
        }
    }

    private boolean hasAccessToBooking(Booking booking, Long userId) {
        return booking.getCustomer().getId().equals(userId) ||
               booking.getServiceProvider().getUser().getId().equals(userId);
    }

    private ChatMessageResponseDTO mapToResponseDTO(ChatMessage message) {
        ChatMessageResponseDTO dto = new ChatMessageResponseDTO();
        dto.setId(message.getId());
        dto.setBookingId(message.getBooking().getId());
        dto.setSender(mapUserToSummary(message.getSender()));
        dto.setReceiver(mapUserToSummary(message.getReceiver()));
        dto.setMessage(message.getMessage());
        dto.setIsRead(message.getIsRead());
        dto.setMessageType(message.getMessageType());
        dto.setAttachmentUrl(message.getAttachmentUrl());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }

    private ChatMessageResponseDTO.UserSummaryDTO mapUserToSummary(User user) {
        ChatMessageResponseDTO.UserSummaryDTO summary = new ChatMessageResponseDTO.UserSummaryDTO();
        summary.setId(user.getId());
        summary.setFirstName(user.getFirstName());
        summary.setLastName(user.getLastName());
        summary.setEmail(user.getEmail());
        summary.setProfilePictureUrl(user.getProfileImageUrl());
        summary.setRole(user.getRole().name());
        return summary;
    }
}
