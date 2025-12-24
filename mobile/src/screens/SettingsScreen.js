import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { updateUserRole } from '../services/profileService';

const SettingsScreen = ({ route, navigation }) => {
  const { user, signIn, token } = useContext(AuthContext);
  const focus = route?.params?.focus ?? null;
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleRoleSwitch = async () => {
    if (switchingRole) return;
    setSwitchingRole(true);

    try {
      const newRole = user.role === 'CUSTOMER' ? 'SERVICE_PROVIDER' : 'CUSTOMER';
      const updatedUserData = await updateUserRole(token, newRole);
      
      signIn({ token, user: updatedUserData });
      Alert.alert(
        'Rol actualizado',
        `Ahora eres ${newRole === 'CUSTOMER' ? 'Cliente' : 'Proveedor de Servicios'}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Error cambiando rol:', error);
      Alert.alert('Error', error.message || 'No se pudo cambiar el rol');
    } finally {
      setSwitchingRole(false);
    }
  };

  const paymentMethods = [
    { id: 'pm-1', brand: 'Visa', last4: '5520', favorite: true },
    { id: 'pm-2', brand: 'Mastercard', last4: '8831', favorite: false },
  ];

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Configuración</Text>
        <Text style={styles.subtitle}>
          Controla tus notificaciones, seguridad y medios de pago en un solo lugar.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.itemRow}>
            <View style={styles.itemTextWrapper}>
              <Text style={styles.itemTitle}>Push en tiempo real</Text>
              <Text style={styles.itemSubtitle}>Confirmaciones, recordatorios y novedades.</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              thumbColor={notifications ? colors.primary : '#d9d9d9'}
              trackColor={{ true: 'rgba(76,110,245,0.4)', false: 'rgba(255,255,255,0.1)' }}
            />
          </View>
          <View style={styles.itemRow}>
            <View style={styles.itemTextWrapper}>
              <Text style={styles.itemTitle}>Alertas por SMS</Text>
              <Text style={styles.itemSubtitle}>Llega un mensaje 2 horas antes del servicio.</Text>
            </View>
            <Switch
              value={smsAlerts}
              onValueChange={setSmsAlerts}
              thumbColor={smsAlerts ? colors.primary : '#d9d9d9'}
              trackColor={{ true: 'rgba(76,110,245,0.4)', false: 'rgba(255,255,255,0.1)' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias de la app</Text>
          <View style={styles.itemRow}>
            <View style={styles.itemTextWrapper}>
              <Text style={styles.itemTitle}>Modo oscuro</Text>
              <Text style={styles.itemSubtitle}>Experiencia optimizada para jornadas nocturnas.</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? colors.primary : '#d9d9d9'}
              trackColor={{ true: 'rgba(76,110,245,0.4)', false: 'rgba(255,255,255,0.1)' }}
            />
          </View>
          <View style={styles.itemRow}>
            <View style={styles.itemTextWrapper}>
              <Text style={styles.itemTitle}>Ingreso con biometría</Text>
              <Text style={styles.itemSubtitle}>Usa Face ID o huella para iniciar sesión.</Text>
            </View>
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              thumbColor={biometric ? colors.primary : '#d9d9d9'}
              trackColor={{ true: 'rgba(76,110,245,0.4)', false: 'rgba(255,255,255,0.1)' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métodos de pago</Text>
          {paymentMethods.map((item) => (
            <View key={item.id} style={[styles.paymentCard, focus === 'payments' && styles.paymentCardHighlight]}>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>{item.brand.substring(0, 2)}</Text>
              </View>
              <View style={styles.paymentTextWrapper}>
                <Text style={styles.paymentBrand}>{item.brand}</Text>
                <Text style={styles.paymentDetail}>•••• {item.last4}</Text>
              </View>
              {item.favorite && (
                <View style={styles.paymentBadge}>
                  <MaterialCommunityIcons name="star" size={14} color={colors.textLight} />
                  <Text style={styles.paymentBadgeText}>Principal</Text>
                </View>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addMethodButton} activeOpacity={0.85}>
            <MaterialCommunityIcons name="plus-circle" size={20} color={colors.textLight} />
            <Text style={styles.addMethodText}>Añadir nuevo método</Text>
          </TouchableOpacity>
        </View>

        {/* Botón para cambiar rol */}
        <TouchableOpacity
          style={[styles.roleSwitchButton, switchingRole && styles.roleSwitchButtonDisabled]}
          onPress={handleRoleSwitch}
          activeOpacity={0.7}
          disabled={switchingRole}
        >
          <MaterialCommunityIcons 
            name="account-switch" 
            size={20} 
            color={switchingRole ? '#999' : colors.textLight} 
          />
          <Text style={[styles.roleSwitchText, switchingRole && styles.roleSwitchTextDisabled]}>
            {switchingRole ? 'Cambiando rol...' : '🔄 Cambiar a ' + (user?.role === 'CUSTOMER' ? 'Proveedor' : 'Cliente')}
          </Text>
        </TouchableOpacity>

        {user?.role === 'ADMIN' && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('AdminAIConfig')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="robot" size={18} color={colors.textLight} />
            <Text style={styles.adminButtonText}>Configurar AI (Admin)</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 140,
  },
  title: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemTextWrapper: {
    flex: 1,
  },
  itemTitle: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  paymentCardHighlight: {
    borderColor: colors.secondary,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentIconText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  paymentTextWrapper: {
    flex: 1,
  },
  paymentBrand: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '600',
  },
  paymentDetail: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 12,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  paymentBadgeText: {
    marginLeft: 6,
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '600',
  },
  addMethodButton: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
  },
  addMethodText: {
    marginLeft: 12,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  roleSwitchButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(76,110,245,0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(76,110,245,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitchButtonDisabled: {
    backgroundColor: 'rgba(150,150,150,0.2)',
    borderColor: 'rgba(150,150,150,0.3)',
  },
  roleSwitchText: {
    color: colors.primary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  roleSwitchTextDisabled: {
    color: '#999',
  },
  adminButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  adminButtonText: {
    color: colors.textLight,
    fontWeight: '700',
    flex: 1,
    marginLeft: 10,
  },
});

export default SettingsScreen;
