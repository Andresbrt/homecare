import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import appTheme from '../../theme/theme'; // Theme Homecare integrado

const HomeHeader = ({ user }) => {
  const motivationalMessage = `Hola ${user?.firstName || 'Andrés'}, tu hogar listo para brillar ✨`;

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: user?.profilePictureUrl || 'https://i.pravatar.cc/150' }}
          style={styles.avatar}
        />
        <Text style={styles.greeting}>{motivationalMessage}</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.iconButton}>
            <Feather name="bell" size={24} color={appTheme.COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: appTheme.COLORS.background,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.medium,
    color: appTheme.COLORS.text,
  },
  rightContainer: {
    // Contenedor para futuros iconos
  },
  iconButton: {
    padding: 8,
  }
});

export default HomeHeader;
