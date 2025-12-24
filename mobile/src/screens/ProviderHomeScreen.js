import React, { useContext, useMemo, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import AnimatedCard from '../components/AnimatedCard';
import FloatingActionButton from '../components/FloatingActionButton';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import notificationService from '../services/notificationService';

const ProviderHomeScreen = () => {
  const { user, signIn, token } = useContext(AuthContext);
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

  // Configurar notificaciones cuando el componente se monta
  useEffect(() => {
    // Simular llegada de nueva solicitud después de 5 segundos (solo para demo)
    const timer = setTimeout(() => {
      notificationService.simulateNewRequest();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleRoleSwitch = () => {
    const updatedUser = { ...user, role: 'CUSTOMER' };
    signIn({ token, user: updatedUser });
    Alert.alert('Rol cambiado', 'Ahora eres Cliente');
  };

  const agenda = useMemo(
    () => [
      {
        id: 'booking-1',
        client: 'Laura Méndez',
        address: 'Av. Central 245, Torre B',
        type: 'Limpieza profunda',
        start: 'Hoy • 3:00 PM',
        duration: '4h',
        extras: ['Cocina a fondo', 'Aspirado'],
      },
      {
        id: 'booking-2',
        client: 'Luis Romero',
        address: 'Calle 12 #166',
        type: 'Express 60min',
        start: 'Mañana • 9:00 AM',
        duration: '1h',
        extras: ['Pet-friendly'],
      },
      {
        id: 'booking-3',
        client: 'Oficina Creativa',
        address: 'Cowork Lab, piso 3',
        type: 'Oficinas',
        start: 'Lun • 8:00 AM',
        duration: '5h',
        extras: ['Desinfección'],
      },
    ],
    [],
  );

  const stats = useMemo(
    () => [
      {
        id: 'requests',
        label: 'Solicitudes Pendientes',
        value: '2',
        icon: 'bell-ring',
        gradient: ['#EF4444', '#DC2626'], // Rojo notificación
        screen: 'IncomingRequests',
        badge: true,
      },
      {
        id: 'availability',
        label: 'Disponibilidad',
        value: '🕐',
        icon: 'calendar-clock',
        gradient: ['#8B5CF6', '#7C3AED'], // Púrpura
        screen: 'ProviderAvailability',
      },
      {
        id: 'financial',
        label: 'Finanzas',
        value: '$1.2M COP',
        icon: 'cash-multiple',
        gradient: ['#10B981', '#059669'], // Verde
        screen: 'ProviderFinancial',
      },
      {
        id: 'gallery',
        label: 'Galería de trabajos',
        value: '📸',
        icon: 'image-multiple',
        gradient: ['#F59E0B', '#D97706'], // Ámbar
        screen: 'ProviderPhotoGallery',
      },
      {
        id: 'analytics',
        label: 'Ver Analytics Completos',
        value: '📊',
        icon: 'chart-line',
        gradient: ['#2563EB', '#1D4ED8'], // Azul moderno
        screen: 'AnalyticsDashboard',
      },
      {
        id: 'earnings',
        label: 'Ingresos de la semana',
        value: '$325k COP',
        icon: 'cash-fast',
        gradient: ['#10B981', '#059669'], // Verde esmeralda
      },
      {
        id: 'rating',
        label: 'Calificación promedio',
        value: '4.9',
        icon: 'star-circle',
        gradient: ['#F59E0B', '#D97706'], // Ámbar vibrante
      },
      {
        id: 'loyal',
        label: 'Clientes recurrentes',
        value: '18',
        icon: 'account-heart',
        gradient: ['#8B5CF6', '#7C3AED'], // Púrpura moderno
      },
      // Accesos rápidos añadidos para características avanzadas
      {
        id: 'inventory',
        label: 'Inventario',
        value: '📦',
        icon: 'archive',
        gradient: ['#9333EA', '#7E22CE'],
        screen: 'Inventory',
      },
      {
        id: 'smart',
        label: 'Smart Scheduling',
        value: '🤖',
        icon: 'brain',
        gradient: ['#0EA5E9', '#0369A1'],
        screen: 'SmartScheduling',
      },
      {
        id: 'guarantee',
        label: 'Garantías',
        value: '🛡',
        icon: 'shield-check',
        gradient: ['#16A34A', '#15803D'],
        screen: 'Guarantee',
      },
      {
        id: 'community',
        label: 'Comunidad',
        value: '🌐',
        icon: 'earth',
        gradient: ['#F472B6', '#DB2777'],
        screen: 'SocialFeed',
      },
      {
        id: 'notifications',
        label: 'Test Notificaciones',
        value: '🔔',
        icon: 'bell-ring',
        gradient: ['#EF4444', '#DC2626'],
        screen: 'NotificationTest',
      },
    ],
    [],
  );

  const renderStatCard = (item, index) => (
    <AnimatedCard
      key={item.id}
      animationType={index % 2 === 0 ? 'slideInLeft' : 'slideInRight'}
      delay={200 + index * 100}
      style={{ width: '48%', marginBottom: 16 }}
    >
      <TouchableOpacity
        onPress={() => item.screen && navigation.navigate(item.screen)}
        disabled={!item.screen}
        activeOpacity={0.85}
      >
        <LinearGradient colors={item.gradient} style={styles.statCardInner}>
          <View style={styles.statIconWrapper}>
            <MaterialCommunityIcons name={item.icon} size={26} color="rgba(255,255,255,0.95)" />
          </View>
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel} numberOfLines={2}>{item.label}</Text>
          {item.screen && (
            <MaterialCommunityIcons
              name="arrow-right"
              size={16}
              color="rgba(255,255,255,0.85)"
              style={styles.statArrow}
            />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </AnimatedCard>
  );

  const renderAgendaCard = ({ item }) => (
    <View style={styles.agendaCard}>
      <View style={styles.agendaHeader}>
        <View>
          <Text style={styles.agendaTitle}>{item.client}</Text>
          <Text style={styles.agendaSubtitle}>{item.type}</Text>
        </View>
        <MaterialCommunityIcons name="dots-horizontal" size={20} color={colors.textMuted} />
      </View>
      <View style={styles.agendaRow}>
        <MaterialCommunityIcons name="clock-outline" size={18} color={colors.textMuted} />
        <Text style={styles.agendaMeta}>{item.start}</Text>
        <View style={styles.dot} />
        <Text style={styles.agendaMeta}>{item.duration}</Text>
      </View>
      <View style={styles.agendaRow}>
        <MaterialCommunityIcons name="map-marker" size={18} color={colors.textMuted} />
        <Text style={styles.agendaMeta}>{item.address}</Text>
      </View>
      <View style={styles.extrasRow}>
        {item.extras.map((extra) => (
          <View key={extra} style={styles.extraPill}>
            <Text style={styles.extraText}>{extra}</Text>
          </View>
        ))}
      </View>
      <View style={styles.agendaFooter}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('PhotoEvidence', { booking: item })}
        >
          <Text style={styles.secondaryButtonText}>Evidencia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Iniciar servicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header moderno con glassmorphism */}
        <AnimatedCard animationType="fadeInDown" delay={0}>
          <GlassCard variant="glass" blur="light" style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingTitle}>
                  ¡Hola {user?.firstName ? user.firstName : 'Profesional'}! 👨‍🔧
                </Text>
                <View style={styles.roleBadgeContainer}>
                  <Text style={styles.roleBadgeText}>🛠️ Proveedor</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
                <MaterialCommunityIcons name="menu" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <Text style={styles.greetingSubtitle}>
              Gestiona tus próximos servicios, revisa tu desempeño y mantén a tus clientes felices.
            </Text>
            <TouchableOpacity style={styles.switchRoleButton} onPress={handleRoleSwitch}>
              <Text style={styles.switchRoleText}>🔄 Cambiar a Cliente</Text>
            </TouchableOpacity>
          </GlassCard>
        </AnimatedCard>

        {/* Estadísticas modernas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Tu desempeño hoy</Text>
          <View style={styles.statsGrid}>
            {stats.map((s, i) => renderStatCard(s, i))}
          </View>
        </View>

        {/* Agenda próxima */}
        <View style={styles.agendaSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agenda próxima</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProviderCalendar')}>
              <Text style={styles.sectionLink}>Ver calendario</Text>
            </TouchableOpacity>
          </View>
          
          {agenda.map((item, index) => (
            <AnimatedCard 
              key={item.id} 
              animationType="fadeInUp" 
              delay={600 + (index * 100)}
              style={{ marginBottom: 16 }}
            >
              <GlassCard variant="elevated" style={styles.modernAgendaCard}>
                <View style={styles.agendaHeader}>
                  <View style={styles.agendaMainInfo}>
                    <Text style={styles.agendaClient}>{item.client}</Text>
                    <Text style={styles.agendaType}>{item.type}</Text>
                  </View>
                  <View style={styles.agendaActions}>
                    <TouchableOpacity style={styles.agendaActionButton}>
                      <MaterialCommunityIcons name="phone" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.agendaActionButton}>
                      <MaterialCommunityIcons name="message" size={20} color={colors.secondary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.agendaMeta}>
                  <View style={styles.agendaMetaItem}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.agendaMetaText}>{item.start}</Text>
                  </View>
                  <View style={styles.agendaMetaItem}>
                    <MaterialCommunityIcons name="timer-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.agendaMetaText}>{item.duration}</Text>
                  </View>
                </View>
                
                <View style={styles.agendaLocation}>
                  <MaterialCommunityIcons name="map-marker" size={16} color={colors.textMuted} />
                  <Text style={styles.agendaLocationText}>{item.address}</Text>
                </View>
                
                <View style={styles.agendaExtras}>
                  {item.extras.map((extra) => (
                    <View key={extra} style={styles.modernExtraPill}>
                      <Text style={styles.modernExtraText}>{extra}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.agendaFooter}>
                  <TouchableOpacity 
                    style={styles.modernSecondaryButton}
                    onPress={() => navigation.navigate('PhotoEvidence', { booking: item })}
                  >
                    <MaterialCommunityIcons name="camera" size={16} color={colors.primary} />
                    <Text style={styles.modernSecondaryButtonText}>Evidencia</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modernPrimaryButton}>
                    <MaterialCommunityIcons name="play" size={16} color={colors.white} />
                    <Text style={styles.modernPrimaryButtonText}>Iniciar</Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            </AnimatedCard>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon="calendar-plus"
        onPress={() => navigation.navigate('ProviderCalendar')}
        variant="primary"
        pulsing={true}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  // Header moderno
  headerCard: {
    margin: 20,
    marginTop: 60,
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  roleBadgeContainer: {
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRoleButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  switchRoleText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },

  // Sección de estadísticas
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statCardInner: {
    borderRadius: 20,
    padding: 16,
    minHeight: 130,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
  },
  statArrow: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },

  // Agenda moderna
  agendaSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  modernAgendaCard: {
    padding: 20,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  agendaMainInfo: {
    flex: 1,
  },
  agendaClient: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  agendaType: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  agendaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  agendaActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  agendaMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  agendaMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  agendaMetaText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  agendaLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  agendaLocationText: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  agendaExtras: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  modernExtraPill: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modernExtraText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  agendaFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modernSecondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 6,
  },
  modernSecondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  modernPrimaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    gap: 6,
  },
  modernPrimaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProviderHomeScreen;
