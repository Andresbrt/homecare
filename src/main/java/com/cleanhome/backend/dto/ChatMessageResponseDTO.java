package com.cleanhome.backend.dto;

import com.cleanhome.backend.entity.MessageType;

import java.time.LocalDateTime;

public class ChatMessageResponseDTO {
    
    private Long id;
    private Long bookingId;
    private UserSummaryDTO sender;
    private UserSummaryDTO receiver;
    private String message;
    private Boolean isRead;
    private MessageType messageType;
    private String attachmentUrl;
    private LocalDateTime createdAt;
    
    public ChatMessageResponseDTO() {
    }

    public ChatMessageResponseDTO(Long id, Long bookingId, UserSummaryDTO sender, UserSummaryDTO receiver, String message,
                                  Boolean isRead, MessageType messageType, String attachmentUrl, LocalDateTime createdAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.isRead = isRead;
        this.messageType = messageType;
        this.attachmentUrl = attachmentUrl;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public UserSummaryDTO getSender() {
        return sender;
    }

    public void setSender(UserSummaryDTO sender) {
        this.sender = sender;
    }

    public UserSummaryDTO getReceiver() {
        return receiver;
    }

    public void setReceiver(UserSummaryDTO receiver) {
        this.receiver = receiver;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class UserSummaryDTO {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String profilePictureUrl;
        private String role;

        public UserSummaryDTO() {
        }

        public UserSummaryDTO(Long id, String firstName, String lastName, String email,
                              String profilePictureUrl, String role) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.profilePictureUrl = profilePictureUrl;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getProfilePictureUrl() {
            return profilePictureUrl;
        }

        public void setProfilePictureUrl(String profilePictureUrl) {
            this.profilePictureUrl = profilePictureUrl;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
