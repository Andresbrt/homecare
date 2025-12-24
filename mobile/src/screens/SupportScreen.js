import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const SupportScreen = () => {
  const handleOpenFAQ = () => {
    Alert.alert('Próximamente', 'Estamos preparando el centro de ayuda interactivo.');
  };

  const handleContact = (type) => {
    let url = '';
    if (type === 'chat') {
      url = 'https://wa.me/573005551234';
    } else if (type === 'email') {
      url = 'mailto:soporte@cleanhome.app';
    } else {
      url = 'tel:+573005551234';
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('No se pudo abrir', 'Intenta nuevamente o contáctanos desde la web.');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(() => Alert.alert('No se pudo abrir', 'Intenta nuevamente o contáctanos desde la web.'));
  };

  const quickAnswers = [
    {
      id: 'qa-1',
      icon: 'calendar-check',
      title: '¿Cómo reagendar un servicio?',
      description: 'Ingresa al historial, selecciona la reserva y elige la opción reagendar.',
    },
    {
      id: 'qa-2',
      icon: 'cash-refund',
      title: 'Políticas de reembolso',
      description: 'Los reembolsos aplican hasta 12 horas antes del servicio programado.',
    },
    {
      id: 'qa-3',
      icon: 'account-check',
      title: 'Profesionales verificados',
      description: 'Todos pasan filtros de antecedentes y capacitación presencial.',
    },
  ];

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <MaterialCommunityIcons name="lifebuoy" size={36} color={colors.primary} />
          <Text style={styles.heroTitle}>Centro de ayuda CleanHome</Text>
          <Text style={styles.heroSubtitle}>
            Resuelve dudas frecuentes o contáctanos para una atención personalizada.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atención inmediata</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={[styles.quickCard, styles.quickCardSpacer]}
              activeOpacity={0.9}
              onPress={() => handleContact('chat')}
            >
              <MaterialCommunityIcons name="message-text" size={24} color={colors.textLight} />
              <Text style={styles.quickCardTitle}>Chat en vivo</Text>
              <Text style={styles.quickCardSubtitle}>Respuesta promedio 5 min.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.9}
              onPress={() => handleContact('email')}
            >
              <MaterialCommunityIcons name="email-fast" size={24} color={colors.textLight} />
              <Text style={styles.quickCardTitle}>Correo</Text>
              <Text style={styles.quickCardSubtitle}>soporte@cleanhome.app</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.quickCard, styles.quickFull]}
            activeOpacity={0.9}
            onPress={() => handleContact('phone')}
          >
            <MaterialCommunityIcons name="phone-in-talk" size={24} color={colors.textLight} />
            <Text style={styles.quickCardTitle}>Línea de emergencia</Text>
            <Text style={styles.quickCardSubtitle}>Disponible 24/7 para casos urgentes.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Respuestas rápidas</Text>
          {quickAnswers.map((item) => (
            <TouchableOpacity key={item.id} style={styles.answerCard} activeOpacity={0.85} onPress={handleOpenFAQ}>
              <View style={styles.answerIcon}>
                <MaterialCommunityIcons name={item.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.answerTextWrapper}>
                <Text style={styles.answerTitle}>{item.title}</Text>
                <Text style={styles.answerDescription}>{item.description}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.faqButton} activeOpacity={0.9} onPress={handleOpenFAQ}>
          <MaterialCommunityIcons name="head-question" size={20} color={colors.textLight} />
          <Text style={styles.faqButtonText}>Abrir centro de ayuda completo</Text>
        </TouchableOpacity>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 140,
  },
  hero: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: 24,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  heroTitle: {
    marginTop: 16,
    color: colors.textDark,
    fontSize: 22,
    fontWeight: '700',
  },
  heroSubtitle: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickCardSpacer: {
    marginRight: 12,
  },
  quickFull: {
    marginTop: 14,
    marginRight: 0,
  },
  quickCardTitle: {
    marginTop: 12,
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  quickCardSubtitle: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  answerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  answerIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  answerTextWrapper: {
    flex: 1,
  },
  answerTitle: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '600',
  },
  answerDescription: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  faqButton: {
    marginTop: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  faqButtonText: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SupportScreen;
