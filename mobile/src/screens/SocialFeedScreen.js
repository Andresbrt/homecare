import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const SocialFeedScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [likedPosts, setLikedPosts] = useState([]);

  const posts = [
    {
      id: 1,
      user: {
        name: 'María González',
        avatar: null,
        verified: true,
      },
      type: 'before-after',
      title: '¡Transformación increíble de mi cocina!',
      description: 'Carlos hizo un trabajo espectacular. Recomendado 100%',
      provider: 'Carlos Rodríguez',
      service: 'Limpieza Profunda',
      likes: 24,
      comments: 8,
      timeAgo: '2 horas',
      images: 2,
    },
    {
      id: 2,
      user: {
        name: 'Juan Pérez',
        avatar: null,
        verified: false,
      },
      type: 'review',
      title: 'Mejor decisión que he tomado',
      description: 'Llevo 3 meses con el servicio quincenal y mi casa siempre impecable',
      rating: 5,
      provider: 'Ana Martínez',
      service: 'Limpieza Regular',
      likes: 18,
      comments: 5,
      timeAgo: '5 horas',
    },
    {
      id: 3,
      user: {
        name: 'Laura Sánchez',
        avatar: null,
        verified: true,
      },
      type: 'tip',
      title: 'Tip: Prepara tu hogar antes del servicio',
      description:
        'Recoge juguetes y objetos del piso. El proveedor podrá enfocarse en la limpieza profunda y el resultado será mejor.',
      likes: 42,
      comments: 12,
      timeAgo: '1 día',
      tag: 'Consejos útiles',
    },
    {
      id: 4,
      user: {
        name: 'Pedro Ramírez',
        avatar: null,
        verified: false,
      },
      type: 'milestone',
      title: '🎉 ¡10 servicios completados!',
      description:
        'Desde que uso CleanHome mi calidad de vida mejoró muchísimo. Más tiempo para mi familia.',
      likes: 31,
      comments: 9,
      timeAgo: '2 días',
      badge: 'Cliente frecuente',
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'María González', points: 2450, badge: '🏆', services: 24 },
    { rank: 2, name: 'Laura Sánchez', points: 2280, badge: '🥈', services: 22 },
    { rank: 3, name: 'Pedro Ramírez', points: 2100, badge: '🥉', services: 20 },
    { rank: 4, name: 'Ana Castro', points: 1850, badge: '⭐', services: 18 },
    { rank: 5, name: 'Tú', points: 1650, badge: '⭐', services: 16, isCurrentUser: true },
  ];

  const challenges = [
    {
      id: 1,
      title: 'Racha de 3 meses',
      description: 'Usa CleanHome por 3 meses consecutivos',
      progress: 2,
      total: 3,
      reward: '50,000 puntos',
      icon: 'fire',
      color: colors.secondary,
    },
    {
      id: 2,
      title: 'Embajador social',
      description: 'Comparte 5 experiencias en el feed',
      progress: 3,
      total: 5,
      reward: '30,000 puntos',
      icon: 'share',
      color: colors.primary,
    },
    {
      id: 3,
      title: 'Maestro referidor',
      description: 'Invita a 10 amigos',
      progress: 7,
      total: 10,
      reward: '100,000 puntos',
      icon: 'account-heart',
      color: '#9C27B0',
    },
  ];

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const renderPost = (post) => {
    const isLiked = likedPosts.includes(post.id);

    return (
      <View key={post.id} style={styles.postCard}>
        {/* User Header */}
        <View style={styles.postHeader}>
          <View style={styles.userAvatar}>
            <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userName}>
              <Text style={styles.userNameText}>{post.user.name}</Text>
              {post.user.verified && (
                <MaterialCommunityIcons name="check-decagram" size={16} color={colors.primary} />
              )}
            </View>
            <Text style={styles.postTime}>{post.timeAgo}</Text>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>

          {post.provider && (
            <View style={styles.serviceTag}>
              <MaterialCommunityIcons name="account-tie" size={14} color={colors.primary} />
              <Text style={styles.serviceTagText}>
                {post.provider} • {post.service}
              </Text>
            </View>
          )}

          {post.rating && (
            <View style={styles.ratingContainer}>
              {[...Array(post.rating)].map((_, i) => (
                <MaterialCommunityIcons key={i} name="star" size={18} color="#FFD700" />
              ))}
            </View>
          )}

          {post.tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{post.tag}</Text>
            </View>
          )}

          {post.badge && (
            <View style={styles.badgeBanner}>
              <MaterialCommunityIcons name="medal" size={20} color={colors.secondary} />
              <Text style={styles.badgeText}>{post.badge}</Text>
            </View>
          )}

          {post.images && (
            <View style={styles.imagesContainer}>
              <View style={styles.imagePlaceholder}>
                <MaterialCommunityIcons name="image" size={32} color={colors.textMuted} />
                <Text style={styles.imagePlaceholderText}>Antes</Text>
              </View>
              <View style={styles.imagePlaceholder}>
                <MaterialCommunityIcons name="image" size={32} color={colors.textMuted} />
                <Text style={styles.imagePlaceholderText}>Después</Text>
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(post.id)}
          >
            <MaterialCommunityIcons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? colors.error : colors.textSecondary}
            />
            <Text style={[styles.actionText, isLiked && { color: colors.error }]}>
              {post.likes + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="comment-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="share-variant" size={22} color={colors.textSecondary} />
            <Text style={styles.actionText}>Compartir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Comunidad CleanHome</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
            onPress={() => setActiveTab('feed')}
          >
            <MaterialCommunityIcons
              name="post"
              size={20}
              color={activeTab === 'feed' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
              Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'leaderboard' && styles.tabActive]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <MaterialCommunityIcons
              name="trophy"
              size={20}
              color={activeTab === 'leaderboard' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.tabTextActive]}>
              Ranking
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'challenges' && styles.tabActive]}
            onPress={() => setActiveTab('challenges')}
          >
            <MaterialCommunityIcons
              name="target"
              size={20}
              color={activeTab === 'challenges' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'challenges' && styles.tabTextActive]}>
              Retos
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Feed */}
          {activeTab === 'feed' && (
            <>
              {/* Create Post */}
              <TouchableOpacity style={styles.createPostCard}>
                <View style={styles.userAvatar}>
                  <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
                </View>
                <Text style={styles.createPostText}>Comparte tu experiencia...</Text>
                <MaterialCommunityIcons name="image-plus" size={24} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Posts */}
              {posts.map(renderPost)}
            </>
          )}

          {/* Leaderboard */}
          {activeTab === 'leaderboard' && (
            <View style={styles.leaderboardContainer}>
              <View style={styles.leaderboardHeader}>
                <MaterialCommunityIcons name="trophy" size={32} color="#FFD700" />
                <Text style={styles.leaderboardTitle}>Top usuarios del mes</Text>
                <Text style={styles.leaderboardSubtitle}>
                  Gana puntos con cada servicio y comparte experiencias
                </Text>
              </View>

              {leaderboard.map((user) => (
                <View
                  key={user.rank}
                  style={[
                    styles.leaderboardCard,
                    user.isCurrentUser && styles.leaderboardCardHighlight,
                  ]}
                >
                  <View style={styles.leaderboardLeft}>
                    <Text style={styles.rankBadge}>{user.badge}</Text>
                    <View style={styles.leaderboardAvatar}>
                      <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.leaderboardInfo}>
                      <Text style={styles.leaderboardName}>{user.name}</Text>
                      <Text style={styles.leaderboardServices}>{user.services} servicios</Text>
                    </View>
                  </View>
                  <Text style={styles.leaderboardPoints}>{user.points} pts</Text>
                </View>
              ))}

              <View style={styles.pointsInfoCard}>
                <MaterialCommunityIcons name="information" size={18} color={colors.primary} />
                <Text style={styles.pointsInfoText}>
                  Gana 100 puntos por servicio + puntos extra por compartir y referir
                </Text>
              </View>
            </View>
          )}

          {/* Challenges */}
          {activeTab === 'challenges' && (
            <View style={styles.challengesContainer}>
              <View style={styles.challengesHeader}>
                <MaterialCommunityIcons name="target" size={32} color={colors.secondary} />
                <Text style={styles.challengesTitle}>Desafíos activos</Text>
                <Text style={styles.challengesSubtitle}>
                  Completa retos y gana recompensas exclusivas
                </Text>
              </View>

              {challenges.map((challenge) => (
                <View key={challenge.id} style={styles.challengeCard}>
                  <View style={[styles.challengeIcon, { backgroundColor: challenge.color + '20' }]}>
                    <MaterialCommunityIcons name={challenge.icon} size={28} color={challenge.color} />
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDescription}>{challenge.description}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${(challenge.progress / challenge.total) * 100}%`,
                              backgroundColor: challenge.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {challenge.progress}/{challenge.total}
                      </Text>
                    </View>
                    <View style={styles.rewardContainer}>
                      <MaterialCommunityIcons name="gift" size={16} color={colors.secondary} />
                      <Text style={styles.rewardText}>{challenge.reward}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tabActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  createPostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPostText: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
  },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  postTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  postContent: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  postDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 8,
  },
  serviceTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: colors.secondary + '20',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  badgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary + '15',
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  imagePlaceholder: {
    flex: 1,
    height: 120,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  leaderboardContainer: {},
  leaderboardHeader: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 12,
    marginBottom: 6,
  },
  leaderboardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  leaderboardCardHighlight: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    fontSize: 24,
    marginRight: 12,
  },
  leaderboardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leaderboardInfo: {},
  leaderboardName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  leaderboardServices: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  leaderboardPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  pointsInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    gap: 10,
  },
  pointsInfoText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  challengesContainer: {},
  challengesHeader: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  challengesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 12,
    marginBottom: 6,
  },
  challengesSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  challengeCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  challengeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
});

export default SocialFeedScreen;
