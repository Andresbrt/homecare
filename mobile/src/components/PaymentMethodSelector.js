import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import Constants from 'expo-constants';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const PAYMENT_METHODS = [
  {
    id: 'CREDIT_CARD',
    name: 'Tarjeta de Crédito',
    icon: 'credit-card',
    color: colors.primary, // Turquesa Homecare
    requiresCardInfo: true,
    brand: 'visa',
  },
  {
    id: 'DEBIT_CARD',
    name: 'Tarjeta de Débito',
    icon: 'credit-card-outline',
    color: colors.accent, // Azul Petróleo Homecare
    requiresCardInfo: true,
    brand: 'mastercard',
  },
  {
    id: 'CASH',
    name: 'Efectivo',
    icon: 'cash',
    color: colors.success, // Verde éxito
    requiresCardInfo: false,
  },
  {
    id: 'PSE',
    name: 'PSE',
    icon: 'bank',
    color: colors.warning, // Amarillo
    requiresCardInfo: false,
    brand: 'pse',
  },
  {
    id: 'NEQUI',
    name: 'Nequi',
    icon: 'cellphone',
    color: '#ec4899',
    requiresCardInfo: false,
    brand: 'nequi',
  },
  {
    id: 'DAVIPLATA',
    name: 'Daviplata',
    icon: 'wallet',
    color: '#ef4444',
    requiresCardInfo: false,
    brand: 'daviplata',
  },
  {
    id: 'PAYPAL',
    name: 'PayPal',
    icon: 'paypal',
    color: '#0070ba',
    requiresCardInfo: false,
    brand: 'paypal',
  },
  {
    id: 'MERCADO_PAGO',
    name: 'Mercado Pago',
    icon: 'shopping',
    color: '#00b1ea',
    requiresCardInfo: false,
    brand: 'mercadopago',
  },
  {
    id: 'BANK_TRANSFER',
    name: 'Transferencia Bancaria',
    icon: 'bank-transfer',
    color: '#64748b',
    requiresCardInfo: false,
  },
];

const PaymentMethodSelector = ({ visible, onClose, onSelectMethod, amount }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setShowCardForm(method.requiresCardInfo);
  };

  const handleConfirm = () => {
    if (!selectedMethod) {
      return;
    }

    const paymentData = {
      paymentMethod: selectedMethod.id,
      amount: amount,
    };

    if (selectedMethod.requiresCardInfo) {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert('Por favor completa todos los datos de la tarjeta');
        return;
      }
      paymentData.cardNumber = cardNumber.replace(/\s/g, '');
      paymentData.cardHolderName = cardHolder;
      paymentData.expiryDate = expiryDate;
      paymentData.cvv = cvv;
    }

    onSelectMethod(paymentData);
    resetForm();
  };

  const resetForm = () => {
    setSelectedMethod(null);
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
    setShowCardForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const VISA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 324.68"><path fill="#1434cb" d="m651.19.5c-70.93,0-134.32,36.77-134.32,104.69,0,77.9,112.42,83.28,112.42,122.42,0,16.48-18.88,31.23-51.14,31.23-45.77,0-79.98-20.61-79.98-20.61l-14.64,68.55s39.41,17.41,91.73,17.41c77.55,0,138.58-38.57,138.58-107.66,0-82.32-112.89-87.54-112.89-123.86,0-12.91,15.5-27.05,47.66-27.05,36.29,0,65.89,14.99,65.89,14.99l14.33-66.2S696.61.5,651.18.5h0ZM2.22,5.5L.5,15.49s29.84,5.46,56.72,16.36c34.61,12.49,37.07,19.77,42.9,42.35l63.51,244.83h85.14L379.93,5.5h-84.94l-84.28,213.17-34.39-180.7c-3.15-20.68-19.13-32.48-38.68-32.48,0,0-135.41,0-135.41,0Zm411.87,0l-66.63,313.53h81L494.85,5.5h-80.76Zm451.76,0c-19.53,0-29.88,10.46-37.47,28.73l-118.67,284.8h84.94l16.43-47.47h103.48l9.99,47.47h74.95L934.12,5.5h-68.27Zm11.05,84.71l25.18,117.65h-67.45l42.28-117.65h0Z"/></svg>`;
  const MASTERCARD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 999.2 776"><g><rect x="364" y="66.1" fill="#FF5A00" width="270.4" height="485.8"/><path fill="#EB001B" d="M382,309c0-98.7,46.4-186.3,117.6-242.9C447.2,24.9,381.1,0,309,0C138.2,0,0,138.2,0,309s138.2,309,309,309c72.1,0,138.2-24.9,190.6-66.1C428.3,496.1,382,407.7,382,309z"/><path fill="#F79E1B" d="M999.2,309c0,170.8-138.2,309-309,309c-72.1,0-138.2-24.9-190.6-66.1c72.1-56.7,117.6-144.2,117.6-242.9S570.8,122.7,499.6,66.1C551.9,24.9,618,0,690.1,0C861,0,999.2,139.1,999.2,309z"/></g></svg>`;

  const renderBrandLogo = (method) => {
    switch (method.brand) {
      case 'visa':
        return (
          <SvgXml xml={VISA_SVG} width={44} height={18} />
        );
      case 'mastercard':
        return (
          <SvgXml xml={MASTERCARD_SVG} width={44} height={28} />
        );
      case 'pse':
        {
          const uri = Constants.expoConfig?.extra?.brandLogos?.pseUri;
          if (uri) {
            return (
              <Image
                source={{ uri }}
                style={styles.brandImageCircle}
                resizeMode="contain"
              />
            );
          }
          return (
            <View style={[styles.brandBadge, { backgroundColor: '#005AAA' }]}>
              <Text style={styles.brandText}>PSE</Text>
            </View>
          );
        }
      case 'nequi':
        return (
          <View style={[styles.brandBadge, { backgroundColor: '#8E3DFF' }]}>
            <Text style={styles.brandText}>Nequi</Text>
          </View>
        );
      case 'daviplata':
        return (
          <View style={[styles.brandBadge, { backgroundColor: '#E30613' }]}>
            <Text style={styles.brandText}>Daviplata</Text>
          </View>
        );
      case 'paypal':
        return (
          <View style={[styles.brandBadge, { backgroundColor: '#003087' }]}>
            <Text style={styles.brandText}>PayPal</Text>
          </View>
        );
      case 'mercadopago':
        return (
          <View style={[styles.brandBadge, { backgroundColor: '#009EE3' }]}>
            <Text style={styles.brandText}>Mercado Pago</Text>
          </View>
        );
      default:
        return (
          <MaterialCommunityIcons name={method.icon} size={28} color="#fff" />
        );
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecciona método de pago</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          {amount != null && (
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Total a pagar</Text>
              <Text style={styles.amountValue}>{formatCOP(amount)}</Text>
            </View>
          )}

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.methodsGrid}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedMethod?.id === method.id && styles.methodCardSelected,
                  ]}
                  onPress={() => handleSelectMethod(method)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: method.color }]}>
                    {renderBrandLogo(method)}
                  </View>
                  <Text style={styles.methodName}>{method.name}</Text>
                  {selectedMethod?.id === method.id && (
                    <View style={styles.checkmark}>
                      <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {showCardForm && (
              <View style={styles.cardForm}>
                <Text style={styles.formTitle}>Datos de la tarjeta</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Número de tarjeta</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={colors.textMuted}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    keyboardType="number-pad"
                    maxLength={19}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nombre del titular</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="NOMBRE APELLIDO"
                    placeholderTextColor={colors.textMuted}
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Vencimiento</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/AA"
                      placeholderTextColor={colors.textMuted}
                      value={expiryDate}
                      onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                      keyboardType="number-pad"
                      maxLength={5}
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor={colors.textMuted}
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="number-pad"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
              </View>
            )}

            {selectedMethod && !showCardForm && (
              <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  {selectedMethod.id === 'CASH'
                    ? 'Pagarás en efectivo al finalizar el servicio'
                    : selectedMethod.id === 'PSE'
                    ? 'Serás redirigido a tu banco para completar el pago'
                    : selectedMethod.id === 'NEQUI' || selectedMethod.id === 'DAVIPLATA'
                    ? 'Recibirás una notificación en tu app para aprobar el pago'
                    : selectedMethod.id === 'BANK_TRANSFER'
                    ? 'Recibirás los datos bancarios para realizar la transferencia'
                    : `Serás redirigido a ${selectedMethod.name} para completar el pago`}
                </Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.confirmButton, !selectedMethod && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={!selectedMethod}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={!selectedMethod ? ['#94a3b8', '#64748b'] : [colors.primary, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.confirmButtonGradient}
            >
              <Text style={styles.confirmButtonText}>
                {showCardForm ? 'Pagar ahora' : 'Confirmar método de pago'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  closeButton: {
    padding: 4,
  },
  amountContainer: {
    padding: 20,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollContent: {
    flex: 1,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  methodCard: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodCardSelected: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  brandText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  brandImageCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  methodName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  cardForm: {
    padding: 20,
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 16,
    color: colors.textDark,
  },
  row: {
    flexDirection: 'row',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PaymentMethodSelector;
