import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

const { width: screenWidth } = Dimensions.get('window');

const ProviderPhotoGalleryScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalServices: 0,
    totalPhotos: 0,
    roomsCompleted: 0,
  });

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedFilter, searchQuery, services]);

  const loadServices = async () => {
    try {
      const profileKey = `provider_services_${user?.id || 'demo'}`;
      const storedServices = await AsyncStorage.getItem(profileKey);
      
      if (storedServices) {
        const servicesData = JSON.parse(storedServices);
        setServices(servicesData);
        calculateStats(servicesData);
      } else {
        // Datos de demostración
        const demoServices = [
          {
            serviceId: 'demo-1',
            date: new Date(2025, 10, 20).toISOString(),
            customer: 'María González',
            serviceType: 'Limpieza profunda',
            rooms: [
              {
                id: 'living-room',
                name: 'Sala de estar',
                beforePhoto: 'https://via.placeholder.com/400x300/e0e0e0/666?text=Antes+Sala',
                afterPhoto: 'https://via.placeholder.com/400x300/4CAF50/fff?text=Después+Sala',
              },
              {
                id: 'kitchen',
                name: 'Cocina',
                beforePhoto: 'https://via.placeholder.com/400x300/e0e0e0/666?text=Antes+Cocina',
                afterPhoto: 'https://via.placeholder.com/400x300/4CAF50/fff?text=Después+Cocina',
              },
            ],
            completedAt: new Date(2025, 10, 20).toISOString(),
          },
          {
            serviceId: 'demo-2',
            date: new Date(2025, 10, 18).toISOString(),
            customer: 'Carlos López',
            serviceType: 'Limpieza express',
            rooms: [
              {
                id: 'bathroom',
                name: 'Baño',
                beforePhoto: 'https://via.placeholder.com/400x300/e0e0e0/666?text=Antes+Baño',
                afterPhoto: 'https://via.placeholder.com/400x300/4CAF50/fff?text=Después+Baño',
              },
            ],
            completedAt: new Date(2025, 10, 18).toISOString(),
          },
        ];
        setServices(demoServices);
        calculateStats(demoServices);
      }
    } catch (error) {
      console.error('Error cargando servicios:', error);
    }
  };

  const calculateStats = (servicesData) => {
    const totalServices = servicesData.length;
    let totalPhotos = 0;
    let roomsCompleted = 0;

    servicesData.forEach(service => {
      service.rooms.forEach(room => {
        if (room.beforePhoto) totalPhotos++;
        if (room.afterPhoto) totalPhotos++;
        if (room.beforePhoto && room.afterPhoto) roomsCompleted++;
      });
    });

    setStats({ totalServices, totalPhotos, roomsCompleted });
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        service =>
          service.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(
        service => service.serviceType.toLowerCase().includes(selectedFilter.toLowerCase())
      );
    }

    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    setFilteredServices(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const openServiceDetail = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const renderServiceCard = ({ item }) => {
    const photosCount = item.rooms.reduce(
      (acc, room) => acc + (room.beforePhoto ? 1 : 0) + (room.afterPhoto ? 1 : 0),
      0
    );

    return (
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => openServiceDetail(item)}
        activeOpacity={0.8}
      >
        <View style={styles.serviceHeader}>
          <View style={styles.serviceIcon}>
            <MaterialCommunityIcons name="broom" size={24} color={colors.primary} />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.serviceType}>{item.serviceType}</Text>
            <Text style={styles.serviceDate}>{formatDate(item.completedAt)}</Text>
          </View>
          <View style={styles.serviceStats}>
            <View style={styles.statBadge}>
              <MaterialCommunityIcons name="camera" size={16} color={colors.primary} />
              <Text style={styles.statText}>{photosCount}</Text>
            </View>
            <View style={styles.statBadge}>
              <MaterialCommunityIcons name="door" size={16} color={colors.success} />
              <Text style={styles.statText}>{item.rooms.length}</Text>
            </View>
          </View>
        </View>

        {/* Preview de fotos */}
        <View style={styles.photoPreviewGrid}>
          {item.rooms.slice(0, 4).map((room, index) => (
            <View key={index} style={styles.miniPhotoContainer}>
              {room.afterPhoto && (
                <Image source={{ uri: room.afterPhoto }} style={styles.miniPhoto} />
              )}
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const ServiceDetailModal = () => (
    <Modal
      visible={showServiceModal}
      animationType="slide"
      onRequestClose={() => setShowServiceModal(false)}
    >
      <GradientBackground>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowServiceModal(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalTitle}>{selectedService?.customer}</Text>
              <Text style={styles.modalSubtitle}>{selectedService?.serviceType}</Text>
              <Text style={styles.modalDate}>{formatDate(selectedService?.completedAt)}</Text>
            </View>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedService?.rooms.map((room, index) => (
              <View key={index} style={styles.roomSection}>
                <View style={styles.roomHeader}>
                  <MaterialCommunityIcons name="door" size={20} color={colors.primary} />
                  <Text style={styles.roomTitle}>{room.name}</Text>
                </View>

                <View style={styles.comparisonContainer}>
                  <View style={styles.photoColumn}>
                    <Text style={styles.photoColumnLabel}>ANTES</Text>
                    {room.beforePhoto && (
                      <Image source={{ uri: room.beforePhoto }} style={styles.fullPhoto} />
                    )}
                  </View>

                  <View style={styles.photoColumn}>
                    <Text style={styles.photoColumnLabel}>DESPUÉS</Text>
                    {room.afterPhoto && (
                      <Image source={{ uri: room.afterPhoto }} style={styles.fullPhoto} />
                    )}
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>
      </GradientBackground>
    </Modal>
  );

  const filters = [
    { id: 'all', label: 'Todos', icon: 'view-grid' },
    { id: 'profunda', label: 'Profunda', icon: 'broom' },
    { id: 'express', label: 'Express', icon: 'lightning-bolt' },
    { id: 'oficina', label: 'Oficina', icon: 'office-building' },
  ];

  return (
    <GradientBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Galería de trabajos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="briefcase-check" size={28} color={colors.primary} />
          <Text style={styles.statValue}>{stats.totalServices}</Text>
          <Text style={styles.statLabel}>Servicios</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="camera-outline" size={28} color={colors.success} />
          <Text style={styles.statValue}>{stats.totalPhotos}</Text>
          <Text style={styles.statLabel}>Fotos</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="door-open" size={28} color={colors.warning} />
          <Text style={styles.statValue}>{stats.roomsCompleted}</Text>
          <Text style={styles.statLabel}>Habitaciones</Text>
        </View>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por cliente o tipo de servicio..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <MaterialCommunityIcons
              name={filter.icon}
              size={18}
              color={selectedFilter === filter.id ? 'white' : colors.text.secondary}
            />
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de servicios */}
      {filteredServices.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="image-off" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>No hay servicios registrados</Text>
          <Text style={styles.emptySubtext}>
            Las fotos de tus servicios completados aparecerán aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.serviceId}
          contentContainerStyle={styles.servicesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ServiceDetailModal />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: 'white',
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  serviceDate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  serviceStats: {
    gap: 4,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  photoPreviewGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  miniPhotoContainer: {
    flex: 1,
  },
  miniPhoto: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  modalDate: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roomSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  photoColumn: {
    flex: 1,
  },
  photoColumnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  fullPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProviderPhotoGalleryScreen;
