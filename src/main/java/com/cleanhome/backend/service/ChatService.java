package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.ChatMessageDto;
import com.cleanhome.backend.dto.ChatRoomDto;
import com.cleanhome.backend.entity.ChatMessage;
import com.cleanhome.backend.entity.ChatRoom;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.repository.ChatMessageRepository;
import com.cleanhome.backend.repository.ChatRoomRepository;
import com.cleanhome.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service para la lógica de negocio del chat
 */
@Service
@Transactional
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public ChatService(ChatRoomRepository chatRoomRepository, ChatMessageRepository chatMessageRepository,
                       UserRepository userRepository, ModelMapper modelMapper) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }
    
    /**
     * Obtener o crear una sala de chat entre dos usuarios
     */
    public ChatRoom getOrCreateChatRoom(Long customerId, Long providerId) {
        if (customerId.equals(providerId)) {
            throw new IllegalArgumentException("Un usuario no puede chatear consigo mismo");
        }
        
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + customerId));
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + providerId));
        
        return chatRoomRepository.findByUsers(customer, provider)
            .orElseGet(() -> {
                ChatRoom newRoom = new ChatRoom(customer, provider);
                ChatRoom saved = chatRoomRepository.save(newRoom);
                return saved;
            });
    }
    
    /**
     * Enviar un nuevo mensaje
     */
    public ChatMessageDto sendMessage(Long chatRoomId, Long senderId, String messageText) {
        if (messageText == null || messageText.trim().isEmpty()) {
            throw new IllegalArgumentException("El mensaje no puede estar vacío");
        }
        
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));
        
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar que el sender está en la room
        if (!isUserInChatRoom(sender, chatRoom)) {
            throw new RuntimeException("Usuario no autorizado para este chat");
        }
        
        // Crear mensaje
        ChatMessage message = new ChatMessage(chatRoom, sender, messageText);
        message = chatMessageRepository.save(message);
        
        // Actualizar último mensaje de la room
        chatRoom.setLastMessage(messageText);
        chatRoom.setLastMessageTime(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);
        
        // Mensaje enviado
        
        return convertMessageToDto(message);
    }
    
    /**
     * Obtener historial de mensajes de una conversación
     */
    public List<ChatMessageDto> getMessages(Long chatRoomId, int page, int size) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));
        
        Pageable pageable = PageRequest.of(page, size);
        return chatMessageRepository.findByChatRoomOrderByCreatedAtAsc(chatRoom, pageable)
            .stream()
            .map(this::convertMessageToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener conversaciones del usuario
     */
    @Transactional(readOnly = true)
    public List<ChatRoomDto> getUserConversations(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<ChatRoom> rooms = chatRoomRepository.findByUserOrderByLastMessageTimeDesc(user);
        
        return rooms.stream()
            .map(room -> convertRoomToDto(room, user))
            .collect(Collectors.toList());
    }
    
    /**
     * Marcar mensajes como leídos
     */
    public void markMessagesAsRead(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Actualizar todos los mensajes sin leer que no son del usuario actual
        List<ChatMessage> unreadMessages = chatRoom.getMessages().stream()
            .filter(msg -> !msg.getIsRead() && !msg.getSender().equals(user))
            .collect(Collectors.toList());
        
        unreadMessages.forEach(msg -> {
            msg.setIsRead(true);
            msg.setReadAt(LocalDateTime.now());
        });
        
        if (!unreadMessages.isEmpty()) {
            chatMessageRepository.saveAll(unreadMessages);
            // Marcados mensajes como leídos
        }
    }
    
    /**
     * Obtener número de mensajes no leídos de una sala
     */
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));
        
        return chatMessageRepository.countUnreadMessages(chatRoom);
    }
    
    /**
     * Verificar si un usuario está en una sala de chat
     */
    private boolean isUserInChatRoom(User user, ChatRoom chatRoom) {
        return user.equals(chatRoom.getCustomer()) || user.equals(chatRoom.getProvider());
    }
    
    /**
     * Convertir ChatMessage a DTO
     */
    private ChatMessageDto convertMessageToDto(ChatMessage message) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(message.getId());
        dto.setChatRoomId(message.getChatRoom().getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        dto.setSenderAvatar(message.getSender().getProfileImageUrl());
        dto.setMessageText(message.getMessageText());
        dto.setSentAt(message.getCreatedAt());
        dto.setTimestamp(message.getCreatedAt());
        dto.setIsRead(message.getIsRead());
        return dto;
    }
    
    /**
     * Convertir ChatRoom a DTO
     */
    private ChatRoomDto convertRoomToDto(ChatRoom room, User currentUser) {
        ChatRoomDto dto = new ChatRoomDto();
        dto.setId(room.getId());
        
        User otherUser = room.getCustomer().equals(currentUser) 
            ? room.getProvider() 
            : room.getCustomer();
        
        dto.setCustomerId(room.getCustomer().getId());
        dto.setCustomerName(room.getCustomer().getFirstName() + " " + room.getCustomer().getLastName());
        dto.setCustomerAvatar(room.getCustomer().getProfileImageUrl());
        dto.setProviderId(room.getProvider().getId());
        dto.setProviderName(room.getProvider().getFirstName() + " " + room.getProvider().getLastName());
        dto.setProviderAvatar(room.getProvider().getProfileImageUrl());
        dto.setLastMessage(room.getLastMessage());
        dto.setLastMessageTime(room.getLastMessageTime());
        
        return dto;
    }
}
