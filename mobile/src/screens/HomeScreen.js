import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import appTheme from '../theme/theme';
import HomeHeader from '../components/redesign/HomeHeader';
import PrimaryActionCard from '../components/redesign/PrimaryActionCard';
import QuickActionButton from '../components/redesign/QuickActionButton';
import CategoryCard from '../components/redesign/CategoryCard';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const quickActions = [
    {
      id: 'emergency',
      icon: 'alert-triangle',
      title: 'Emergencia',
      subtitle: 'Ayuda inmediata 24/7',
      color: appTheme.COLORS.emergency,
      textColor: appTheme.COLORS.emergencyText,
      onPress: () => navigation.navigate('EmergencyService'),
    },
    {
      id: 'tracking',
      icon: 'map-pin',
      title: 'Seguimiento',
      subtitle: 'Ubicación en tiempo real',
      onPress: () => navigation.navigate('TrackingScreen'),
    },
    {
      id: 'last_service',
      icon: 'check-square',
      title: 'Último Servicio',
      subtitle: 'Resumen del último servicio',
      onPress: () => navigation.navigate('ServiceHistory'),
    },
  ];

  const featuredCategories = [
    { id: 'deep_cleaning', name: 'Limpieza Profunda', iconUrl: 'https://i.imgur.com/6ZkZ2Qy.png' },
    { id: 'express_60', name: 'Express 60 min', iconUrl: 'https://i.imgur.com/sM4l5yL.png' },
    { id: 'offices', name: 'Oficinas', iconUrl: 'https://i.imgur.com/bF9cT8d.png' },
  ];

  return (
    <View style={styles.container}>
      <HomeHeader user={user} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <PrimaryActionCard onPress={() => navigation.navigate('ScheduleService')} />

        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <QuickActionButton
              key={action.id}
              icon={action.icon}
              title={action.title}
              subtitle={action.subtitle}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías Destacadas</Text>
          <FlatList
            data={featuredCategories}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Aquí irían las secciones de "Recomendados para ti" y el test rápido */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.large,
    color: appTheme.COLORS.text,
    marginBottom: 16,
  },
  categoryList: {
    paddingLeft: 4,
  },
});

export default HomeScreen;
