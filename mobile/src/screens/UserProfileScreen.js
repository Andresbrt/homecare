import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import appTheme from '../theme/theme';
import { API_BASE_URL } from '../config/api';

const UserProfileScreen = ({ navigation }) => {
  const { user, signOut, changeRole } = useContext(AuthContext);
  const [roleChanging, setRoleChanging] = useState(false);

  const handleRoleToggle = async () => {
    if (!user) return;
    setRoleChanging(true);
    
    try {
      const nextRole = user.role === 'CUSTOMER' ? 'SERVICE_PROVIDER' : 'CUSTOMER';
      
      // Llamar a la API para cambiar el rol
      const response = await fetch(`${API_BASE_URL}/auth/update-role/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: nextRole }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el rol');
      }

      const updatedUser = await response.json();
      
      // Actualizar el contexto local
      await changeRole(nextRole);
      
      Alert.alert('Rol actualizado', `Ahora tu rol es: ${nextRole === 'SERVICE_PROVIDER' ? 'Proveedor de Servicios' : 'Cliente'}`);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      Alert.alert('Error', 'No se pudo cambiar el rol. Intenta de nuevo.');
    } finally {
      setRoleChanging(false);
    }
  };

  const baseOptions = [
    { id: 'referrals', icon: 'gift', title: 'Invita y Gana', screen: 'Referral', roles: ['CUSTOMER','SERVICE_PROVIDER'] },
    { id: 'support', icon: 'help-circle', title: 'Soporte y Ayuda', screen: 'Support', roles: ['CUSTOMER','SERVICE_PROVIDER'] },
    { id: 'settings', icon: 'settings', title: 'Configuración', screen: 'Settings', roles: ['CUSTOMER','SERVICE_PROVIDER'] },
  ];

  const roleExtras = [
    { id: 'history', icon: 'clock', title: 'Historial de Servicios', screen: 'ServiceHistory', roles: ['CUSTOMER'] },
    { id: 'favorites', icon: 'heart', title: 'Proveedores Favoritos', screen: 'Favorites', roles: ['CUSTOMER'] },
    { id: 'provider-financial', icon: 'trending-up', title: 'Finanzas', screen: 'ProviderFinancial', roles: ['SERVICE_PROVIDER'] },
    { id: 'provider-calendar', icon: 'calendar', title: 'Calendario', screen: 'ProviderCalendar', roles: ['SERVICE_PROVIDER'] },
  ];

  const menuOptions = [...baseOptions, ...roleExtras].filter(opt => !user?.role || opt.roles.includes(user.role));

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', onPress: signOut, style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: user?.profilePictureUrl || 'https://i.pravatar.cc/150' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {user?.firstName || 'Andrés'} {user?.lastName || 'Rico'}
          </Text>
          <Text style={styles.email}>{user?.email || 'andres@example.com'}</Text>
        </View>

        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Rol actual:</Text>
          <TouchableOpacity
            style={styles.rolePill}
            onPress={handleRoleToggle}
            disabled={roleChanging}
            activeOpacity={0.8}
          >
            <Text style={styles.rolePillText}>
              {roleChanging ? 'Cambiando...' : (user?.role || 'CUSTOMER')}
            </Text>
            <Feather name="repeat" size={18} color={appTheme.COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {menuOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => (item.screen ? navigation.navigate(item.screen) : null)}
            >
              <View style={styles.menuIcon}>
                <Feather name={item.icon} size={22} color={appTheme.COLORS.primary} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Feather name="chevron-right" size={22} color={appTheme.COLORS.darkGray} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={appTheme.COLORS.emergencyText} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.COLORS.background,
  },
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: appTheme.COLORS.primary,
  },
  name: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.xlarge,
    color: appTheme.COLORS.text,
  },
  email: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.darkGray,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: appTheme.COLORS.white,
    borderRadius: 16,
    ...appTheme.SHADOWS.light,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: appTheme.COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    ...appTheme.SHADOWS.light,
  },
  roleLabel: {
    fontFamily: appTheme.FONTS.medium,
    fontSize: appTheme.SIZES.medium,
    color: appTheme.COLORS.text,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: appTheme.COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rolePillText: {
    color: appTheme.COLORS.white,
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
    marginRight: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: appTheme.COLORS.gray,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appTheme.COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontFamily: appTheme.FONTS.medium,
    fontSize: appTheme.SIZES.medium,
    color: appTheme.COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 16,
    borderRadius: 16,
    backgroundColor: appTheme.COLORS.emergency,
  },
  logoutText: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.medium,
    color: appTheme.COLORS.emergencyText,
    marginLeft: 8,
  },
});

export default UserProfileScreen;
