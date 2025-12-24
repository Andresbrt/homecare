import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';

const ProviderCalendarScreen = () => {
  const slots = useMemo(
    () => [
      {
        id: 'slot-1',
        day: 'Hoy',
        date: '25 Oct',
        timeRange: '15:00 - 19:00',
        client: 'Laura Méndez',
        type: 'Limpieza profunda',
        address: 'Av. Central 245',
      },
      {
        id: 'slot-2',
        day: 'Mañana',
        date: '26 Oct',
        timeRange: '09:00 - 10:00',
        client: 'Luis Romero',
        type: 'Express 60min',
        address: 'Calle 12 #166',
      },
      {
        id: 'slot-3',
        day: 'Lun',
        date: '28 Oct',
        timeRange: '08:00 - 13:00',
        client: 'Cowork Lab',
        type: 'Oficinas',
        address: 'Paseo Tec 223',
      },
    ],
    [],
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="clock-outline" size={18} color={colors.textMuted} />
        <Text style={styles.infoText}>{item.timeRange}</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="account" size={18} color={colors.textMuted} />
        <Text style={styles.infoText}>{item.client}</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="spray" size={18} color={colors.textMuted} />
        <Text style={styles.infoText}>{item.type}</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="map-marker" size={18} color={colors.textMuted} />
        <Text style={styles.infoText}>{item.address}</Text>
      </View>
    </View>
  );

  return (
    <GradientBackground>
      <FlatList
        data={slots}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Tu agenda</Text>
            <Text style={styles.subtitle}>Revisa tus servicios confirmados de los próximos días.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: colors.textLight,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    backgroundColor: 'rgba(13,12,38,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
  },
  separator: {
    height: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoText: {
    marginLeft: 10,
    color: colors.textMuted,
    fontSize: 14,
  },
});

export default ProviderCalendarScreen;
