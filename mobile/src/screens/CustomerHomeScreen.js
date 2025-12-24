import React, { useContext, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import AnimatedCard from '../components/AnimatedCard';
import { colors } from '../theme/colors';

const CustomerHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleRequestService = () => {
    navigation.navigate('RequestService');
  };

  const services = useMemo(
    () => [
      {
        id: 'deep-clean',
        title: 'Limpieza profunda',
        description:
          'Renueva cada habitación con limpieza detallada de baños, cocina y rincones difíciles.',
        duration: '4-5 horas',
        priceRange: 'Desde $80,000 COP',
        emoji: '🧽',
        includes: [
          'Desinfección de superficies',
          'Limpieza de electrodomésticos',
          'Detalles minuciosos',
        ],
      },
      {
        id: 'express',
        title: 'Express 60min',
        description:
          'Refresca espacios clave cuando necesitas resultados rápidos sin sacrificar calidad.',
        duration: '1 hora',
        priceRange: 'Desde $80,000 COP',
        emoji: '⚡',
        includes: ['Sala y comedor', 'Limpieza rápida de baño', 'Organización ligera'],
      },
      {
        id: 'allergy-free',
        title: 'Hipoalergénica',
        description:
          'Perfecta para hogares con bebés o personas sensibles a químicos; productos neutros.',
        duration: '3-4 horas',
        priceRange: 'Desde $80,000 COP',
        emoji: '🌿',
        includes: [
          'Productos sin fragancias',
          'Enfoque en polvo y alérgenos',
          'Renovación de textiles',
        ],
      },
      {
        id: 'office',
        title: 'Oficinas',
        description: 'Mantén tu espacio de trabajo impecable con horarios adaptados a tu equipo.',
        duration: 'Personalizado',
        priceRange: 'Cotización',
        emoji: '💼',
        includes: ['Puestos individuales', 'Áreas comunes', 'Suministros y cafetería'],
      },
      {
        id: 'move',
        title: 'Mudanza y post-obra',
        description:
          'Deja tu inmueble listo tras remodelaciones o mudanzas con limpieza de acabados.',
        duration: '6-8 horas',
        priceRange: 'Desde $120,000 COP',
        emoji: '🚚',
        includes: ['Retiro de polvo fino', 'Limpieza de ventanas', 'Cuidado según materiales'],
      },
    ],
    [],
  );

  const categories = useMemo(
    () =>
      services.slice(0, 4).map((service) => ({
        id: service.id,
        title: service.title,
        emoji: service.emoji,
        // Logo local por categoría (fallback a isotipo principal)
        icon:
          service.id === 'deep-clean'
            ? require('../../assets/Isotipo-principal.png')
            : service.id === 'express'
            ? require('../../assets/Isotipo-Secundario.png')
            : require('../../assets/Isotipo-Blanco.png'),
        gradient:
          service.id === 'deep-clean'
            ? ['#2563EB', '#1D4ED8']
            : service.id === 'express'
            ? ['#F59E0B', '#D97706']
            : service.id === 'allergy-free'
            ? ['#10B981', '#059669']
            : ['#8B5CF6', '#7C3AED'],
      })),
    [services],
  );

  const featuredHousekeepers = useMemo(
    () => [
      {
        id: '1',
        name: 'Daniela R.',
        rating: 4.9,
        jobs: 186,
        specialty: 'Limpieza Premium',
        experience: '5 años de experiencia certificada.',
        avatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
      },
      {
        id: '2',
        name: 'Marta G.',
        rating: 4.8,
        jobs: 142,
        specialty: 'Express y Pet-friendly',
        experience: 'Especialista en hogares con mascotas.',
        avatar:
          'https://images.unsplash.com/photo-1524502397800-20022d83f2d4?auto=format&fit=crop&w=120&q=80',
      },
      {
        id: '3',
        name: 'Carla P.',
        rating: 5.0,
        jobs: 204,
        specialty: 'Post-obra',
        experience: 'Experta en limpieza de acabados finos.',
        avatar:
          'https://images.unsplash.com/photo-1517677129300-07b130802f46?auto=format&fit=crop&w=120&q=80',
      },
    ],
    [],
  );

  const quickActions = useMemo(
    () => [
      {
        id: 'emergency',
        title: '🆘 Emergencia',
        subtitle: 'Llamar 123 o compartir ubicación',
        icon: 'police-badge',
        route: 'EmergencyService',
        color: colors.error,
        isPrimary: true,
      },
      {
        id: 'schedule',
        title: '📅 Agendar Servicio',
        subtitle: 'Programa tu limpieza',
        icon: 'calendar-plus',
        route: 'ServiceCatalog',
        color: colors.primary,
        isPrimary: true,
      },
      {
        id: 'tracking',
        title: '📍 Seguimiento',
        subtitle: 'Ubicación en tiempo real',
        icon: 'map-marker-path',
        route: 'TrackingScreen',
        color: colors.accent,
        isPrimary: true,
      },
      {
        id: 'loyalty',
        title: '👑 Mis Beneficios',
        subtitle: 'Puntos y recompensas',
        icon: 'crown',
        route: 'LoyaltyProgram',
        color: colors.accent,
      },
      {
        id: 'support',
        title: '🤖 Asistente IA',
        subtitle: 'Ayuda inteligente',
        icon: 'robot',
        route: 'AIChatbot',
        color: colors.secondary,
      },
      {
        id: 'favorites',
        title: '⭐ Favoritos',
        subtitle: 'Mis proveedores',
        icon: 'heart',
        route: 'Favorites',
        color: colors.accentPurple,
      },
      {
        id: 'history',
        title: '📋 Historial',
        subtitle: 'Servicios anteriores',
        icon: 'history',
        route: 'ServiceHistory',
        color: colors.info,
      },
      // Accesos rápidos nuevos
      {
        id: 'wallet',
        title: '💰 Wallet',
        subtitle: 'Saldo y recargas',
        icon: 'wallet',
        route: 'Wallet',
        color: colors.success,
      },
      {
        id: 'addons',
        title: '🛒 Add-ons',
        subtitle: 'Servicios extra',
        icon: 'plus-box',
        route: 'AddonsMarketplace',
        color: colors.secondary,
      },
      {
        id: 'subscription',
        title: '🔐 Membresía',
        subtitle: 'Planes VIP',
        icon: 'crown-circle',
        route: 'Subscription',
        color: colors.primary,
      },
      {
        id: 'referrals',
        title: '👥 Referidos',
        subtitle: 'Invita y gana',
        icon: 'account-group',
        route: 'Referral',
        color: colors.accentPurple,
      },
      {
        id: 'community',
        title: '🌐 Comunidad',
        subtitle: 'Comparte y gana',
        icon: 'earth',
        route: 'SocialFeed',
        color: colors.info,
      },
      {
        id: 'smart',
        title: '🤖 Smart',
        subtitle: 'IA horarios',
        icon: 'brain',
        route: 'SmartScheduling',
        color: colors.secondary,
      },
      {
        id: 'vacation',
        title: '🏖 Vacaciones',
        subtitle: 'Modo activo',
        icon: 'beach',
        route: 'VacationMode',
        color: colors.warning,
      },
      {
        id: 'guarantee',
        title: '🛡 Garantía',
        subtitle: 'Reclamos 24h',
        icon: 'shield-check',
        route: 'Guarantee',
        color: colors.success,
      },
    ],
    [],
  );

  const menuOptions = useMemo(
    () => [
      {
        id: 'profile',
        title: 'Mi Perfil',
        subtitle: 'Información personal',
        icon: 'account-circle',
        route: 'UserProfile',
        color: colors.primary,
      },
      {
        id: 'settings',
        title: 'Ajustes',
        subtitle: 'Configuración de la app',
        icon: 'cog',
        route: 'Settings',
        color: colors.secondary,
      },
      {
        id: 'notifications',
        title: 'Notificaciones',
        subtitle: 'Gestionar alertas',
        icon: 'bell',
        route: 'Notifications',
        color: colors.warning,
      },
      {
        id: 'help',
        title: 'Ayuda y Soporte',
        subtitle: 'Centro de ayuda',
        icon: 'help-circle',
        route: 'Support',
        color: colors.info,
      },
      {
        id: 'payment',
        title: 'Métodos de Pago',
        subtitle: 'Tarjetas y billeteras',
        icon: 'credit-card',
        route: 'PaymentMethods',
        color: colors.accent,
      },
      {
        id: 'logout',
        title: 'Cerrar Sesión',
        subtitle: 'Salir de la aplicación',
        icon: 'logout',
        action: 'logout',
        color: colors.error,
      },
    ],
    [],
  );

  const handleCategoryPress = (categoryId) => {
    const selectedService = services.find((service) => service.id === categoryId);

    if (!selectedService) {
      navigation.navigate('ServiceCatalog', {
        services,
        selectedServiceId: categoryId,
      });
      return;
    }

    navigation.navigate('ServiceDetail', {
      service: selectedService,
    });
  };

  const handleViewAll = () => {
    navigation.navigate('ServiceCatalog', {
      services,
    });
  };

  const handleFilterPress = () => {
    navigation.navigate('ServiceCatalog', {
      services,
      showFilters: true,
    });
  };

  const handleMenuOptionPress = (option) => {
    setShowMenu(false);
    
    if (option.action === 'logout') {
      // Implementar logout aquí
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Cerrar Sesión', 
            style: 'destructive',
            onPress: () => {
              // Aquí implementarías la lógica de logout
              console.log('Cerrando sesión...');
            }
          },
        ]
      );
    } else if (option.route) {
      if (option.route === 'TrackingScreen') {
        navigation.navigate(option.route, {
          booking: {
            service: { title: 'Servicio activo', id: 'demo-service' },
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            address: 'Tu ubicación actual',
            status: 'En progreso',
            paymentConfirmed: true,
          },
          trackingActive: true,
        });
      } else {
        navigation.navigate(option.route);
      }
    }
  };

  const handleSchedulePress = () => {
    navigation.navigate('ScheduleService');
  };

  const handleHousekeeperPress = (housekeeper) => {
    navigation.navigate('HousekeeperDetail', {
      housekeeper,
    });
  };

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();

    navigation.navigate('ServiceCatalog', {
      services,
      query: query.length ? query : undefined,
    });
  };

  const handleQuickActionPress = (item) => {
    if (item.params) {
      navigation.navigate(item.route, item.params);
    } else {
      navigation.navigate(item.route);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      activeOpacity={0.85}
      onPress={() => handleCategoryPress(item.id)}
    >
      <LinearGradient colors={item.gradient} style={styles.categoryGradient}>
        {/* Logo local para evitar imágenes rotas */}
        {item.icon ? (
          <Image source={item.icon} style={styles.categoryIcon} resizeMode="contain" />
        ) : (
          <Text style={styles.categoryEmoji}>{item.emoji}</Text>
        )}
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFeatured = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => handleHousekeeperPress(item)}>
      <View style={styles.featuredCard}>
        <Image source={{ uri: item.avatar }} style={styles.featuredAvatar} />
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredName}>{item.name}</Text>
          <Text style={styles.featuredSpecialty}>{item.specialty}</Text>
          <Text style={styles.featuredExperience}>{item.experience}</Text>
          <View style={styles.featuredMetaRow}>
            <View style={styles.metaPill}>
              <MaterialCommunityIcons name="star" color={colors.accent} size={16} />
              <Text style={styles.metaText}>{item.rating}</Text>
            </View>
            <View style={styles.metaPill}>
              <MaterialCommunityIcons name="check-circle" color={colors.success} size={16} />
              <Text style={styles.metaText}>{item.jobs} servicios</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AnimatedCard animationType="fadeInDown" delay={0}>
          <GlassCard variant="glass" blur="light" style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingTitle}>
                  Hola {user?.firstName ? `${user.firstName}` : 'CleanLover'} 👋
                </Text>
                <View style={styles.roleBadgeContainer}>
                  <Text style={styles.roleBadgeText}>Cliente</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
                <MaterialCommunityIcons name="menu" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <Text style={styles.greetingSubtitle}>¿Qué rincón de tu hogar necesita magia hoy?</Text>
          </GlassCard>
        </AnimatedCard>

        {/* Etiquetas de servicios (texto sobre fondo blanco) */}
        <View style={styles.servicesTextWrap}>
          [
            'Limpieza General',
            'Limpieza Profunda',
            'Express 60min',
            'Lavado de Ropa',
            'Planchado',
            'Ventanas',
          ].map((label) => (
            <View key={label} style={styles.serviceChip}>
              <Text style={styles.serviceChipText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* BOTÓN PRINCIPAL SOLICITAR SERVICIO - Estilo InDrive */}
        <AnimatedCard animationType="slideInUp" delay={150}>
          <TouchableOpacity
            style={styles.mainServiceButton}
            activeOpacity={0.9}
            onPress={handleRequestService}
          >
            <LinearGradient
              colors={[colors.secondary, colors.secondaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainServiceGradient}
            >
              <View style={styles.mainServiceContent}>
                <View style={styles.mainServiceIcon}>
                  <MaterialCommunityIcons name="broom" size={40} color="#FFFFFF" />
                </View>
                <View style={styles.mainServiceText}>
                  <Text style={styles.mainServiceTitle}>Solicitar Servicio</Text>
                  <Text style={styles.mainServiceSubtitle}>
                    Elige Premium o Confort • Paga en COP
                  </Text>
                </View>
                <MaterialCommunityIcons name="arrow-right-circle" size={32} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </AnimatedCard>

        <AnimatedCard animationType="slideInRight" delay={300}>
          <GlassCard variant="elevated" style={styles.searchCard}>
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons name="magnify" size={22} color={colors.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchSubmit}
                style={styles.searchInput}
                placeholder="Busca por tipo de servicio, alergias, mascotas"
                placeholderTextColor={colors.inputPlaceholder}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                <MaterialCommunityIcons name="tune-variant" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </GlassCard>
        </AnimatedCard>

        <TouchableOpacity style={styles.heroCard} activeOpacity={0.9} onPress={handleSchedulePress}>
          <LinearGradient colors={[colors.primary, colors.primaryAlt]} style={styles.heroGradient}>
            <View style={styles.heroTextWrapper}>
              <Text style={styles.heroTitle}>Programa limpieza gourmet</Text>
              <Text style={styles.heroSubtitle}>
                Elige horarios, añade extras y recibe a tu especialista en minutos.
              </Text>
            </View>
            <MaterialCommunityIcons name="home-circle" size={56} color="rgba(255,255,255,0.85)" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías destacadas</Text>
          <TouchableOpacity onPress={handleViewAll}>
            <Text style={styles.sectionLink}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        </View>
        <View style={styles.quickGrid}>
          {quickActions.slice(0, 2).map((item, index) => (
            <AnimatedCard
              key={item.id}
              delay={index * 100}
              animationType="scaleIn"
              style={{ width: '48%' }}
            >
              <TouchableOpacity
                style={[
                  styles.primaryQuickCard,
                  { backgroundColor: item.color }
                ]}
                activeOpacity={0.85}
                onPress={() => handleQuickActionPress(item)}
              >
                <View style={styles.primaryIconWrapper}>
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={28} 
                    color={colors.white}
                  />
                </View>
                <Text style={styles.primaryQuickTitle}>
                  {item.title}
                </Text>
                <Text style={styles.primaryQuickSubtitle}>
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            </AnimatedCard>
          ))}
        </View>
        
        {/* Acciones secundarias */}
        <View style={styles.secondaryActionsGrid}>
          {quickActions.slice(2).map((item, index) => (
            <AnimatedCard
              key={item.id}
              delay={(index + 2) * 100}
              animationType="slideInUp"
              style={{ width: '48%', marginBottom: 12 }}
            >
              <GlassCard variant="elevated" style={styles.secondaryQuickCard}>
                <TouchableOpacity
                  style={styles.secondaryCardContent}
                  activeOpacity={0.85}
                  onPress={() => handleQuickActionPress(item)}
                >
                  <View style={[styles.secondaryIconWrapper, { backgroundColor: `${item.color}20` }]}>
                    <MaterialCommunityIcons 
                      name={item.icon} 
                      size={20} 
                      color={item.color}
                    />
                  </View>
                  <Text style={styles.secondaryQuickTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.secondaryQuickSubtitle}>
                    {item.subtitle}
                  </Text>
                </TouchableOpacity>
              </GlassCard>
            </AnimatedCard>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ama de casa ideal para ti</Text>
          <TouchableOpacity onPress={handleFilterPress}>
            <Text style={styles.sectionLink}>Filtrar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredHousekeepers}
          renderItem={renderFeatured}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />

        <TouchableOpacity
          style={styles.primaryCta}
          activeOpacity={0.85}
          onPress={handleSchedulePress}
        >
          <MaterialCommunityIcons name="calendar-plus" color={colors.textLight} size={20} />
          <Text style={styles.primaryCtaText}>Agendar limpieza personalizada</Text>
          <MaterialCommunityIcons name="chevron-right" color={colors.textLight} size={22} />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal del menú */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.menuModalContainer}>
          <TouchableOpacity 
            style={styles.menuModalBackdrop}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuModalContent}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menú</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuOptions}>
              {menuOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.menuOption}
                  onPress={() => handleMenuOptionPress(option)}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: option.color }]}>
                    <MaterialCommunityIcons name={option.icon} size={20} color={colors.white} />
                  </View>
                  <View style={styles.menuOptionText}>
                    <Text style={styles.menuOptionTitle}>{option.title}</Text>
                    <Text style={styles.menuOptionSubtitle}>{option.subtitle}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  servicesTextWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  serviceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  serviceChipText: {
    color: '#001B38',
    fontWeight: '600',
  },
  header: {
    marginBottom: 20,
  },
  headerCard: {
    marginBottom: 20,
    padding: 20,
  },
  searchCard: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  greetingSubtitle: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    color: colors.inputText,
    fontSize: 15,
    fontWeight: '500',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  heroTitle: {
    color: colors.textLight,
    flex: 1,
    fontWeight: '700',
  },
  heroSubtitle: {
    marginTop: 8,
    color: colors.textLight,
    opacity: 0.9,
    lineHeight: 20,
  },
  sectionHeader: {
    marginTop: 32,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesList: {
    paddingBottom: 4,
    paddingRight: 40,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  primaryQuickCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryQuickTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  primaryQuickSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  secondaryActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  secondaryQuickCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  secondaryCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  secondaryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  secondaryQuickTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  secondaryQuickSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 14,
  },
  categoryCard: {
    marginRight: 0,
  },
  categoryGradient: {
    width: 150,
    height: 120,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  roleBadgeContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  featuredCard: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(13,12,38,0.85)',
    marginBottom: 0,
  },
  featuredAvatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    marginRight: 16,
  },
  featuredInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredName: {
    color: colors.textLight,
    fontSize: 17,
    fontWeight: '700',
  },
  featuredSpecialty: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 13,
  },
  featuredExperience: {
    color: colors.textMuted,
    marginTop: 6,
    fontSize: 12,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  // Deprecated emergency-specific styles removed (ya no se usan)
  metaText: {
    marginLeft: 6,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  primaryCta: {
    marginTop: 12,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryCtaText: {
    flex: 1,
    marginLeft: 12,
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Estilos del botón principal (separados correctamente)
  mainServiceButton: {
    marginHorizontal: 0,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  mainServiceGradient: {
    padding: 20,
  },
  mainServiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainServiceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mainServiceText: {
    flex: 1,
  },
  mainServiceTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mainServiceSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Estilos para el modal del menú
  menuModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuModalBackdrop: {
    flex: 1,
  },
  menuModalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
  },
  menuOptions: {
    paddingBottom: 20,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuOptionText: {
    flex: 1,
  },
  menuOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  menuOptionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default CustomerHomeScreen;
