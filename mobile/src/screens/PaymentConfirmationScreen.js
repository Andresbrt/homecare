import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { colors } from '../theme/colors';
import { commonStyles } from '../theme/commonStyles';
import { formatCOP, ensureMinCOP } from '../utils/currency';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.10:8080/api';

const DEFAULT_BOOKING = {
  service: {
    title: 'Limpieza personalizada',
    priceRange: 'Desde $80,000 COP',
    duration: '3-4 horas',
  },
  date: '28/10/2025',
  time: '09:00',
  address: 'Cra. 15 #80-22, Bogotá',
  extras: ['Productos hipoalergénicos'],
  frequency: 'Única vez',
  total: 80000,
};

const PaymentConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const booking = route.params?.booking ?? DEFAULT_BOOKING;
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [processing, setProcessing] = useState(false);

  const totalAmount = useMemo(() => ensureMinCOP(Number(booking.total) || 0), [booking.total]);
  const totalLabel = useMemo(() => formatCOP(totalAmount), [totalAmount]);

  const handleSelectPaymentMethod = async (paymentData) => {
    setSelectedPayment(paymentData);
    setShowPaymentSelector(false);
    
    // Si es tarjeta/PSE vía Wompi, redirigir a checkout
    const wompiMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'PSE'];
    if (wompiMethods.includes(paymentData.paymentMethod)) {
      navigation.navigate('WompiCheckout', {
        amount: totalAmount,
        email: booking.customerEmail || 'test@example.com',
        reference: `cleanhome-${Date.now()}`,
      });
      return;
    }

    // De lo contrario, procesar via backend (cash, transfer, wallets)
    await processPayment(paymentData);
  };

  const processPayment = async (paymentData) => {
    if (processing) {
      return;
    }

    try {
      setProcessing(true);
      
      // Obtener token
      const token = await AsyncStorage.getItem('@cleanhome/token');
      
      if (!token) {
        Alert.alert('Error', 'Debes iniciar sesión para continuar');
        navigation.navigate('Login');
        return;
      }

      // Preparar datos del pago
      const paymentPayload = {
        bookingId: booking.id || 1, // En producción usar el ID real
        amount: totalAmount,
        paymentMethod: paymentData.paymentMethod,
        cardNumber: paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : null,
        cardHolderName: paymentData.cardHolderName || null,
        notes: `Pago por ${booking.service?.title || 'servicio'}`,
      };

      // Enviar petición al backend
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al procesar el pago');
      }

      const paymentResult = await response.json();
      
      const confirmedBooking = {
        ...booking,
        status: 'CONFIRMED',
        paymentId: paymentResult.id,
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: paymentResult.status,
        totalLabel,
        paymentConfirmed: true,
        trackingEnabled: true,
        confirmedAt: new Date().toISOString(),
      };

      if (paymentResult.status === 'COMPLETED') {
        Alert.alert(
          '¡Pago exitoso! 🎉',
          `Tu pago de ${totalLabel} ha sido procesado correctamente.\n\nID de transacción: ${paymentResult.transactionId}`,
          [
            {
              text: 'Iniciar tracking',
              onPress: () => {
                navigation.navigate('TrackingScreen', {
                  booking: confirmedBooking,
                  trackingActive: true,
                });
              },
            },
            {
              text: 'Ver historial',
              onPress: () =>
                navigation.navigate('ServiceHistory', {
                  newBooking: confirmedBooking,
                }),
            },
            {
              text: 'Ir al inicio',
              style: 'cancel',
              onPress: () => navigation.navigate('CustomerHome'),
            },
          ]
        );
      } else if (paymentResult.status === 'PENDING') {
        Alert.alert(
          'Pago pendiente',
          'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
          [{ text: 'Entendido', onPress: () => navigation.navigate('CustomerHome') }]
        );
      } else {
        throw new Error('El pago no pudo ser completado');
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      Alert.alert(
        'Error en el pago',
        error.message || 'No se pudo procesar tu pago. Por favor intenta nuevamente.',
        [{ text: 'Intentar de nuevo' }]
      );
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentMethodDisplay = () => {
    if (!selectedPayment) {
      return { icon: 'credit-card-outline', name: 'Seleccionar método' };
    }

    const methods = {
      CREDIT_CARD: { icon: 'credit-card', name: 'Tarjeta de Crédito' },
      DEBIT_CARD: { icon: 'credit-card-outline', name: 'Tarjeta de Débito' },
      CASH: { icon: 'cash', name: 'Efectivo' },
      PSE: { icon: 'bank', name: 'PSE' },
      NEQUI: { icon: 'cellphone', name: 'Nequi' },
      DAVIPLATA: { icon: 'wallet', name: 'Daviplata' },
      PAYPAL: { icon: 'paypal', name: 'PayPal' },
      MERCADO_PAGO: { icon: 'shopping', name: 'Mercado Pago' },
      BANK_TRANSFER: { icon: 'bank-transfer', name: 'Transferencia Bancaria' },
    };

    return methods[selectedPayment.paymentMethod] || methods.CREDIT_CARD;
  };

  return (
    <GradientBackground>
      <PaymentMethodSelector
        visible={showPaymentSelector}
        onClose={() => setShowPaymentSelector(false)}
        onSelectMethod={handleSelectPaymentMethod}
        amount={totalAmount}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Confirma y paga</Text>
        <Text style={styles.subtitle}>
          Revisa los detalles de tu servicio antes de finalizar la reserva. Elige tu método
          de pago preferido.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen del servicio</Text>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="broom" size={20} color={colors.accent} />
            <View style={styles.summaryTextWrapper}>
              <Text style={styles.summaryLabel}>{booking.service?.title ?? 'Servicio'}</Text>
              <Text style={styles.summarySub}>{booking.service?.duration ?? 'Duración estimada'}</Text>
            </View>
            <Text style={styles.summaryAmount}>{booking.service?.priceRange ?? '$0.00'}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={18} color={colors.textMuted} />
            <Text style={styles.detailText}>
              {booking.date} a las {booking.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker-radius" size={18} color={colors.textMuted} />
            <Text style={styles.detailText}>{booking.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="repeat" size={18} color={colors.textMuted} />
            <Text style={styles.detailText}>{booking.frequency ?? 'Única vez'}</Text>
          </View>
          {!!booking.extras?.length && (
            <View style={styles.extrasWrapper}>
              {booking.extras.map((extra) => (
                <View key={extra} style={styles.extraTag}>
                  <Text style={styles.extraTagText}>{extra}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Método de pago</Text>
          <TouchableOpacity
            style={styles.paymentMethodButton}
            onPress={() => setShowPaymentSelector(true)}
            activeOpacity={0.8}
            disabled={processing}
          >
            <View style={styles.methodIconWrapper}>
              <MaterialCommunityIcons
                name={getPaymentMethodDisplay().icon}
                size={24}
                color={colors.textLight}
              />
            </View>
            <View style={styles.methodTextWrapper}>
              <Text style={styles.methodTitle}>{getPaymentMethodDisplay().name}</Text>
              <Text style={styles.methodSubtitle}>
                {selectedPayment ? 'Toca para cambiar' : 'Toca para seleccionar'}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} />
          </TouchableOpacity>
          
          {selectedPayment && (
            <View style={styles.selectedInfo}>
              <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
              <Text style={styles.selectedText}>Método de pago seleccionado</Text>
            </View>
          )}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRowAlt}>
            <Text style={styles.summaryLabelAlt}>Total a pagar</Text>
            <Text style={styles.summaryAmountAlt}>{totalLabel}</Text>
          </View>
          <Text style={styles.summaryHint}>Pago seguro y encriptado. Protegemos tu información.</Text>
          
          <TouchableOpacity
            style={[styles.confirmButton, (processing || !selectedPayment) && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={() => !processing && selectedPayment && setShowPaymentSelector(true)}
            disabled={processing || !selectedPayment}
          >
            {processing ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <MaterialCommunityIcons name="shield-check" size={20} color={colors.white} />
            )}
            <Text style={styles.confirmButtonText}>
              {processing
                ? 'Procesando pago...'
                : selectedPayment
                ? `Confirmar pago de ${totalLabel}`
                : 'Selecciona un método de pago'}
            </Text>
            {!processing && <MaterialCommunityIcons name="chevron-right" size={22} color={colors.white} />}
          </TouchableOpacity>
        </View>
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
  card: {
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTextWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  summaryLabel: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  summarySub: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 13,
  },
  summaryAmount: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  detailText: {
    marginLeft: 10,
    color: colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  extrasWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  extraTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  extraTagText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundLight,
    padding: 16,
  },
  methodIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodTextWrapper: {
    flex: 1,
  },
  methodTitle: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '600',
  },
  methodSubtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 12,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  selectedText: {
    marginLeft: 8,
    color: colors.success,
    fontSize: 13,
    fontWeight: '600',
  },
  summaryCard: {
    marginTop: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryRowAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabelAlt: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  summaryAmountAlt: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  summaryHint: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 12,
  },
  confirmButton: {
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmButtonText: {
    flex: 1,
    marginLeft: 12,
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default PaymentConfirmationScreen;
