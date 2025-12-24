import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import ServiceCatalogScreen from '../screens/ServiceCatalogScreen';
import WalletScreen from '../screens/WalletScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import appTheme from '../theme/theme';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import ScheduleServiceScreen from '../screens/ScheduleServiceScreen';
import PaymentConfirmationScreen from '../screens/PaymentConfirmationScreen';
import TrackingScreen from '../screens/TrackingScreen';
import ChatScreen from '../screens/ChatScreen';
import EmergencyServiceScreen from '../screens/EmergencyServiceScreen';
import WompiCheckoutScreen from '../screens/WompiCheckoutScreen';
import ServiceHistoryScreen from '../screens/ServiceHistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ReferralScreen from '../screens/ReferralScreen';
import SupportScreen from '../screens/SupportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdminAIConfigScreen from '../screens/AdminAIConfigScreen';
import HousekeeperDetailScreen from '../screens/HousekeeperDetailScreen';
import PhotoEvidenceScreen from '../screens/PhotoEvidenceScreen';
import RequestServiceScreen from '../screens/RequestServiceScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: appTheme.COLORS.background },
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ServiceCatalog" component={ServiceCatalogScreen} />
    <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    <Stack.Screen name="HousekeeperDetail" component={HousekeeperDetailScreen} />
    <Stack.Screen name="RequestService" component={RequestServiceScreen} />
    <Stack.Screen name="ScheduleService" component={ScheduleServiceScreen} />
    <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
    <Stack.Screen name="WompiCheckout" component={WompiCheckoutScreen} />
    <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
    <Stack.Screen name="EmergencyService" component={EmergencyServiceScreen} />
    <Stack.Screen name="PhotoEvidence" component={PhotoEvidenceScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Profile" component={UserProfileScreen} />
    <Stack.Screen name="ServiceHistory" component={ServiceHistoryScreen} />
    <Stack.Screen name="Favorites" component={FavoritesScreen} />
    <Stack.Screen name="Referral" component={ReferralScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="AdminAIConfig" component={AdminAIConfigScreen} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: appTheme.COLORS.white,
          borderTopWidth: 1,
          borderTopColor: appTheme.COLORS.gray,
          height: 60 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom, // Usar el inset directamente para el padding
        },
        tabBarActiveTintColor: appTheme.COLORS.primary,
        tabBarInactiveTintColor: appTheme.COLORS.darkGray,
        tabBarLabelStyle: {
          fontFamily: appTheme.FONTS.medium,
          fontSize: 12,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Servicios') {
            iconName = 'grid';
          } else if (route.name === 'Wallet') {
            iconName = 'credit-card';
          } else if (route.name === 'Perfil') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} />
      <Tab.Screen name="Servicios" component={ServiceCatalogScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabs;
