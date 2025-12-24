import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const ReferralScreen = ({ navigation }) => {
  const [referralCode] = useState('CLEAN2024');
  const [stats, setStats] = useState({
    totalReferrals: 8,
    activeReferrals: 5,
    totalEarned: 240000,
    pendingRewards: 60000,
    level: 'Gold',
    nextLevel: 'Platinum',
    pointsToNext: 2,
  });

  const levels = [
    {
      name: 'Bronze',
      minReferrals: 0,
      bonus: 30000,
      color: colors.accent, // Azul Petróleo
      icon: 'medal',
    },
    {
      name: 'Silver',
      minReferrals: 3,
      bonus: 35000,
      color: colors.secondary, // Azul Marino
      icon: 'medal',
    },
    {
      name: 'Gold',
      minReferrals: 7,
      bonus: 40000,
      color: colors.warning, // Dorado
      icon: 'medal',
    },
    {
      name: 'Platinum',
      minReferrals: 15,
      bonus: 50000,
      color: colors.primary, // Turquesa
      icon: 'crown',
    },
    {
      name: 'Diamond',
      minReferrals: 25,
      bonus: 60000,
      color: colors.primaryLight, // Turquesa claro
      icon: 'diamond-stone',
    },
  ];

  const referrals = [
    {
      id: 1,
      name: 'María González',
      date: '2024-11-15',
      status: 'active',
      earned: 40000,
      servicesUsed: 3,
    },
    {
      id: 2,
      name: 'Juan Pérez',
      date: '2024-11-10',
      status: 'active',
      earned: 40000,
      servicesUsed: 5,
    },
    {
      id: 3,
      name: 'Ana Martínez',
      date: '2024-11-05',
      status: 'pending',
      earned: 20000,
      servicesUsed: 1,
    },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `¡Únete a CleanHome y recibe ${formatCOP(30000)} de descuento en tu primer servicio! Usa mi código: ${referralCode}\n\n🧹 Servicios de limpieza profesional\n⭐ Los mejores profesionales\n💰 Ahorra en cada servicio\n\nDescarga la app: https://cleanhome.app`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('✅ Código copiado', `Tu código "${referralCode}" ha sido copiado al portapapeles`);
  };

  const getCurrentLevel = () => {
    return levels.find((l) => l.name === stats.level) || levels[0];
  };

  const getNextLevel = () => {
    const currentIndex = levels.findIndex((l) => l.name === stats.level);
    return levels[currentIndex + 1] || null;
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Programa de Referidos</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="help-circle" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Level Status */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={[styles.levelBadge, { backgroundColor: getCurrentLevel().color }]}>
              <MaterialCommunityIcons name={getCurrentLevel().icon} size={32} color={colors.white} />
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>Nivel {stats.level}</Text>
              <Text style={styles.levelBonus}>
                Bono: {formatCOP(getCurrentLevel().bonus)} por referido
              </Text>
            </View>
          </View>

          {getNextLevel() && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  {stats.pointsToNext} referidos más para nivel {stats.nextLevel}
                </Text>
                <MaterialCommunityIcons
                  name={getNextLevel().icon}
                  size={20}
                  color={getNextLevel().color}
                />
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        ((stats.totalReferrals - getCurrentLevel().minReferrals) /
                          (getNextLevel().minReferrals - getCurrentLevel().minReferrals)) *
                        100
                      }%`,
                      backgroundColor: getNextLevel().color,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Referral Code */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Tu código de referido</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <MaterialCommunityIcons name="content-copy" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
            <MaterialCommunityIcons name="share-variant" size={20} color={colors.white} />
            <Text style={styles.shareButtonText}>Compartir código</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="account-multiple" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalReferrals}</Text>
            <Text style={styles.statLabel}>Referidos totales</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
            <Text style={styles.statValue}>{stats.activeReferrals}</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{formatCOP(stats.totalEarned)}</Text>
            <Text style={styles.statLabel}>Ganado</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={colors.warning} />
            <Text style={styles.statValue}>{formatCOP(stats.pendingRewards)}</Text>
            <Text style={styles.statLabel}>Pendiente</Text>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Comparte tu código</Text>
              <Text style={styles.stepDescription}>
                Invita a tus amigos con tu código personal
              </Text>
            </View>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Ellos ahorran</Text>
              <Text style={styles.stepDescription}>
                Reciben {formatCOP(30000)} de descuento en su primer servicio
              </Text>
            </View>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Tú ganas</Text>
              <Text style={styles.stepDescription}>
                Obtén hasta {formatCOP(60000)} cuando completen su primer servicio
              </Text>
            </View>
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historial de referidos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {referrals.map((referral) => (
            <View key={referral.id} style={styles.referralCard}>
              <View style={styles.referralAvatar}>
                <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
              </View>
              <View style={styles.referralInfo}>
                <Text style={styles.referralName}>{referral.name}</Text>
                <Text style={styles.referralDate}>
                  Registrado: {new Date(referral.date).toLocaleDateString('es-CO')}
                </Text>
                <Text style={styles.referralServices}>{referral.servicesUsed} servicios usados</Text>
              </View>
              <View style={styles.referralRight}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        referral.status === 'active' ? colors.success + '20' : colors.warning + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: referral.status === 'active' ? colors.success : colors.warning },
                    ]}
                  >
                    {referral.status === 'active' ? 'Activo' : 'Pendiente'}
                  </Text>
                </View>
                <Text style={styles.earnedAmount}>
                  +{formatCOP(referral.earned)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Levels Info */}
        <View style={styles.levelsCard}>
          <Text style={styles.sectionTitle}>Niveles y recompensas</Text>
          {levels.map((level, index) => {
            const isCurrentLevel = level.name === stats.level;
            const isPastLevel = index < levels.findIndex((l) => l.name === stats.level);

            return (
              <View key={level.name} style={styles.levelRow}>
                <View
                  style={[
                    styles.levelIcon,
                    {
                      backgroundColor: isCurrentLevel ? level.color : colors.backgroundLight,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={level.icon}
                    size={20}
                    color={isCurrentLevel ? colors.white : colors.textMuted}
                  />
                </View>
                <View style={styles.levelRowInfo}>
                  <Text
                    style={[
                      styles.levelRowName,
                      isCurrentLevel && { color: level.color, fontWeight: '700' },
                    ]}
                  >
                    {level.name}
                  </Text>
                  <Text style={styles.levelRowRequirement}>
                    {level.minReferrals}+ referidos • {formatCOP(level.bonus)}/referido
                  </Text>
                </View>
                {isPastLevel && (
                  <MaterialCommunityIcons name="check" size={20} color={colors.success} />
                )}
                {isCurrentLevel && (
                  <View style={[styles.currentBadge, { backgroundColor: level.color }]}>
                    <Text style={styles.currentBadgeText}>Actual</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Terms */}
        <TouchableOpacity style={styles.termsButton}>
          <Text style={styles.termsText}>Términos y condiciones del programa</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
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
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  levelBonus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  codeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  codeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  codeText: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  howItWorksCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  referralAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  referralDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  referralServices: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  referralRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  earnedAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  levelsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  levelRowInfo: {
    flex: 1,
  },
  levelRowName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  levelRowRequirement: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  termsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  termsText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default ReferralScreen;
