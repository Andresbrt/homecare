import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

const LoyaltyProgramScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [userLevel, setUserLevel] = useState(1);
  const [currentPoints, setCurrentPoints] = useState(1250);
  const [animatedValue] = useState(new Animated.Value(0));

  const levels = [
    {
      level: 1,
      name: 'Novato Limpio',
      icon: 'star-outline',
      color: '#22C55E', // Verde moderno
      pointsNeeded: 0,
      benefits: ['5% descuento en servicios', 'Soporte prioritario'],
    },
    {
      level: 2,
      name: 'Amante del Orden',
      icon: 'star-half-full',
      color: '#3B82F6', // Azul información
      pointsNeeded: 1000,
      benefits: ['10% descuento', 'Reagendación gratis', 'Chat prioritario'],
    },
    {
      level: 3,
      name: 'Guru de la Limpieza',
      icon: 'star',
      color: '#F59E0B', // Ámbar vibrante
      pointsNeeded: 2500,
      benefits: ['15% descuento', 'Servicios express gratis', 'Proveedor dedicado'],
    },
    {
      level: 4,
      name: 'Maestro del Hogar',
      icon: 'star-circle',
      color: '#8B5CF6', // Púrpura moderno
      pointsNeeded: 5000,
      benefits: ['20% descuento', 'Servicios premium', 'Concierge personal'],
    },
    {
      level: 5,
      name: 'Leyenda CleanHome',
      icon: 'crown',
      color: '#EC4899', // Rosa vibrante
      pointsNeeded: 10000,
      benefits: ['25% descuento', 'Servicios ilimitados', 'VIP exclusivo'],
    },
  ];

  const rewards = [
    {
      id: 'discount-10',
      title: 'Descuento 10%',
      description: 'En tu próximo servicio',
      points: 500,
      icon: 'percent',
      type: 'discount',
      claimed: false,
    },
    {
      id: 'free-express',
      title: 'Servicio Express Gratis',
      description: 'Limpieza rápida de 1 hora',
      points: 800,
      icon: 'lightning-bolt',
      type: 'service',
      claimed: false,
    },
    {
      id: 'priority-support',
      title: 'Soporte VIP 24h',
      description: 'Atención prioritaria por 1 mes',
      points: 1200,
      icon: 'headset',
      type: 'service',
      claimed: false,
    },
    {
      id: 'deep-clean-discount',
      title: '20% Limpieza Profunda',
      description: 'Descuento especial en servicio premium',
      points: 1500,
      icon: 'spray',
      type: 'discount',
      claimed: false,
    },
  ];

  const achievements = [
    {
      id: 'first-service',
      title: 'Primer Servicio',
      description: 'Completaste tu primera limpieza',
      icon: 'trophy',
      points: 100,
      unlocked: true,
      date: '15 Oct 2024',
    },
    {
      id: 'loyal-customer',
      title: 'Cliente Leal',
      description: '10 servicios completados',
      icon: 'heart',
      points: 300,
      unlocked: true,
      date: '1 Nov 2024',
    },
    {
      id: 'early-bird',
      title: 'Madrugador',
      description: 'Servicio antes de las 8 AM',
      icon: 'weather-sunset-up',
      points: 150,
      unlocked: false,
    },
    {
      id: 'eco-warrior',
      title: 'Guerrero Ecológico',
      description: '5 servicios con productos eco-friendly',
      icon: 'leaf',
      points: 200,
      unlocked: false,
    },
    {
      id: 'referral-master',
      title: 'Maestro Referidor',
      description: 'Invita a 3 amigos exitosamente',
      icon: 'account-group',
      points: 500,
      unlocked: false,
    },
  ];

  useEffect(() => {
    // Calcular nivel actual basado en puntos
    const currentLevel = levels.findIndex(level => currentPoints < level.pointsNeeded) - 1;
    setUserLevel(currentLevel >= 0 ? currentLevel + 1 : levels.length);

    // Animación de entrada
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [currentPoints]);

  const getCurrentLevel = () => {
    return levels[userLevel - 1] || levels[levels.length - 1];
  };

  const getNextLevel = () => {
    return levels[userLevel] || null;
  };

  const getProgressToNextLevel = () => {
    const nextLevel = getNextLevel();
    if (!nextLevel) return 100;
    
    const currentLevel = getCurrentLevel();
    const pointsInCurrentLevel = currentPoints - currentLevel.pointsNeeded;
    const pointsNeededForNext = nextLevel.pointsNeeded - currentLevel.pointsNeeded;
    
    return (pointsInCurrentLevel / pointsNeededForNext) * 100;
  };

  const claimReward = (reward) => {
    if (currentPoints >= reward.points) {
      setCurrentPoints(prev => prev - reward.points);
      // Aquí añadirías la lógica para activar la recompensa
      Alert.alert(
        '🎉 ¡Recompensa canjeada!',
        `Has canjeado: ${reward.title}`,
        [{ text: 'Genial', style: 'default' }]
      );
    }
  };

  const renderLevelCard = () => {
    const current = getCurrentLevel();
    const next = getNextLevel();
    const progress = getProgressToNextLevel();

    return (
      <Animated.View style={[styles.levelCard, { opacity: animatedValue }]}>
        <LinearGradient
          colors={[current.color + '40', current.color + '20']}
          style={styles.levelGradient}
        >
          <View style={styles.levelHeader}>
            <View style={[styles.levelIcon, { backgroundColor: current.color }]}>
              <MaterialCommunityIcons name={current.icon} size={32} color="white" />
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{current.name}</Text>
              <Text style={styles.levelNumber}>Nivel {current.level}</Text>
            </View>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsNumber}>{currentPoints.toLocaleString()}</Text>
              <Text style={styles.pointsLabel}>puntos</Text>
            </View>
          </View>

          {next && (
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  Progreso a {next.name}
                </Text>
                <Text style={styles.progressPoints}>
                  {next.pointsNeeded - currentPoints} puntos restantes
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: current.color }]} />
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderBenefits = () => {
    const current = getCurrentLevel();
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 Beneficios de tu nivel</Text>
        <View style={styles.benefitsList}>
          {current.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={current.color} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRewards = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🏆 Canjea tus puntos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {rewards.map((reward) => (
          <TouchableOpacity
            key={reward.id}
            style={[
              styles.rewardCard,
              currentPoints < reward.points && styles.rewardCardDisabled
            ]}
            onPress={() => claimReward(reward)}
            disabled={currentPoints < reward.points}
          >
            <View style={styles.rewardIcon}>
              <MaterialCommunityIcons 
                name={reward.icon} 
                size={24} 
                color={currentPoints >= reward.points ? colors.primary : colors.textMuted} 
              />
            </View>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
            <View style={styles.rewardFooter}>
              <Text style={styles.rewardPoints}>{reward.points} pts</Text>
              {currentPoints >= reward.points ? (
                <Text style={styles.rewardAvailable}>Disponible</Text>
              ) : (
                <Text style={styles.rewardUnavailable}>
                  Faltan {reward.points - currentPoints}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🏅 Logros</Text>
      <View style={styles.achievementsList}>
        {achievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementItem,
              achievement.unlocked && styles.achievementUnlocked
            ]}
          >
            <View style={[
              styles.achievementIcon,
              { backgroundColor: achievement.unlocked ? colors.success : colors.textMuted }
            ]}>
              <MaterialCommunityIcons 
                name={achievement.icon} 
                size={24} 
                color="white" 
              />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={[
                styles.achievementTitle,
                !achievement.unlocked && styles.achievementTitleLocked
              ]}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              {achievement.unlocked && achievement.date && (
                <Text style={styles.achievementDate}>
                  Desbloqueado: {achievement.date}
                </Text>
              )}
            </View>
            <View style={styles.achievementPoints}>
              <Text style={styles.achievementPointsText}>
                +{achievement.points}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textLight} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Programa de Lealtad</Text>
            <Text style={styles.headerSubtitle}>Gana puntos y desbloquea beneficios</Text>
          </View>
        </View>

        {renderLevelCard()}
        {renderBenefits()}
        {renderRewards()}
        {renderAchievements()}

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 ¿Cómo ganar puntos?</Text>
          <Text style={styles.infoText}>
            • Completa servicios: +50-200 puntos{'\n'}
            • Califica al proveedor: +25 puntos{'\n'}
            • Refiere amigos: +500 puntos{'\n'}
            • Logros especiales: hasta +500 puntos{'\n'}
            • Servicios premium: puntos dobles
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  levelCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  levelGradient: {
    padding: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
  },
  levelNumber: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsNumber: {
    color: colors.textLight,
    fontSize: 24,
    fontWeight: '700',
  },
  pointsLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  progressPoints: {
    color: colors.textMuted,
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
  },
  benefitText: {
    color: colors.textLight,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  rewardCard: {
    width: 180,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rewardCardDisabled: {
    opacity: 0.5,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardTitle: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardDescription: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardPoints: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  rewardAvailable: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
  rewardUnavailable: {
    color: colors.textMuted,
    fontSize: 11,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
  },
  achievementUnlocked: {
    borderWidth: 1,
    borderColor: colors.success,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  achievementTitleLocked: {
    color: colors.textMuted,
  },
  achievementDescription: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  achievementDate: {
    color: colors.success,
    fontSize: 11,
    marginTop: 4,
  },
  achievementPoints: {
    alignItems: 'flex-end',
  },
  achievementPointsText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  infoSection: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});

export default LoyaltyProgramScreen;