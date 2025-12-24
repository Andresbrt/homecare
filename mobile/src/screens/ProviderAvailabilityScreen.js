import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const ProviderAvailabilityScreen = ({ navigation }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [maxServicesPerDay, setMaxServicesPerDay] = useState('5');
  const [coverageRadius, setCoverageRadius] = useState('10');
  
  const [weekSchedule, setWeekSchedule] = useState([
    { day: 'Lunes', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Martes', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Miércoles', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Jueves', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Viernes', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Sábado', enabled: true, startTime: '09:00', endTime: '14:00' },
    { day: 'Domingo', enabled: false, startTime: '09:00', endTime: '14:00' },
  ]);

  const [blockedDates, setBlockedDates] = useState([
    { date: '2025-12-24', reason: 'Navidad' },
    { date: '2025-12-25', reason: 'Navidad' },
    { date: '2025-12-31', reason: 'Año Nuevo' },
  ]);

  const toggleDayEnabled = (index) => {
    const updated = [...weekSchedule];
    updated[index].enabled = !updated[index].enabled;
    setWeekSchedule(updated);
  };

  const updateTime = (index, field, value) => {
    const updated = [...weekSchedule];
    updated[index][field] = value;
    setWeekSchedule(updated);
  };

  const handleSave = () => {
    Alert.alert(
      'Disponibilidad actualizada',
      'Tus horarios y configuración han sido guardados correctamente.',
      [{ text: 'OK' }]
    );
  };

  const addBlockedDate = () => {
    Alert.prompt(
      'Bloquear fecha',
      'Ingresa la fecha (YYYY-MM-DD) y motivo',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agregar',
          onPress: (text) => {
            const [date, ...reasonParts] = text.split(' ');
            const reason = reasonParts.join(' ') || 'No disponible';
            setBlockedDates([...blockedDates, { date, reason }]);
          },
        },
      ],
      'plain-text',
      '2025-12-01 Vacaciones'
    );
  };

  const removeBlockedDate = (index) => {
    Alert.alert(
      'Eliminar fecha bloqueada',
      '¿Estás seguro de que quieres desbloquear esta fecha?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updated = blockedDates.filter((_, i) => i !== index);
            setBlockedDates(updated);
          },
        },
      ]
    );
  };

  return (
    <GradientBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disponibilidad</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <MaterialCommunityIcons name="check" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Estado General */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="toggle-switch" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Estado General</Text>
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>
                {isAvailable ? 'Disponible para servicios' : 'No disponible'}
              </Text>
              <Text style={styles.switchSubtext}>
                {isAvailable
                  ? 'Recibirás solicitudes según tu horario'
                  : 'No recibirás solicitudes nuevas'}
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: '#D1D5DB', true: colors.primary + '40' }}
              thumbColor={isAvailable ? colors.primary : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Configuración General */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="cog" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Configuración</Text>
          </View>

          <View style={styles.configRow}>
            <View style={styles.configInfo}>
              <Text style={styles.configLabel}>Servicios máximos por día</Text>
              <Text style={styles.configSubtext}>Límite de servicios diarios</Text>
            </View>
            <TextInput
              style={styles.configInput}
              value={maxServicesPerDay}
              onChangeText={setMaxServicesPerDay}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.configRow}>
            <View style={styles.configInfo}>
              <Text style={styles.configLabel}>Radio de cobertura (km)</Text>
              <Text style={styles.configSubtext}>Distancia máxima para aceptar servicios</Text>
            </View>
            <TextInput
              style={styles.configInput}
              value={coverageRadius}
              onChangeText={setCoverageRadius}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
        </View>

        {/* Horarios Semanales */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Horarios Semanales</Text>
          </View>

          {weekSchedule.map((schedule, index) => (
            <View key={schedule.day}>
              <View style={styles.scheduleRow}>
                <View style={styles.scheduleLeft}>
                  <Switch
                    value={schedule.enabled}
                    onValueChange={() => toggleDayEnabled(index)}
                    trackColor={{ false: '#D1D5DB', true: colors.primary + '40' }}
                    thumbColor={schedule.enabled ? colors.primary : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.scheduleDay,
                      !schedule.enabled && styles.scheduleDayDisabled,
                    ]}
                  >
                    {schedule.day}
                  </Text>
                </View>

                {schedule.enabled && (
                  <View style={styles.scheduleRight}>
                    <View style={styles.timeInputContainer}>
                      <MaterialCommunityIcons
                        name="clock-start"
                        size={16}
                        color={colors.text.secondary}
                      />
                      <TextInput
                        style={styles.timeInput}
                        value={schedule.startTime}
                        onChangeText={(value) => updateTime(index, 'startTime', value)}
                        placeholder="08:00"
                        maxLength={5}
                      />
                    </View>
                    <Text style={styles.timeSeparator}>-</Text>
                    <View style={styles.timeInputContainer}>
                      <MaterialCommunityIcons
                        name="clock-end"
                        size={16}
                        color={colors.text.secondary}
                      />
                      <TextInput
                        style={styles.timeInput}
                        value={schedule.endTime}
                        onChangeText={(value) => updateTime(index, 'endTime', value)}
                        placeholder="18:00"
                        maxLength={5}
                      />
                    </View>
                  </View>
                )}
              </View>
              {index < weekSchedule.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Fechas Bloqueadas */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="calendar-remove" size={24} color={colors.error} />
            <Text style={styles.cardTitle}>Fechas Bloqueadas</Text>
            <TouchableOpacity onPress={addBlockedDate} style={styles.addButton}>
              <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {blockedDates.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={48}
                color={colors.text.tertiary}
              />
              <Text style={styles.emptyText}>No hay fechas bloqueadas</Text>
              <Text style={styles.emptySubtext}>
                Toca el + para agregar días no disponibles
              </Text>
            </View>
          ) : (
            blockedDates.map((blocked, index) => (
              <View key={index} style={styles.blockedDateRow}>
                <View style={styles.blockedDateInfo}>
                  <Text style={styles.blockedDate}>{blocked.date}</Text>
                  <Text style={styles.blockedReason}>{blocked.reason}</Text>
                </View>
                <TouchableOpacity onPress={() => removeBlockedDate(index)}>
                  <MaterialCommunityIcons name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  switchSubtext: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  configInfo: {
    flex: 1,
  },
  configLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  configSubtext: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  configInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleDay: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 12,
    minWidth: 80,
  },
  scheduleDayDisabled: {
    color: colors.text.tertiary,
  },
  scheduleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  timeInput: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 6,
    width: 50,
  },
  timeSeparator: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginHorizontal: 8,
  },
  blockedDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  blockedDateInfo: {
    flex: 1,
  },
  blockedDate: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  blockedReason: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProviderAvailabilityScreen;
