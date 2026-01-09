package com.cleanhome.backend.entity;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

/**
 * Tests simples para entidades de Chat
 */
class ChatRoomTest {

    @Test
    void testChatRoomConstructor() {
        User customer = new User();
        customer.setId(1L);
        customer.setEmail("customer@test.com");

        User provider = new User();
        provider.setId(2L);
        provider.setEmail("provider@test.com");

        ChatRoom room = new ChatRoom(customer, provider);

        assertThat(room.getCustomer()).isEqualTo(customer);
        assertThat(room.getProvider()).isEqualTo(provider);
    }

    @Test
    void testChatRoomSetters() {
        ChatRoom room = new ChatRoom();
        room.setId(1L);
        room.setLastMessage("Test");

        assertThat(room.getId()).isEqualTo(1L);
        assertThat(room.getLastMessage()).isEqualTo("Test");
    }
}

class ChatMessageTest {

    @Test
    void testChatMessageConstructor() {
        User sender = new User();
        sender.setId(1L);

        ChatRoom room = new ChatRoom();
        room.setId(1L);

        ChatMessage msg = new ChatMessage(room, sender, "Hello");

        assertThat(msg.getChatRoom()).isEqualTo(room);
        assertThat(msg.getSender()).isEqualTo(sender);
        assertThat(msg.getMessageText()).isEqualTo("Hello");
    }

    @Test
    void testChatMessageSetters() {
        ChatMessage msg = new ChatMessage();
        msg.setId(1L);
        msg.setIsRead(true);

        assertThat(msg.getId()).isEqualTo(1L);
        assertThat(msg.getIsRead()).isTrue();
    }
}
