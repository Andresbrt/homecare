import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const RequestServiceScreen = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  
  const MIN_AMOUNT = 80000; // Tarifa mínima $80,000 COP
  const PLATFORM_FEE = 0.10; // 10% comisión plataforma
  const WOMPI_FEE = 0.029; // 2.9% comisión Wompi
  const WOMPI_FIXED = 900; // $900 COP fijo Wompi

  const serviceTypes = [
    {
      id: 'premium',
      name: 'Premium',
      icon: 'star-circle',
      description: 'Servicio completo de limpieza profunda',
      features: ['Limpieza profunda', 'Desinfección total', 'Productos premium', 'Garantía 100%'],
      color: colors.primary, // Turquesa Homecare
    },
    {
      id: 'confort',
      name: 'Confort',
      icon: 'home-heart',
      description: 'Limpieza estándar de calidad',
      features: ['Limpieza general', 'Productos estándar', 'Servicio rápido', 'Calidad garantizada'],
      color: colors.accent, // Azul Petróleo Homecare
    },
  ];

  const calculateBreakdown = (totalAmount) => {
    const wompiCommission = (totalAmount * WOMPI_FEE) + WOMPI_FIXED;
    const platformCommission = totalAmount * PLATFORM_FEE;
    const providerAmount = totalAmount - wompiCommission - platformCommission;
    
    return {
      total: totalAmount,
      wompiCommission: Math.round(wompiCommission),
      platformCommission: Math.round(platformCommission),
      providerAmount: Math.round(providerAmount),
    };
  };

  const handleRequestService = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Por favor ingresa la dirección del servicio');
      return;
    }
    if (!amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa el monto que deseas pagar');
      return;
    }
    
    const numAmount = parseInt(amount.replace(/\D/g, ''));
    
    if (numAmount < MIN_AMOUNT) {
      Alert.alert('Monto mínimo', `El monto mínimo para solicitar un servicio es ${formatCOP(MIN_AMOUNT)}`);
      return;
    }
    
    if (!selectedService) {
      Alert.alert('Error', 'Por favor selecciona un tipo de servicio');
      return;
    }

    const breakdown = calculateBreakdown(numAmount);

    // Navegar a pantalla de búsqueda de proveedor
    navigation.navigate('SearchingProvider', {
      address,
      amount: numAmount,
      serviceType: selectedService,
      breakdown,
    });
  };

  const formatInputCOP = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Solicitar Servicio</Text>
            <View style={styles.backButton} />
          </View>

          {/* Address Input */}
          <View style={styles.card}>
            <View style={styles.inputHeader}>
              <MaterialCommunityIcons name="map-marker" size={24} color={colors.primary} />
              <Text style={styles.inputLabel}>Dirección del servicio</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ej: Calle 123 #45-67, Bogotá"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          {/* Amount Input */}
          <View style={styles.card}>
            <View style={styles.inputHeader}>
              <MaterialCommunityIcons name="cash" size={24} color={colors.secondary} />
              <Text style={styles.inputLabel}>¿Cuánto deseas pagar?</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                value={amount}
                onChangeText={(text) => setAmount(formatInputCOP(text))}
                keyboardType="numeric"
              />
              <Text style={styles.currency}>COP</Text>
            </View>
            <Text style={styles.hint}>Tarifa mínima: $80,000 COP</Text>
            <Text style={styles.minAmount}>Los profesionales verán tu oferta y podrán aceptarla o contraofertar</Text>
          </View>

          {/* Fee Breakdown */}
          {amount && parseInt(amount.replace(/\D/g, '')) >= MIN_AMOUNT && (
            <View style={styles.card}>
              <View style={styles.inputHeader}>
                <MaterialCommunityIcons name="calculator" size={24} color={colors.info} />
                <Text style={styles.inputLabel}>Desglose de pago</Text>
              </View>
              <View style={styles.breakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Total a pagar</Text>
                  <Text style={styles.breakdownValue}>{formatCOP(parseInt(amount.replace(/\D/g, '')))}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Comisión Wompi (2.9% + $900)</Text>
                  <Text style={styles.breakdownFee}>-{formatCOP(calculateBreakdown(parseInt(amount.replace(/\D/g, ''))).wompiCommission)}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Comisión plataforma (10%)</Text>
                  <Text style={styles.breakdownFee}>-{formatCOP(calculateBreakdown(parseInt(amount.replace(/\D/g, ''))).platformCommission)}</Text>
                </View>
                <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                  <Text style={styles.breakdownLabelTotal}>El proveedor recibe</Text>
                  <Text style={styles.breakdownValueTotal}>{formatCOP(calculateBreakdown(parseInt(amount.replace(/\D/g, ''))).providerAmount)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Service Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecciona el tipo de servicio</Text>
            {serviceTypes.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  selectedService === service.id && styles.serviceCardSelected,
                ]}
                onPress={() => setSelectedService(service.id)}
              >
                <LinearGradient
                  colors={
                    selectedService === service.id
                      ? [service.color, service.color + 'DD']
                      : ['#FFFFFF', '#FFFFFF']
                  }
                  style={styles.serviceGradient}
                >
                  <View style={styles.serviceHeader}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialCommunityIcons
                        name={service.icon}
                        size={32}
                        color={selectedService === service.id ? '#FFFFFF' : service.color}
                      />
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text
                        style={[
                          styles.serviceName,
                          selectedService === service.id && styles.serviceNameSelected,
                        ]}
                      >
                        {service.name}
                      </Text>
                      <Text
                        style={[
                          styles.serviceDescription,
                          selectedService === service.id && styles.serviceDescriptionSelected,
                        ]}
                      >
                        {service.description}
                      </Text>
                    </View>
                    {selectedService === service.id && (
                      <MaterialCommunityIcons name="check-circle" size={28} color="#FFFFFF" />
                    )}
                  </View>
                  <View style={styles.featuresList}>
                    {service.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <MaterialCommunityIcons
                          name="check"
                          size={16}
                          color={selectedService === service.id ? '#FFFFFF' : colors.success}
                        />
                        <Text
                          style={[
                            styles.featureText,
                            selectedService === service.id && styles.featureTextSelected,
                          ]}
                        >
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Request Button */}
          <TouchableOpacity style={styles.requestButton} onPress={handleRequestService}>
            <LinearGradient
              colors={[colors.secondary, colors.secondaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.requestGradient}
            >
              <Text style={styles.requestButtonText}>Solicitar Servicio</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginLeft: 8,
  },
  input: {
    fontSize: 16,
    color: colors.textDark,
    padding: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    minHeight: 50,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    marginLeft: 8,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
  },
  minAmount: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  breakdown: {
    marginTop: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  breakdownFee: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 8,
    paddingTop: 12,
  },
  breakdownLabelTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
  },
  breakdownValueTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 12,
  },
  serviceCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceCardSelected: {
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  serviceGradient: {
    padding: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  serviceNameSelected: {
    color: colors.textLight,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  serviceDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  featureTextSelected: {
    color: 'rgba(255, 255, 255, 0.95)',
  },
  requestButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  requestGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  requestButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
});

export default RequestServiceScreen;
