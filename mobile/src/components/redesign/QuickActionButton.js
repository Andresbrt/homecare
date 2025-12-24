import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import appTheme from '../../theme/theme'; // Theme Homecare integrado

const QuickActionButton = ({ icon, title, subtitle, color, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color || appTheme.COLORS.gray }]}
      onPress={onPress}
    >
      <Feather name={icon} size={24} color={color ? appTheme.COLORS.white : appTheme.COLORS.text} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: color ? appTheme.COLORS.white : appTheme.COLORS.text }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: color ? appTheme.COLORS.white : appTheme.COLORS.darkGray }]}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    marginHorizontal: 8,
    ...appTheme.SHADOWS.light,
  },
  textContainer: {
    marginTop: 12,
  },
  title: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
  },
  subtitle: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.small,
    marginTop: 2,
  },
});

export default QuickActionButton;
