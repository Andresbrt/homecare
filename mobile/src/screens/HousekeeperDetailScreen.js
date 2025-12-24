import React, { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const FALLBACK_HOUSEKEEPER = {
  name: 'Especialista CleanHome',
  rating: 4.9,
  jobs: 120,
  specialty: 'Limpieza integral',
  avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80',
  bio: 'Profesional verificada con experiencia en hogares familiares, oficinas boutique y espacios post-obra.',
  highlights: ['Certificación en limpieza hipoalergénica', 'Especialista en organización de closets', 'Disponible fines de semana'],
};

const HousekeeperDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const housekeeper = route.params?.housekeeper ?? FALLBACK_HOUSEKEEPER;
  const [photoEvidences, setPhotoEvidences] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    loadPhotoEvidences();
  }, []);

  const loadPhotoEvidences = async () => {
    try {
      // Cargar evidencias fotográficas del proveedor desde AsyncStorage
      const evidenceKey = `photo_evidence_provider_${housekeeper.id || 'default'}`;
      const savedEvidences = await AsyncStorage.getItem(evidenceKey);
      if (savedEvidences) {
        setPhotoEvidences(JSON.parse(savedEvidences));
      } else {
        // Evidencias demo para mostrar el concepto
        const demoEvidences = [
          {
            id: 'demo-1',
            serviceDate: '2024-01-15',
            clientName: 'María López',
            roomName: 'Cocina',
            beforePhoto: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80',
            afterPhoto: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80',
            description: 'Limpieza profunda de cocina integral'
          },
          {
            id: 'demo-2',
            serviceDate: '2024-01-12',
            clientName: 'Carlos Méndez',
            roomName: 'Sala de estar',
            beforePhoto: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
            afterPhoto: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
            description: 'Aspirado y organización de muebles'
          },
          {
            id: 'demo-3',
            serviceDate: '2024-01-10',
            clientName: 'Ana García',
            roomName: 'Baño principal',
            beforePhoto: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=400&q=80',
            afterPhoto: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=400&q=80',
            description: 'Desinfección y limpieza de azulejos'
          },
        ];
        setPhotoEvidences(demoEvidences);
      }
    } catch (error) {
      console.error('Error loading photo evidences:', error);
    }
  };

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const renderPhotoEvidence = ({ item }) => (
    <TouchableOpacity 
      style={styles.evidenceCard}
      onPress={() => openPhotoModal(item)}
    >
      <Image source={{ uri: item.afterPhoto }} style={styles.evidencePhoto} />
      <View style={styles.evidenceInfo}>
        <Text style={styles.evidenceRoom}>{item.roomName}</Text>
        <Text style={styles.evidenceDate}>{item.serviceDate}</Text>
        <Text style={styles.evidenceDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleSchedule = () => {
    navigation.navigate('ScheduleService', {
      service: {
        title: `Servicio con ${housekeeper.name}`,
        description: housekeeper.specialty,
        duration: 'A coordinar',
        priceRange: 'Según servicio',
      },
    });
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <LinearGradient colors={[colors.primary, colors.primaryAlt]} style={styles.headerGradient}>
            <Image source={{ uri: housekeeper.avatar }} style={styles.avatar} />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{housekeeper.name}</Text>
              <Text style={styles.specialty}>{housekeeper.specialty}</Text>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="star" size={18} color={colors.accent} />
                <Text style={styles.metaText}>{housekeeper.rating} • {housekeeper.jobs} servicios</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sobre {housekeeper.name.split(' ')[0]}</Text>
          <Text style={styles.cardText}>{housekeeper.bio}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Destrezas destacadas</Text>
          {housekeeper.highlights?.map((item) => (
            <View key={item} style={styles.listItem}>
              <MaterialCommunityIcons name="check-circle" color={colors.success} size={18} />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Nueva sección de evidencias fotográficas */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Evidencias de trabajos</Text>
            <MaterialCommunityIcons name="camera" size={20} color={colors.primary} />
          </View>
          <Text style={styles.sectionSubtitle}>
            Fotos del antes y después de servicios realizados
          </Text>
          
          {photoEvidences.length > 0 ? (
            <FlatList
              data={photoEvidences}
              renderItem={renderPhotoEvidence}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.evidencesList}
            />
          ) : (
            <View style={styles.noEvidencesContainer}>
              <MaterialCommunityIcons name="image-off" size={48} color={colors.textSecondary} />
              <Text style={styles.noEvidencesText}>
                Aún no hay evidencias fotográficas disponibles
              </Text>
            </View>
          )}
        </View>

        <LinearGradient colors={[colors.primary, colors.accent]} style={styles.ctaGradient}>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={handleSchedule}
          >
            <MaterialCommunityIcons name="calendar" size={20} color={colors.textLight} />
            <Text style={styles.ctaText}>Reservar con {housekeeper.name.split(' ')[0]}</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textLight} />
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* Modal para ver foto en grande */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.photoModalContainer}>
          <TouchableOpacity 
            style={styles.photoModalBackdrop}
            onPress={() => setShowPhotoModal(false)}
          >
            <View style={styles.photoModalContent}>
              {selectedPhoto && (
                <>
                  <Text style={styles.photoModalTitle}>
                    {selectedPhoto.roomName} - {selectedPhoto.serviceDate}
                  </Text>
                  <View style={styles.photoComparisonContainer}>
                    <View style={styles.photoContainer}>
                      <Text style={styles.photoLabel}>Antes</Text>
                      <Image 
                        source={{ uri: selectedPhoto.beforePhoto }} 
                        style={styles.photoModalImage} 
                      />
                    </View>
                    <View style={styles.photoContainer}>
                      <Text style={styles.photoLabel}>Después</Text>
                      <Image 
                        source={{ uri: selectedPhoto.afterPhoto }} 
                        style={styles.photoModalImage} 
                      />
                    </View>
                  </View>
                  <Text style={styles.photoModalDescription}>
                    {selectedPhoto.description}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120,
  },
  headerCard: {
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'hidden',
  },
  headerGradient: {
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 28,
    marginRight: 20,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    color: colors.textLight,
    fontSize: 22,
    fontWeight: '700',
  },
  specialty: {
    marginTop: 6,
    color: colors.textLight,
    opacity: 0.85,
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  metaText: {
    marginLeft: 8,
    color: colors.textLight,
    fontSize: 13,
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: '700',
  },
  cardText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  listItemText: {
    marginLeft: 12,
    color: colors.textDark,
    fontSize: 14,
  },
  ctaGradient: {
    borderRadius: 22,
    padding: 1,
    marginTop: 10,
  },
  ctaButton: {
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  ctaText: {
    flex: 1,
    marginLeft: 12,
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  // Estilos para evidencias fotográficas
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionSubtitle: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  evidencesList: {
    marginTop: 16,
    paddingRight: 20,
  },
  evidenceCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  evidencePhoto: {
    width: '100%',
    height: 100,
    backgroundColor: colors.background,
  },
  evidenceInfo: {
    padding: 8,
  },
  evidenceRoom: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  evidenceDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  evidenceDescription: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 12,
  },
  noEvidencesContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noEvidencesText: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
  },
  // Estilos para modal de fotos
  photoModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModalBackdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoModalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  photoModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  photoComparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  photoContainer: {
    width: '48%',
  },
  photoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  photoModalImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  photoModalDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default HousekeeperDetailScreen;
