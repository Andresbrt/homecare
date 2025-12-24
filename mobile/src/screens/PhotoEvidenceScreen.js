import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

const { width: screenWidth } = Dimensions.get('window');

const PhotoEvidenceScreen = ({ route, navigation }) => {
  const { booking } = route.params || {};

  // Guard clause: si no hay booking válido, redirigir de forma segura
  useEffect(() => {
    if (!booking || !booking.id) {
      navigation.replace('Home');
    }
  }, [booking, navigation]);
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [completedRooms, setCompletedRooms] = useState(new Set());

  const serviceId = booking?.id || 'demo-service';

  const defaultRooms = [
    {
      id: 'living-room',
      name: 'Sala de estar',
      icon: 'sofa',
      description: 'Aspirado, limpieza de superficies, organización',
      beforePhoto: null,
      afterPhoto: null,
    },
    {
      id: 'kitchen',
      name: 'Cocina',
      icon: 'stove',
      description: 'Electrodomésticos, mesones, fregadero, pisos',
      beforePhoto: null,
      afterPhoto: null,
    },
    {
      id: 'bathroom',
      name: 'Baño',
      icon: 'shower',
      description: 'Sanitarios, azulejos, espejo, pisos',
      beforePhoto: null,
      afterPhoto: null,
    },
    {
      id: 'bedroom',
      name: 'Habitación principal',
      icon: 'bed',
      description: 'Tendido de cama, organización, aspirado',
      beforePhoto: null,
      afterPhoto: null,
    },
    {
      id: 'dining-room',
      name: 'Comedor',
      icon: 'table-chair',
      description: 'Mesa, sillas, limpieza general',
      beforePhoto: null,
      afterPhoto: null,
    },
  ];

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const storedPhotos = await AsyncStorage.getItem(`photos_${serviceId}`);
      if (storedPhotos) {
        const photosData = JSON.parse(storedPhotos);
        const updatedRooms = defaultRooms.map(room => ({
          ...room,
          beforePhoto: photosData[room.id]?.beforePhoto || null,
          afterPhoto: photosData[room.id]?.afterPhoto || null,
        }));
        setRooms(updatedRooms);
        
        // Calcular habitaciones completadas
        const completed = new Set();
        updatedRooms.forEach(room => {
          if (room.beforePhoto && room.afterPhoto) {
            completed.add(room.id);
          }
        });
        setCompletedRooms(completed);
      } else {
        setRooms(defaultRooms);
      }
    } catch (error) {
      console.error('Error cargando fotos:', error);
      setRooms(defaultRooms);
    }
  };

  const savePhotos = async (updatedRooms) => {
    try {
      const photosData = {};
      updatedRooms.forEach(room => {
        if (room.beforePhoto || room.afterPhoto) {
          photosData[room.id] = {
            beforePhoto: room.beforePhoto,
            afterPhoto: room.afterPhoto,
          };
        }
      });
      await AsyncStorage.setItem(`photos_${serviceId}`, JSON.stringify(photosData));
    } catch (error) {
      console.error('Error guardando fotos:', error);
    }
  };

  const takePhoto = async (roomId, photoType) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu cámara para tomar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const updatedRooms = rooms.map(room => {
        if (room.id === roomId) {
          const updatedRoom = { ...room };
          if (photoType === 'before') {
            updatedRoom.beforePhoto = result.assets[0].uri;
          } else {
            updatedRoom.afterPhoto = result.assets[0].uri;
          }
          return updatedRoom;
        }
        return room;
      });

      setRooms(updatedRooms);
      await savePhotos(updatedRooms);

      // Actualizar habitaciones completadas
      const completed = new Set(completedRooms);
      const room = updatedRooms.find(r => r.id === roomId);
      if (room.beforePhoto && room.afterPhoto) {
        completed.add(roomId);
        if (completed.size === 1) {
          Alert.alert(
            '¡Primera habitación completada!',
            'Excelente trabajo. Continúa con las demás habitaciones.',
            [{ text: 'Continuar', style: 'default' }]
          );
        }
      }
      setCompletedRooms(completed);
    }
  };

  const showPhotoOptions = (roomId, hasPhotos) => {
    const options = [];
    
    if (!hasPhotos.before) {
      options.push({
        text: 'Foto ANTES',
        onPress: () => takePhoto(roomId, 'before'),
      });
    }
    
    if (hasPhotos.before && !hasPhotos.after) {
      options.push({
        text: 'Foto DESPUÉS',
        onPress: () => takePhoto(roomId, 'after'),
      });
    }
    
    if (hasPhotos.before && hasPhotos.after) {
      options.push({
        text: 'Ver comparación',
        onPress: () => showRoomComparison(roomId),
      });
      options.push({
        text: 'Retomar foto DESPUÉS',
        onPress: () => takePhoto(roomId, 'after'),
      });
    }

    options.push({ text: 'Cancelar', style: 'cancel' });

    Alert.alert('Gestionar fotos', `¿Qué deseas hacer en ${rooms.find(r => r.id === roomId)?.name}?`, options);
  };

  const showRoomComparison = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    setSelectedRoom(room);
    setShowComparison(true);
  };

  const generateReport = () => {
    const totalRooms = rooms.length;
    const completedCount = completedRooms.size;
    const percentage = Math.round((completedCount / totalRooms) * 100);

    if (completedCount < totalRooms) {
      Alert.alert(
        '⚠️ Fotos incompletas',
        `No puedes finalizar el servicio sin completar todas las fotos.\n\nProgreso: ${completedCount}/${totalRooms} habitaciones (${percentage}%)\n\nFaltan ${totalRooms - completedCount} habitaciones por completar.\n\n📸 Debes tomar foto ANTES y DESPUÉS de cada habitación.`,
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      '✅ Servicio completado',
      '¡Excelente trabajo! Todas las habitaciones tienen evidencia fotográfica.\n\n¿Deseas enviar el reporte al cliente y finalizar el servicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar y finalizar', 
          style: 'default',
          onPress: () => {
            // Guardar evidencia en el perfil del proveedor
            saveToProviderProfile();
            Alert.alert(
              '🎉 ¡Servicio finalizado!',
              'El reporte con las fotos ha sido enviado al cliente.\n\nLas fotos se han guardado en tu perfil para referencia futura.',
              [
                {
                  text: 'Ver perfil',
                  onPress: () => navigation.navigate('UserProfile')
                },
                {
                  text: 'Volver al inicio',
                  onPress: () => navigation.navigate('ProviderHome')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const saveToProviderProfile = async () => {
    try {
      // Obtener el historial de servicios del proveedor
      const profileKey = `provider_services_${user?.id || 'demo'}`;
      const existingServices = await AsyncStorage.getItem(profileKey);
      const services = existingServices ? JSON.parse(existingServices) : [];

      // Agregar este servicio con sus fotos
      const serviceRecord = {
        serviceId,
        date: new Date().toISOString(),
        customer: booking?.customerName || 'Cliente demo',
        serviceType: booking?.serviceType || 'Limpieza general',
        rooms: rooms.map(room => ({
          id: room.id,
          name: room.name,
          beforePhoto: room.beforePhoto,
          afterPhoto: room.afterPhoto,
        })),
        completedAt: new Date().toISOString(),
      };

      services.unshift(serviceRecord); // Agregar al inicio del array
      
      // Limitar a los últimos 50 servicios para no ocupar demasiado espacio
      const limitedServices = services.slice(0, 50);
      
      await AsyncStorage.setItem(profileKey, JSON.stringify(limitedServices));
      console.log('✅ Servicio guardado en perfil del proveedor');
    } catch (error) {
      console.error('Error guardando en perfil:', error);
    }
  };

  const getProgressColor = () => {
    const percentage = (completedRooms.size / rooms.length) * 100;
    if (percentage === 100) return colors.success;
    if (percentage >= 50) return colors.warning;
    return colors.primary;
  };

  const renderRoom = ({ item }) => {
    const hasBeforePhoto = !!item.beforePhoto;
    const hasAfterPhoto = !!item.afterPhoto;
    const isCompleted = hasBeforePhoto && hasAfterPhoto;
    const needsAfterPhoto = hasBeforePhoto && !hasAfterPhoto;

    return (
      <TouchableOpacity
        style={[
          styles.roomCard,
          isCompleted && styles.roomCardCompleted,
          needsAfterPhoto && styles.roomCardInProgress,
        ]}
        onPress={() => showPhotoOptions(item.id, { before: hasBeforePhoto, after: hasAfterPhoto })}
        activeOpacity={0.8}
      >
        <View style={styles.roomHeader}>
          <View style={styles.roomIcon}>
            <MaterialCommunityIcons 
              name={item.icon} 
              size={24} 
              color={isCompleted ? colors.success : colors.primary} 
            />
          </View>
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{item.name}</Text>
            <Text style={styles.roomDescription}>{item.description}</Text>
          </View>
          <View style={styles.roomStatus}>
            {isCompleted ? (
              <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
            ) : needsAfterPhoto ? (
              <MaterialCommunityIcons name="clock-alert" size={24} color={colors.warning} />
            ) : (
              <MaterialCommunityIcons name="camera" size={24} color={colors.textMuted} />
            )}
          </View>
        </View>

        {(hasBeforePhoto || hasAfterPhoto) && (
          <View style={styles.photoPreview}>
            {hasBeforePhoto && (
              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>Antes</Text>
                <Image source={{ uri: item.beforePhoto }} style={styles.previewImage} />
              </View>
            )}
            {hasAfterPhoto && (
              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>Después</Text>
                <Image source={{ uri: item.afterPhoto }} style={styles.previewImage} />
              </View>
            )}
          </View>
        )}

        <View style={styles.roomActions}>
          {!hasBeforePhoto && (
            <Text style={styles.actionHint}>Toca para tomar foto inicial</Text>
          )}
          {hasBeforePhoto && !hasAfterPhoto && (
            <Text style={styles.actionHint}>Toca para tomar foto final</Text>
          )}
          {isCompleted && (
            <Text style={styles.actionHint}>Toca para ver comparación</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const ComparisonModal = () => (
    <Modal
      visible={showComparison}
      animationType="slide"
      onRequestClose={() => setShowComparison(false)}
    >
      <GradientBackground>
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowComparison(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color={colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.comparisonTitle}>
              {selectedRoom?.name} - Comparación
            </Text>
            <View style={styles.placeholder} />
          </View>

          {selectedRoom && (
            <View style={styles.comparisonContent}>
              <View style={styles.comparisonImages}>
                <View style={styles.comparisonImageContainer}>
                  <Text style={styles.comparisonLabel}>ANTES</Text>
                  <Image 
                    source={{ uri: selectedRoom.beforePhoto }} 
                    style={styles.comparisonImage} 
                  />
                </View>
                <View style={styles.comparisonImageContainer}>
                  <Text style={styles.comparisonLabel}>DESPUÉS</Text>
                  <Image 
                    source={{ uri: selectedRoom.afterPhoto }} 
                    style={styles.comparisonImage} 
                  />
                </View>
              </View>

              <View style={styles.comparisonActions}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => {
                    setShowComparison(false);
                    setTimeout(() => takePhoto(selectedRoom.id, 'after'), 300);
                  }}
                >
                  <MaterialCommunityIcons name="camera-retake" size={20} color={colors.textLight} />
                  <Text style={styles.retakeText}>Retomar foto</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </GradientBackground>
    </Modal>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textLight} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Evidencia fotográfica</Text>
            <Text style={styles.headerSubtitle}>
              {completedRooms.size}/{rooms.length} habitaciones completadas
            </Text>
          </View>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={generateReport}
          >
            <MaterialCommunityIcons name="file-chart" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(completedRooms.size / rooms.length) * 100}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((completedRooms.size / rooms.length) * 100)}% completado
          </Text>
        </View>

        {/* Lista de habitaciones */}
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.roomsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Botón flotante para finalizar */}
        {completedRooms.size === rooms.length && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={generateReport}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="check-circle" size={24} color="white" />
            <Text style={styles.floatingButtonText}>Finalizar servicio</Text>
          </TouchableOpacity>
        )}

        <ComparisonModal />
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
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  reportButton: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  roomsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  roomCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  roomCardCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.backgroundLight,
  },
  roomCardInProgress: {
    borderColor: colors.warning,
    backgroundColor: colors.backgroundLight,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  roomDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  roomStatus: {
    marginLeft: 12,
  },
  photoPreview: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  photoContainer: {
    flex: 1,
  },
  photoLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },
  roomActions: {
    alignItems: 'center',
  },
  actionHint: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  comparisonContainer: {
    flex: 1,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    marginRight: 15,
  },
  comparisonTitle: {
    flex: 1,
    color: colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholder: {
    width: 24,
    marginLeft: 15,
  },
  comparisonContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  comparisonImages: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  comparisonImageContainer: {
    flex: 1,
  },
  comparisonLabel: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  comparisonImage: {
    width: '100%',
    height: screenWidth * 0.6,
    borderRadius: 12,
  },
  comparisonActions: {
    alignItems: 'center',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  retakeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PhotoEvidenceScreen;