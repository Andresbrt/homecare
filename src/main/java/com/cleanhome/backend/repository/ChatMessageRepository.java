package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.ChatMessage;
import com.cleanhome.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByBookingOrderByCreatedAtAsc(Booking booking);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.booking = :booking AND (cm.sender = :user OR cm.receiver = :user) ORDER BY cm.createdAt ASC")
    List<ChatMessage> findByBookingAndUser(@Param("booking") Booking booking, @Param("user") User user);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.receiver = :user AND cm.isRead = false")
    Long countUnreadByReceiver(@Param("user") User user);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.receiver = :user AND cm.isRead = false ORDER BY cm.createdAt DESC")
    List<ChatMessage> findUnreadByReceiver(@Param("user") User user);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.booking = :booking AND cm.receiver = :user AND cm.isRead = false")
    List<ChatMessage> findUnreadByBookingAndReceiver(@Param("booking") Booking booking, @Param("user") User user);
}
