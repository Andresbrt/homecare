import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const EnhancedRatingScreen = ({ route, navigation }) => {
  const { booking, provider } = route.params || {};
  
  const [overallRating, setOverallRating] = useState(0);
  const [aspectRatings, setAspectRatings] = useState({
    quality: 0,
    punctuality: 0,
    professionalism: 0,
    communication: 0,
  });
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(null);

  const aspects = [
    { id: 'quality', name: 'Calidad del trabajo', icon: 'star-check' },
    { id: 'punctuality', name: 'Puntualidad', icon: 'clock-check' },
    { id: 'professionalism', name: 'Profesionalismo', icon: 'account-tie' },
    { id: 'communication', name: 'Comunicación', icon: 'message-text' },
  ];

  const badges = [
    { id: 'excellent', name: '¡Excelente!', icon: 'star', color: '#FFD700' },
    { id: 'punctual', name: 'Muy puntual', icon: 'clock-check', color: colors.success },
    { id: 'professional', name: 'Profesional', icon: 'tie', color: colors.primary },
    { id: 'friendly', name: 'Muy amable', icon: 'heart', color: colors.error },
    { id: 'detailed', name: 'Detallista', icon: 'magnify', color: colors.secondary },
    { id: 'efficient', name: 'Eficiente', icon: 'lightning-bolt', color: '#FF6B00' },
    { id: 'careful', name: 'Cuidadoso', icon: 'shield-check', color: colors.success },
    { id: 'clean', name: 'Impecable', icon: 'sparkles', color: '#9C27B0' },
  ];

  const toggleBadge = (badgeId) => {
    if (selectedBadges.includes(badgeId)) {
      setSelectedBadges(selectedBadges.filter((id) => id !== badgeId));
    } else {
      setSelectedBadges([...selectedBadges, badgeId]);
    }
  };

  const handleSubmit = () => {
    if (overallRating === 0) {
      Alert.alert('⭐ Calificación requerida', 'Por favor selecciona una calificación general');
      return;
    }

    const allAspectsRated = Object.values(aspectRatings).every((rating) => rating > 0);
    if (!allAspectsRated) {
      Alert.alert(
        '📊 Evaluación incompleta',
        '¿Deseas continuar sin evaluar todos los aspectos?',
        [
          { text: 'Completar evaluación', style: 'cancel' },
          { text: 'Continuar', onPress: () => submitRating() },
        ]
      );
      return;
    }

    submitRating();
  };

  const submitRating = () => {
    Alert.alert(
      '✨ ¡Gracias por tu calificación!',
      `Tu opinión es muy importante para nosotros.\n\n${
        overallRating >= 4
          ? '¡Nos alegra que hayas tenido una gran experiencia!'
          : 'Lamentamos que tu experiencia no haya sido la mejor. Tomaremos medidas para mejorar.'
      }`,
      [
        {
          text: 'Finalizar',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderStars = (rating, onPress, size = 32) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onPress(star)} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name={star <= rating ? 'star' : 'star-outline'}
              size={size}
              color={star <= rating ? '#FFD700' : colors.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Evaluar servicio</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Provider Info */}
        <View style={styles.providerCard}>
          <View style={styles.providerAvatar}>
            <MaterialCommunityIcons name="account" size={32} color={colors.primary} />
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider?.name || 'Carlos Rodríguez'}</Text>
            <Text style={styles.serviceType}>Limpieza Profunda • 2.5 horas</Text>
            <Text style={styles.serviceDate}>
              {new Date().toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Overall Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calificación general</Text>
          <View style={styles.overallRatingCard}>
            {renderStars(overallRating, setOverallRating, 40)}
            {overallRating > 0 && (
              <Text style={styles.ratingText}>
                {overallRating === 5
                  ? '¡Excelente!'
                  : overallRating === 4
                  ? 'Muy bueno'
                  : overallRating === 3
                  ? 'Bueno'
                  : overallRating === 2
                  ? 'Regular'
                  : 'Necesita mejorar'}
              </Text>
            )}
          </View>
        </View>

        {/* Aspect Ratings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evalúa cada aspecto</Text>
          {aspects.map((aspect) => (
            <View key={aspect.id} style={styles.aspectCard}>
              <View style={styles.aspectHeader}>
                <MaterialCommunityIcons name={aspect.icon} size={20} color={colors.primary} />
                <Text style={styles.aspectName}>{aspect.name}</Text>
              </View>
              {renderStars(
                aspectRatings[aspect.id],
                (rating) => setAspectRatings({ ...aspectRatings, [aspect.id]: rating }),
                24
              )}
            </View>
          ))}
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agrega etiquetas (opcional)</Text>
          <View style={styles.badgesContainer}>
            {badges.map((badge) => {
              const isSelected = selectedBadges.includes(badge.id);
              return (
                <TouchableOpacity
                  key={badge.id}
                  style={[
                    styles.badge,
                    isSelected && {
                      backgroundColor: badge.color + '20',
                      borderColor: badge.color,
                    },
                  ]}
                  onPress={() => toggleBadge(badge.id)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={badge.icon}
                    size={18}
                    color={isSelected ? badge.color : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.badgeText,
                      isSelected && { color: badge.color, fontWeight: '700' },
                    ]}
                  >
                    {badge.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recommendation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Recomendarías este profesional?</Text>
          <View style={styles.recommendContainer}>
            <TouchableOpacity
              style={[
                styles.recommendButton,
                wouldRecommend === true && styles.recommendButtonYes,
              ]}
              onPress={() => setWouldRecommend(true)}
            >
              <MaterialCommunityIcons
                name="thumb-up"
                size={24}
                color={wouldRecommend === true ? colors.white : colors.success}
              />
              <Text
                style={[
                  styles.recommendButtonText,
                  wouldRecommend === true && styles.recommendButtonTextActive,
                ]}
              >
                Sí, lo recomiendo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recommendButton,
                wouldRecommend === false && styles.recommendButtonNo,
              ]}
              onPress={() => setWouldRecommend(false)}
            >
              <MaterialCommunityIcons
                name="thumb-down"
                size={24}
                color={wouldRecommend === false ? colors.white : colors.error}
              />
              <Text
                style={[
                  styles.recommendButtonText,
                  wouldRecommend === false && styles.recommendButtonTextActive,
                ]}
              >
                No lo recomiendo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuéntanos más (opcional)</Text>
          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Comparte detalles de tu experiencia..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.characterCount}>{comment.length}/500</Text>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            overallRating === 0 && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={overallRating === 0}
        >
          <MaterialCommunityIcons name="check-circle" size={20} color={colors.white} />
          <Text style={styles.submitButtonText}>Enviar evaluación</Text>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
          <Text style={styles.skipButtonText}>Evaluar más tarde</Text>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  providerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  serviceDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  overallRatingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 16,
  },
  aspectCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  aspectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aspectName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  badgeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  recommendContainer: {
    gap: 12,
  },
  recommendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  recommendButtonYes: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  recommendButtonNo: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  recommendButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },
  recommendButtonTextActive: {
    color: colors.white,
  },
  commentContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  commentInput: {
    fontSize: 14,
    color: colors.textDark,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  skipButton: {
    alignItems: 'center',
    padding: 16,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default EnhancedRatingScreen;
