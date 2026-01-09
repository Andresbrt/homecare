package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.ChatMessage;
import com.cleanhome.backend.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository para operaciones CRUD de ChatMessage
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    /**
     * Obtener mensajes de una conversación (paginados)
     */
    Page<ChatMessage> findByChatRoomOrderByCreatedAtAsc(
        ChatRoom chatRoom, Pageable pageable);
    
    /**
     * Obtener últimos N mensajes de una conversación
     */
    @Query(value = "SELECT m FROM ChatMessage m WHERE m.chatRoom = :chatRoom " +
                   "ORDER BY m.createdAt DESC LIMIT :limit",
           nativeQuery = false)
    List<ChatMessage> findLastMessages(@Param("chatRoom") ChatRoom chatRoom,
                                       @Param("limit") int limit);
    
    /**
     * Contar mensajes no leídos de una conversación
     */
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
           "m.chatRoom = :chatRoom AND m.isRead = false")
    Long countUnreadMessages(@Param("chatRoom") ChatRoom chatRoom);
}
