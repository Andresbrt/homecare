import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

const ChatScreen = ({ route, navigation }) => {
  const { booking } = route.params || {};
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const flatListRef = useRef(null);

  const chatId = booking?.id || 'demo-chat';
  const otherUser = user?.role === 'CUSTOMER' 
    ? { name: booking?.providerName || 'Carlos Rodríguez', role: 'PROVIDER' }
    : { name: booking?.client || 'María González', role: 'CUSTOMER' };

  useEffect(() => {
    loadMessages();
    setupAutoMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`chat_${chatId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Mensajes iniciales de demostración
        const initialMessages = [
          {
            id: '1',
            text: user?.role === 'CUSTOMER' 
              ? '¡Hola! Estoy en camino a tu domicilio. Llegaré en aproximadamente 15 minutos.' 
              : 'Hola, ¿ya está en camino el proveedor?',
            sender: user?.role === 'CUSTOMER' ? 'PROVIDER' : 'CUSTOMER',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            type: 'text',
          },
          {
            id: '2',
            text: user?.role === 'CUSTOMER' 
              ? 'Perfecto, aquí estaré esperando. ¿Necesita alguna indicación especial?' 
              : 'Excelente, tengo todo listo para comenzar el servicio.',
            sender: user?.role === 'CUSTOMER' ? 'CUSTOMER' : 'PROVIDER',
            timestamp: new Date(Date.now() - 240000).toISOString(),
            type: 'text',
          },
        ];
        setMessages(initialMessages);
        await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(initialMessages));
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  const setupAutoMessages = () => {
    // Simular que el otro usuario está escribiendo ocasionalmente
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% de probabilidad
        simulateOtherUserTyping();
      }
    }, 15000);

    return () => clearInterval(typingInterval);
  };

  const simulateOtherUserTyping = () => {
    setOtherUserTyping(true);
    setTimeout(() => {
      setOtherUserTyping(false);
      // 30% de probabilidad de enviar un mensaje automático
      if (Math.random() > 0.7) {
        sendAutoMessage();
      }
    }, 2000 + Math.random() * 3000);
  };

  const sendAutoMessage = () => {
    const autoMessages = user?.role === 'CUSTOMER' 
      ? [
          'Ya estoy llegando, veo el edificio.',
          'Estoy en el lobby, ¿cual es el apartamento?',
          'Muchas gracias por el servicio, todo quedó perfecto.',
          'He terminado con la sala, ahora voy con la cocina.',
        ]
      : [
          '¿A qué hora es conveniente para usted?',
          'Perfecto, nos vemos entonces.',
          '¿Hay alguna área que requiera atención especial?',
          'Entendido, tendré eso en cuenta.',
        ];

    const randomMessage = autoMessages[Math.floor(Math.random() * autoMessages.length)];
    const newMessage = {
      id: Date.now().toString(),
      text: randomMessage,
      sender: user?.role === 'CUSTOMER' ? 'PROVIDER' : 'CUSTOMER',
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    addMessage(newMessage);
  };

  const addMessage = async (newMessage) => {
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    try {
      await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error guardando mensaje:', error);
    }

    // Scroll automático al último mensaje
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: user?.role || 'CUSTOMER',
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    addMessage(newMessage);
    setInputText('');
    setIsTyping(false);

    // Simular respuesta automática ocasionalmente
    if (Math.random() > 0.6) {
      setTimeout(() => {
        simulateOtherUserTyping();
      }, 1000 + Math.random() * 3000);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería para enviar fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMessage = {
        id: Date.now().toString(),
        imageUri: result.assets[0].uri,
        sender: user?.role || 'CUSTOMER',
        timestamp: new Date().toISOString(),
        type: 'image',
      };

      addMessage(newMessage);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu cámara para tomar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMessage = {
        id: Date.now().toString(),
        imageUri: result.assets[0].uri,
        sender: user?.role || 'CUSTOMER',
        timestamp: new Date().toISOString(),
        type: 'image',
      };

      addMessage(newMessage);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Enviar imagen',
      'Selecciona una opción',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar foto', onPress: takePhoto },
        { text: 'Galería', onPress: pickImage },
      ]
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === user?.role;
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        {item.type === 'image' ? (
          <View style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
            styles.imageBubble
          ]}>
            <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
            <Text style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.otherMessageTime
            ]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        ) : (
          <View style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
          ]}>
            <Text style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText
            ]}>
              {item.text}
            </Text>
            <Text style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.otherMessageTime
            ]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!otherUserTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.otherMessageContainer]}>
        <View style={[styles.messageBubble, styles.otherMessageBubble, styles.typingBubble]}>
          <Text style={styles.typingText}>{otherUser.name} está escribiendo...</Text>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textLight} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{otherUser.name}</Text>
            <Text style={styles.headerStatus}>
              {otherUserTyping ? 'Escribiendo...' : 'En línea'}
            </Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <MaterialCommunityIcons name="phone" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Lista de mensajes */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input de mensaje */}
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={showImageOptions}
          >
            <MaterialCommunityIcons name="camera" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              setIsTyping(text.length > 0);
            }}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              inputText.trim().length > 0 && styles.sendButtonActive
            ]}
            onPress={sendMessage}
            disabled={inputText.trim().length === 0}
          >
            <MaterialCommunityIcons 
              name="send" 
              size={20} 
              color={inputText.trim().length > 0 ? 'white' : colors.textMuted} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: '700',
  },
  headerStatus: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  callButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 8,
  },
  otherMessageBubble: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderBottomLeftRadius: 8,
  },
  imageBubble: {
    padding: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: colors.textDark,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  otherMessageTime: {
    color: colors.textMuted,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingText: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
    marginHorizontal: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  attachButton: {
    marginRight: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.textDark,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
});

export default ChatScreen;