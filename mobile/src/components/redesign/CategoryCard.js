import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import appTheme from '../../theme/theme'; // Theme Homecare integrado

const CategoryCard = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: category.iconUrl }} style={styles.image} />
      <Text style={styles.title}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: appTheme.COLORS.white,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 120,
    height: 120,
    ...appTheme.SHADOWS.light,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 12,
  },
  title: {
    fontFamily: appTheme.FONTS.medium,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.text,
    textAlign: 'center',
  },
});

export default CategoryCard;
