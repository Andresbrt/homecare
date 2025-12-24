import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import { commonStyles } from '../theme/commonStyles';
import { colors } from '../theme/colors';
import appTheme from '../theme/theme'; // Importar el tema unificado
import * as Location from 'expo-location';

const ScheduleServiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { service: preselectedService } = route.params || {};

  const [form, setForm] = useState({
    serviceName: '',
    date: '',
    time: '',
    address: '',
    notes: '',
    frequency: 'Única vez',
  });
  const [sending, setSending] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setForm(prev => ({
        ...prev,
        serviceName: preselectedService.title,
      }));
    }
  }, [preselectedService]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateObj) => {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const generateDateOptions = (days = 30) => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i);
      return {
        key: d.toISOString(),
        label: formatDate(d),
        dateObj: d,
      };
    });
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 6; h <= 22; h++) {
      for (let m of [0, 30]) {
        if (h === 22 && m > 0) continue; // hasta 22:00
        const hour12 = ((h + 11) % 12) + 1;
        const suffix = h < 12 ? 'AM' : 'PM';
        const label = `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
        options.push({ key: `${h}-${m}`, label });
      }
    }
    return options;
  };

  const handleSubmit = async () => {
    if (sending) {
      return;
    }

    if (!form.serviceName.trim() || !form.date.trim() || !form.time.trim() || !form.address.trim()) {
      Alert.alert('Campos obligatorios', 'Completa servicio, fecha, hora y dirección para continuar.');
      return;
    }

    try {
      setSending(true);
      // Simulación de una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const bookingPayload = {
        service: preselectedService || {
          title: form.serviceName,
          // ... otros detalles del servicio si es necesario
        },
        date: form.date,
        time: form.time,
        address: form.address,
        frequency: form.frequency,
        notes: form.notes,
        // El precio se calcularía en el siguiente paso
      };

      navigation.navigate('PaymentConfirmation', { booking: bookingPayload });
    } catch (error) {
      Alert.alert('Error al agendar', error.message || 'No pudimos procesar tu solicitud. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (locating) return;
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Habilita la ubicación para usar tu dirección actual.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude.toFixed(5);
      const lng = loc.coords.longitude.toFixed(5);
      updateField('address', `Ubicación actual: ${lat}, ${lng}`);
    } catch (e) {
      Alert.alert('No se pudo obtener la ubicación', 'Intenta de nuevo o ingresa la dirección manual.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={appTheme.COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Agenda tu limpieza</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            Define los detalles del servicio para conectar con el profesional ideal.
          </Text>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Servicio *</Text>
              <TextInput
                value={form.serviceName}
                onChangeText={(text) => updateField('serviceName', text)}
                placeholder="Ej: Limpieza profunda de apartamento"
                placeholderTextColor={appTheme.COLORS.darkGray}
                style={styles.input}
                editable={!preselectedService} // No editable si viene preseleccionado
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.rowItem]}>
                <Text style={styles.label}>Fecha *</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}
                  style={styles.inputTouchable}
                >
                  <Text style={form.date ? styles.inputValue : styles.inputPlaceholder}>
                    {form.date || 'DD/MM/AAAA'}
                  </Text>
                  <MaterialCommunityIcons name="calendar" size={18} color={appTheme.COLORS.darkGray} />
                </TouchableOpacity>
              </View>
              <View style={[styles.fieldGroup, styles.rowItem]}>
                <Text style={styles.label}>Hora *</Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.8}
                  style={styles.inputTouchable}
                >
                  <Text style={form.time ? styles.inputValue : styles.inputPlaceholder}>
                    {form.time || 'HH:MM AM/PM'}
                  </Text>
                  <MaterialCommunityIcons name="clock-outline" size={18} color={appTheme.COLORS.darkGray} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Dirección *</Text>
              <TextInput
                value={form.address}
                onChangeText={(text) => updateField('address', text)}
                placeholder="Tu dirección completa"
                placeholderTextColor={appTheme.COLORS.darkGray}
                style={styles.input}
              />
              <View style={styles.addressActions}>
                <TouchableOpacity
                  style={[styles.addressBtn, styles.addressBtnPrimary]}
                  onPress={handleUseCurrentLocation}
                  activeOpacity={0.85}
                  disabled={locating}
                >
                  {locating ? (
                    <ActivityIndicator size="small" color={appTheme.COLORS.white} />
                  ) : (
                    <MaterialCommunityIcons name="crosshairs-gps" size={16} color={appTheme.COLORS.white} />
                  )}
                  <Text style={styles.addressBtnText}>Usar mi ubicación</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addressBtn, styles.addressBtnGhost]}
                  onPress={() => updateField('address', '')}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons name="pencil" size={16} color={appTheme.COLORS.primary} />
                  <Text style={styles.addressBtnGhostText}>Ingresar manual</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Frecuencia</Text>
              {/* Aquí se podría implementar un selector personalizado */}
              <TextInput
                value={form.frequency}
                onChangeText={(text) => updateField('frequency', text)}
                placeholder="Única vez"
                placeholderTextColor={appTheme.COLORS.darkGray}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Notas adicionales (Opcional)</Text>
              <TextInput
                value={form.notes}
                onChangeText={(text) => updateField('notes', text)}
                placeholder="Ej: Tengo dos mascotas, favor usar productos no tóxicos."
                placeholderTextColor={appTheme.COLORS.darkGray}
                multiline
                style={[styles.input, styles.multiline]}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, sending && styles.submitButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={sending}
          >
            <Text style={styles.submitText}>{sending ? 'Agendando...' : 'Continuar al Pago'}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={appTheme.COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona una fecha</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <MaterialCommunityIcons name="close" size={22} color={appTheme.COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={generateDateOptions()}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    updateField('date', item.label);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
            />
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona una hora (6:00 AM - 10:00 PM)</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <MaterialCommunityIcons name="close" size={22} color={appTheme.COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={generateTimeOptions()}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    updateField('time', item.label);
                    setShowTimePicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
            />
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: appTheme.COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 5,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Espacio para el botón flotante
  },
  title: {
    color: appTheme.COLORS.text,
    fontSize: appTheme.SIZES.h2,
    fontFamily: appTheme.FONTS.bold,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: appTheme.COLORS.darkGray,
    fontSize: appTheme.SIZES.font,
    fontFamily: appTheme.FONTS.regular,
    lineHeight: 22,
  },
  card: {
    borderRadius: 20,
    backgroundColor: appTheme.COLORS.white,
    padding: 20,
    ...appTheme.SHADOWS.medium,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  rowItem: {
    flex: 1,
    marginHorizontal: 6,
  },
  label: {
    color: appTheme.COLORS.text,
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
    marginBottom: 8,
  },
  input: {
    backgroundColor: appTheme.COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.text,
    borderWidth: 1,
    borderColor: appTheme.COLORS.gray,
  },
  inputTouchable: {
    backgroundColor: appTheme.COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: appTheme.COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputPlaceholder: {
    color: appTheme.COLORS.darkGray,
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
  },
  inputValue: {
    color: appTheme.COLORS.text,
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: appTheme.COLORS.white,
    borderTopWidth: 1,
    borderTopColor: appTheme.COLORS.gray,
  },
  submitButton: {
    backgroundColor: appTheme.COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: appTheme.COLORS.gray,
  },
  submitText: {
    color: appTheme.COLORS.white,
    fontFamily: appTheme.FONTS.bold,
    fontSize: appTheme.SIZES.medium,
    marginRight: 10,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  addressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addressBtnPrimary: {
    backgroundColor: appTheme.COLORS.primary,
  },
  addressBtnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: appTheme.COLORS.primary,
  },
  addressBtnText: {
    color: appTheme.COLORS.white,
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
  },
  addressBtnGhostText: {
    color: appTheme.COLORS.primary,
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '70%',
    backgroundColor: appTheme.COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: appTheme.COLORS.gray,
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: appTheme.FONTS.bold,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.text,
    flex: 1,
    marginRight: 12,
  },
  modalItem: {
    paddingVertical: 14,
  },
  modalItemText: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.text,
  },
  modalDivider: {
    height: 1,
    backgroundColor: appTheme.COLORS.gray,
    opacity: 0.3,
  },
});

export default ScheduleServiceScreen;
