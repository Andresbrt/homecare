import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const SmartSchedulingScreen = ({ navigation }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const aiSuggestions = {
    recommended: {
      date: '2024-12-02',
      time: '10:00 AM',
      duration: '2.5 horas',
      confidence: 95,
      reasons: [
        'Horario habitual de tus servicios anteriores',
        'Alta disponibilidad de tu proveedor favorito',
        'Mejor precio en este horario (-15%)',
      ],
      price: 57800,
      originalPrice: 68000,
    },
    alternatives: [
      {
        id: 1,
        date: '2024-12-03',
        time: '2:00 PM',
        duration: '2.5 horas',
        confidence: 85,
        reason: 'Tu segundo horario más frecuente',
        price: 61200,
        discount: 10,
      },
      {
        id: 2,
        date: '2024-12-04',
        time: '9:00 AM',
        duration: '3 horas',
        confidence: 78,
        reason: 'Proveedor premium disponible',
        price: 64600,
        discount: 5,
      },
    ],
  };

  const schedule = {
    frequency: 'Cada 2 semanas',
    lastService: '2024-11-18',
    nextSuggested: '2024-12-02',
    pattern: 'Lunes por la mañana',
    averageDuration: '2.5 horas',
  };

  const insights = [
    {
      icon: 'chart-line',
      title: 'Patrón identificado',
      description: 'Prefieres servicios quincenales los lunes entre 9-11 AM',
      color: colors.primary,
    },
    {
      icon: 'clock-fast',
      title: 'Mejor momento',
      description: 'Las mañanas de lunes tienen 30% menos cancelaciones',
      color: colors.success,
    },
    {
      icon: 'cash-multiple',
      title: 'Ahorro potencial',
      description: 'Servicios en horario matutino ahorran hasta 20%',
      color: colors.secondary,
    },
  ];

  const handleAcceptSuggestion = () => {
    Alert.alert(
      '✨ Programación confirmada',
      `Servicio programado para:\n\n📅 ${aiSuggestions.recommended.date}\n🕐 ${aiSuggestions.recommended.time}\n⏱️ Duración: ${aiSuggestions.recommended.duration}\n💰 Precio: ${formatCOP(aiSuggestions.recommended.price)}\n\n¿Deseas activar recordatorios automáticos?`,
      [
        {
          text: 'Solo confirmar',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Sí, con recordatorios',
          onPress: () => {
            Alert.alert('✅ ¡Listo!', 'Servicio programado con recordatorios activos');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleEnableAutoScheduling = () => {
    Alert.alert(
      '🤖 Programación automática',
      '¿Deseas que CleanHome programe automáticamente tus servicios cada 2 semanas según tu patrón de uso?\n\nPodrás modificar o cancelar en cualquier momento.',
      [
        { text: 'Más tarde', style: 'cancel' },
        {
          text: 'Activar',
          onPress: () => {
            Alert.alert(
              '✅ Activado',
              'Tus servicios se programarán automáticamente. Recibirás una notificación 48h antes para confirmar.'
            );
          },
        },
      ]
    );
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Scheduling</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="cog" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* AI Badge */}
        <View style={styles.aiBadge}>
          <MaterialCommunityIcons name="robot" size={20} color={colors.primary} />
          <Text style={styles.aiBadgeText}>Sugerencias personalizadas con IA</Text>
        </View>

        {/* Recommended Slot */}
        <View style={styles.recommendedCard}>
          <View style={styles.recommendedHeader}>
            <View style={styles.recommendedBadge}>
              <MaterialCommunityIcons name="star" size={16} color={colors.white} />
              <Text style={styles.recommendedBadgeText}>Recomendado</Text>
            </View>
            <View style={styles.confidenceBadge}>
              <MaterialCommunityIcons name="chart-box" size={14} color={colors.success} />
              <Text style={styles.confidenceText}>{aiSuggestions.recommended.confidence}% match</Text>
            </View>
          </View>

          <View style={styles.recommendedMain}>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateBox}>
                <MaterialCommunityIcons name="calendar" size={32} color={colors.primary} />
                <Text style={styles.dateText}>
                  {new Date(aiSuggestions.recommended.date).toLocaleDateString('es-CO', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
              </View>
              <View style={styles.timeBox}>
                <MaterialCommunityIcons name="clock" size={32} color={colors.secondary} />
                <Text style={styles.timeText}>{aiSuggestions.recommended.time}</Text>
                <Text style={styles.durationText}>{aiSuggestions.recommended.duration}</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>
                {formatCOP(aiSuggestions.recommended.originalPrice)}
              </Text>
              <Text style={styles.recommendedPrice}>
                {formatCOP(aiSuggestions.recommended.price)}
              </Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>
                  Ahorras {formatCOP(aiSuggestions.recommended.originalPrice - aiSuggestions.recommended.price)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>¿Por qué este horario?</Text>
            {aiSuggestions.recommended.reasons.map((reason, index) => (
              <View key={index} style={styles.reasonRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAcceptSuggestion}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="calendar-check" size={20} color={colors.white} />
            <Text style={styles.acceptButtonText}>Agendar este horario</Text>
          </TouchableOpacity>
        </View>

        {/* Alternatives */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Otras opciones inteligentes</Text>
          {aiSuggestions.alternatives.map((alt) => (
            <TouchableOpacity
              key={alt.id}
              style={styles.altCard}
              onPress={() => setSelectedSuggestion(alt.id)}
              activeOpacity={0.8}
            >
              <View style={styles.altLeft}>
                <View style={styles.altDateBox}>
                  <Text style={styles.altDay}>
                    {new Date(alt.date).toLocaleDateString('es-CO', { day: 'numeric' })}
                  </Text>
                  <Text style={styles.altMonth}>
                    {new Date(alt.date).toLocaleDateString('es-CO', { month: 'short' })}
                  </Text>
                </View>
                <View style={styles.altInfo}>
                  <Text style={styles.altTime}>{alt.time}</Text>
                  <Text style={styles.altReason}>{alt.reason}</Text>
                  <View style={styles.altMeta}>
                    <MaterialCommunityIcons
                      name="chart-box"
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.altConfidence}>{alt.confidence}% match</Text>
                  </View>
                </View>
              </View>
              <View style={styles.altRight}>
                <Text style={styles.altPrice}>{formatCOP(alt.price)}</Text>
                {alt.discount > 0 && (
                  <View style={styles.altDiscount}>
                    <Text style={styles.altDiscountText}>-{alt.discount}%</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Schedule Pattern */}
        <View style={styles.patternCard}>
          <View style={styles.patternHeader}>
            <MaterialCommunityIcons name="repeat" size={24} color={colors.primary} />
            <Text style={styles.patternTitle}>Tu patrón de limpieza</Text>
          </View>
          <View style={styles.patternGrid}>
            <View style={styles.patternItem}>
              <Text style={styles.patternLabel}>Frecuencia</Text>
              <Text style={styles.patternValue}>{schedule.frequency}</Text>
            </View>
            <View style={styles.patternItem}>
              <Text style={styles.patternLabel}>Último servicio</Text>
              <Text style={styles.patternValue}>
                {new Date(schedule.lastService).toLocaleDateString('es-CO')}
              </Text>
            </View>
            <View style={styles.patternItem}>
              <Text style={styles.patternLabel}>Patrón preferido</Text>
              <Text style={styles.patternValue}>{schedule.pattern}</Text>
            </View>
            <View style={styles.patternItem}>
              <Text style={styles.patternLabel}>Duración típica</Text>
              <Text style={styles.patternValue}>{schedule.averageDuration}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.autoScheduleButton}
            onPress={handleEnableAutoScheduling}
          >
            <MaterialCommunityIcons name="robot" size={18} color={colors.primary} />
            <Text style={styles.autoScheduleText}>Activar programación automática</Text>
          </TouchableOpacity>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights personalizados</Text>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
                <MaterialCommunityIcons name={insight.icon} size={24} color={insight.color} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Custom Schedule */}
        <TouchableOpacity style={styles.customButton}>
          <MaterialCommunityIcons name="calendar-edit" size={20} color={colors.textSecondary} />
          <Text style={styles.customButtonText}>Elegir fecha y hora manualmente</Text>
        </TouchableOpacity>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  aiBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  recommendedCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  recommendedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  recommendedMain: {
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateBox: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 8,
    textTransform: 'capitalize',
  },
  timeBox: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 8,
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  recommendedPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  savingsBadge: {
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  reasonsContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  altCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  altLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  altDateBox: {
    width: 56,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  altDay: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  altMonth: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  altInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  altTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  altReason: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  altMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  altConfidence: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  altRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  altPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  altDiscount: {
    backgroundColor: colors.success + '20',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  altDiscountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  patternCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  patternTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
  },
  patternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  patternItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
  },
  patternLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  patternValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  autoScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  autoScheduleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },
  customButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default SmartSchedulingScreen;
