package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.ChatRoom;
import com.cleanhome.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository para operaciones CRUD de ChatRoom
 */
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    /**
     * Buscar chat room entre dos usuarios (sin importar el orden)
     */
    @Query("SELECT cr FROM ChatRoom cr WHERE " +
           "(cr.customer = :user1 AND cr.provider = :user2) OR " +
           "(cr.customer = :user2 AND cr.provider = :user1)")
    Optional<ChatRoom> findByUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    /**
     * Obtener todas las conversaciones activas de un usuario, ordenadas por último mensaje
     */
    @Query("SELECT cr FROM ChatRoom cr WHERE " +
           "(cr.customer = :user OR cr.provider = :user) AND cr.isActive = true " +
           "ORDER BY cr.lastMessageTime DESC NULLS LAST")
    List<ChatRoom> findByUserOrderByLastMessageTimeDesc(@Param("user") User user);
    
    /**
     * Obtener conversaciones activas con paginación
     */
    @Query("SELECT cr FROM ChatRoom cr WHERE " +
           "(cr.customer = :user OR cr.provider = :user) AND cr.isActive = true")
    List<ChatRoom> findActiveConversations(@Param("user") User user);
}
