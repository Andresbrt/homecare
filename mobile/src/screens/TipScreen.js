import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const TipScreen = ({ route, navigation }) => {
  const { booking, provider } = route.params || {};
  const [selectedTipPercent, setSelectedTipPercent] = useState(15);
  const [customTip, setCustomTip] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const baseAmount = booking?.total || 80000;
  const tipPresets = [10, 15, 20, 25];

  const calculateTip = () => {
    if (isCustom) {
      return parseFloat(customTip) || 0;
    }
    return Math.round((baseAmount * selectedTipPercent) / 100);
  };

  const handleConfirmTip = () => {
    const tipAmount = calculateTip();
    const total = baseAmount + tipAmount;

    Alert.alert(
      '✨ Propina confirmada',
      `Has dado una propina de ${formatCOP(tipAmount)} a ${provider?.name || 'tu proveedor'}.\n\nTotal: ${formatCOP(total)}`,
      [
        {
          text: 'Confirmar',
          onPress: () => {
            // Aquí iría la lógica de pago
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSkipTip = () => {
    Alert.alert(
      'Sin propina',
      '¿Estás seguro de que no deseas dejar propina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar propina</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Provider Info */}
        <View style={styles.providerCard}>
          <View style={styles.providerAvatar}>
            <MaterialCommunityIcons name="account" size={32} color={colors.primary} />
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider?.name || 'Carlos Rodríguez'}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color={colors.warning} />
              <Text style={styles.rating}>{provider?.rating || '4.9'}</Text>
              <Text style={styles.serviceType}> • Limpieza Profunda</Text>
            </View>
          </View>
        </View>

        {/* Tip Message */}
        <View style={styles.messageCard}>
          <MaterialCommunityIcons name="heart" size={24} color={colors.error} />
          <Text style={styles.messageText}>
            Las propinas ayudan a motivar a nuestros profesionales y reconocer su excelente trabajo
          </Text>
        </View>

        {/* Service Amount */}
        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>Monto del servicio</Text>
          <Text style={styles.baseAmount}>{formatCOP(baseAmount)}</Text>
        </View>

        {/* Tip Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Propina sugerida</Text>
          <View style={styles.presetsContainer}>
            {tipPresets.map((percent) => {
              const tipAmount = Math.round((baseAmount * percent) / 100);
              return (
                <TouchableOpacity
                  key={percent}
                  style={[
                    styles.presetButton,
                    selectedTipPercent === percent && !isCustom && styles.presetButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedTipPercent(percent);
                    setIsCustom(false);
                  }}
                >
                  <Text
                    style={[
                      styles.presetPercent,
                      selectedTipPercent === percent && !isCustom && styles.presetPercentSelected,
                    ]}
                  >
                    {percent}%
                  </Text>
                  <Text
                    style={[
                      styles.presetAmount,
                      selectedTipPercent === percent && !isCustom && styles.presetAmountSelected,
                    ]}
                  >
                    {formatCOP(tipAmount)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Custom Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Propina personalizada</Text>
          <TouchableOpacity
            style={[styles.customContainer, isCustom && styles.customContainerActive]}
            onPress={() => setIsCustom(true)}
          >
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.customInput}
              value={customTip}
              onChangeText={setCustomTip}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              onFocus={() => setIsCustom(true)}
            />
          </TouchableOpacity>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Servicio</Text>
            <Text style={styles.totalValue}>{formatCOP(baseAmount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Propina</Text>
            <Text style={styles.totalValue}>{formatCOP(calculateTip())}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Total a pagar</Text>
            <Text style={styles.grandTotalValue}>{formatCOP(baseAmount + calculateTip())}</Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmTip}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="check-circle" size={20} color={colors.white} />
          <Text style={styles.confirmButtonText}>Confirmar propina de {formatCOP(calculateTip())}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipTip}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>Continuar sin propina</Text>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            El 100% de la propina va directamente al proveedor
          </Text>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  providerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginLeft: 4,
  },
  serviceType: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  amountSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  baseAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  presetButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  presetButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  presetPercentSelected: {
    color: colors.white,
  },
  presetAmount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  presetAmountSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  customContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  customContainerActive: {
    borderColor: colors.primary,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginRight: 8,
  },
  customInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  totalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  skipButton: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default TipScreen;
