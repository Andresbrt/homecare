import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import appTheme from '../../theme/theme';

const PrimaryActionCard = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Feather name="calendar" size={32} color={appTheme.COLORS.white} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Agendar Servicio</Text>
        <Text style={styles.subtitle}>Programa tu limpieza ahora</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Feather name="chevron-right" size={24} color={appTheme.COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: appTheme.COLORS.primary,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    ...appTheme.SHADOWS.medium,
    shadowColor: appTheme.COLORS.primary,
  },
  iconContainer: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.large,
    color: appTheme.COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.white,
    opacity: 0.9,
  },
  arrowContainer: {
    marginLeft: 'auto',
  },
});

export default PrimaryActionCard;
