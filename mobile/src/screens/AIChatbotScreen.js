import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import Constants from 'expo-constants';
import { fetchAiConfig } from '../services/configService';

const AIChatbotScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const aiConfigStatic = Constants?.expoConfig?.extra?.ai || { enabled: true, model: 'gpt-5.1-codex-max' };
  const [aiConfigRuntime, setAiConfigRuntime] = useState(null);
  const effectiveAi = aiConfigRuntime || aiConfigStatic;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const scrollViewRef = useRef();
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const initialSuggestions = [
    '¿Cómo cancelar un servicio?',
    'Precios y tarifas',
    '¿Qué incluye la limpieza profunda?',
    'Métodos de pago',
    'Cambiar fecha de servicio',
    'Problemas con un proveedor',
  ];

  const quickReplies = [
    { id: 'booking', text: '📅 Hacer reserva', action: 'booking' },
    { id: 'emergency', text: '🆘 Emergencia', action: 'emergency' },
    { id: 'support', text: '🎧 Hablar con humano', action: 'human' },
    { id: 'pricing', text: '💰 Ver precios', action: 'pricing' },
  ];

  // Base de conocimiento del chatbot
  const knowledgeBase = {
    greeting: [
      '¡Hola! 👋 Soy CleanBot, tu asistente virtual 24/7. ¿En qué puedo ayudarte hoy?',
      '¡Bienvenido! Estoy aquí para resolver todas tus dudas sobre CleanHome. ¿Qué necesitas?',
    ],
    booking: [
      'Para hacer una reserva, ve a "Servicios" en el menú principal, elige el tipo de limpieza que necesitas y selecciona fecha y hora. ¿Te gustaría que te muestre los pasos?',
      '¡Perfecto! Puedes reservar en 3 pasos: 1) Elige el servicio 2) Selecciona fecha/hora 3) Confirma el pago. ¿Qué tipo de limpieza necesitas?',
    ],
    pricing: [
      'Nuestros precios varían según el servicio:\n• Express (1h): $18-28\n• Estándar (2-3h): $25-45\n• Profunda (4-5h): $45-80\n• Eco-friendly: $35-65\n\n¿Te interesa algún servicio específico?',
      'Los precios dependen del tipo de limpieza y tamaño del espacio. Te puedo ayudar a calcular un estimado. ¿Cuántas habitaciones tienes?',
    ],
    emergency: [
      '🆘 Para emergencias (derrames, accidentes), usa el botón rojo "Emergencia" en tu dashboard. Tendrás un proveedor en 30min-2h según urgencia.',
      'Las emergencias tienen prioridad máxima. Costo adicional de 2x-3x pero garantizamos atención inmediata. ¿Es una emergencia ahora?',
    ],
    cancel: [
      'Puedes cancelar hasta 2 horas antes sin costo. Ve a "Historial" → tu reserva → "Cancelar". Si es menos tiempo, puede aplicar una tarifa.',
      'Para cancelaciones: Historial > Selecciona reserva > Cancelar. Sin costo si es +2h antes, sino $5-10 de tarifa administrativa.',
    ],
    payment: [
      'Aceptamos tarjetas de crédito/débito, PayPal, Apple/Google Pay y efectivo. El pago se procesa después del servicio.',
      'Métodos de pago disponibles: Visa, MasterCard, PayPal, Apple Pay, Google Pay y efectivo. ¿Necesitas ayuda configurando uno?',
    ],
    providers: [
      'Todos nuestros proveedores están verificados con antecedentes penales, seguros y entrenamiento certificado. Rating mínimo 4.5/5.',
      'Seleccionamos proveedores con experiencia +2 años, seguros, background checks y entrenamiento en productos CleanHome.',
    ],
    quality: [
      'Si no estás satisfecho, ofrecemos:\n• Re-limpieza gratis en 24h\n• Reembolso parcial/total\n• Crédito para próximo servicio\n\nTu satisfacción es 100% garantizada.',
      'Garantía CleanHome: Si algo no está perfecto, lo arreglamos gratis o te devolvemos tu dinero. Sin preguntas, sin problemas.',
    ],
  };

  useEffect(() => {
    loadChatHistory();
    initializeChat();
    // Obtener configuración AI desde backend para permitir cambios sin rebuild
    (async () => {
      try {
        const cfg = await fetchAiConfig();
        if (cfg && typeof cfg.enabled === 'boolean') {
          setAiConfigRuntime(cfg);
        }
      } catch (e) {
        // Silenciar errores de red y seguir con configuración estática
      }
    })();
  }, []);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const loadChatHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('aiChatHistory');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem('aiChatHistory', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now().toString(),
      text: knowledgeBase.greeting[0],
      isBot: true,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    setSuggestions(initialSuggestions);
  };

  const processMessage = (text) => {
    const lowerText = text.toLowerCase();
    
    // Detectar intención del usuario
    if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('tarifa')) {
      return getRandomResponse('pricing');
    }
    if (lowerText.includes('reserv') || lowerText.includes('agendar') || lowerText.includes('cita')) {
      return getRandomResponse('booking');
    }
    if (lowerText.includes('emergencia') || lowerText.includes('urgente') || lowerText.includes('rápido')) {
      return getRandomResponse('emergency');
    }
    if (lowerText.includes('cancel') || lowerText.includes('anular')) {
      return getRandomResponse('cancel');
    }
    if (lowerText.includes('pago') || lowerText.includes('tarjeta') || lowerText.includes('paypal')) {
      return getRandomResponse('payment');
    }
    if (lowerText.includes('proveedor') || lowerText.includes('empleado') || lowerText.includes('personal')) {
      return getRandomResponse('providers');
    }
    if (lowerText.includes('calidad') || lowerText.includes('garantía') || lowerText.includes('satisfecho')) {
      return getRandomResponse('quality');
    }
    if (lowerText.includes('hola') || lowerText.includes('hello') || lowerText.includes('saludos')) {
      return getRandomResponse('greeting');
    }

    // Respuesta por defecto con sugerencias
    return "Entiendo tu consulta, pero necesito más detalles para ayudarte mejor. Aquí tienes algunas opciones populares que podrían interesarte:";
  };

  const getRandomResponse = (category) => {
    const responses = knowledgeBase[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    if (!effectiveAi.enabled) {
      Alert.alert(
        'AI deshabilitado',
        'El asistente AI está desactivado actualmente por el administrador.'
      );
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    // Simular tiempo de procesamiento del bot
    setTimeout(() => {
      const botResponse = processMessage(inputText);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      setIsTyping(false);
      saveChatHistory(finalMessages);

      // Auto-scroll al final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 segundos
  };

  const handleQuickReply = (action) => {
    switch (action) {
      case 'booking':
        navigation.navigate('ServiceCatalog');
        break;
      case 'emergency':
        navigation.navigate('EmergencyService');
        break;
      case 'human':
        navigation.navigate('Support');
        break;
      case 'pricing':
        setInputText('¿Cuáles son los precios de los servicios?');
        break;
    }
  };

  const handleSuggestion = (suggestion) => {
    setInputText(suggestion);
  };

  const clearChat = () => {
    Alert.alert(
      'Limpiar chat',
      '¿Estás seguro de que quieres eliminar todo el historial de conversación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            AsyncStorage.removeItem('aiChatHistory');
            initializeChat();
          },
        },
      ]
    );
  };

  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isBot ? styles.botMessage : styles.userMessage,
      ]}
    >
      {message.isBot && (
        <View style={styles.botAvatar}>
          <MaterialCommunityIcons name="robot" size={20} color={colors.primary} />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isBot ? styles.botText : styles.userText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            message.isBot ? styles.botTimestamp : styles.userTimestamp,
          ]}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <Animated.View
      style={[
        styles.messageContainer,
        styles.botMessage,
        { opacity: typingAnimation },
      ]}
    >
      <View style={styles.botAvatar}>
        <MaterialCommunityIcons name="robot" size={20} color={colors.primary} />
      </View>
      <View style={[styles.messageBubble, styles.botBubble]}>
        <View style={styles.typingDots}>
          <Animated.View
            style={[
              styles.typingDot,
              {
                transform: [
                  {
                    scale: typingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.2, 1],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                transform: [
                  {
                    scale: typingAnimation.interpolate({
                      inputRange: [0, 0.3, 0.8, 1],
                      outputRange: [1, 1, 1.2, 1],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                transform: [
                  {
                    scale: typingAnimation.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [1, 1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            <View style={styles.headerTitle}>
              <MaterialCommunityIcons name="robot" size={24} color={colors.primary} />
              <Text style={styles.headerText}>CleanBot AI</Text>
              <View style={styles.onlineIndicator} />
            </View>
            <Text style={styles.headerSubtitle}>Asistente inteligente • Siempre disponible</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={clearChat}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Quick Replies */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickRepliesContainer}
        >
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply.id}
              style={styles.quickReply}
              onPress={() => handleQuickReply(reply.action)}
            >
              <Text style={styles.quickReplyText}>{reply.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          {isTyping && renderTypingIndicator()}
          
          {/* Suggestions */}
          {suggestions.length > 0 && !isTyping && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Preguntas frecuentes:</Text>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestion}
                  onPress={() => handleSuggestion(suggestion)}
                >
                  <MaterialCommunityIcons
                    name="help-circle-outline"
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe tu pregunta..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isTyping) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              <MaterialCommunityIcons
                name={isTyping ? "clock-outline" : "send"}
                size={20}
                color={!inputText.trim() || isTyping ? colors.textMuted : "white"}
              />
            </TouchableOpacity>
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  menuButton: {
    padding: 4,
  },
  quickRepliesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  quickReply: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickReplyText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  botText: {
    color: colors.textLight,
  },
  userText: {
    color: 'white',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  botTimestamp: {
    color: colors.textMuted,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  suggestionsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  suggestionsTitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 12,
    fontWeight: '600',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  suggestionText: {
    color: colors.textLight,
    fontSize: 13,
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.textLight,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

export default AIChatbotScreen;