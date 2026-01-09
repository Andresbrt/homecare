package com.cleanhome.backend.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

/**
 * Tests simples para DTOs de Chat
 */
class ChatRoomDtoTest {

    @Test
    void testChatRoomDto_Creation() {
        ChatRoomDto dto = new ChatRoomDto();
        dto.setId(1L);
        dto.setCustomerId(1L);
        dto.setProviderId(2L);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getCustomerId()).isEqualTo(1L);
        assertThat(dto.getProviderId()).isEqualTo(2L);
    }
}

class ChatMessageDtoTest {

    @Test
    void testChatMessageDto_Creation() {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(1L);
        dto.setRoomId(1L);
        dto.setSenderId(1L);
        dto.setContent("Test message");

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getRoomId()).isEqualTo(1L);
        assertThat(dto.getSenderId()).isEqualTo(1L);
        assertThat(dto.getContent()).isEqualTo("Test message");
    }

    @Test
    void testChatMessageDto_ReadStatus() {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setRead(true);

        assertThat(dto.isRead()).isTrue();
    }
}
