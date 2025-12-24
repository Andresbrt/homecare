import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const WalletScreen = ({ navigation }) => {
  const [balance] = useState(125000);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const rechargeAmounts = [50000, 100000, 150000, 200000, 300000, 500000];

  const transactions = [
    {
      id: 1,
      type: 'credit',
      description: 'Recarga de saldo',
      amount: 100000,
      date: '2024-11-23',
      icon: 'plus-circle',
      color: colors.success,
    },
    {
      id: 2,
      type: 'debit',
      description: 'Pago servicio limpieza',
      amount: -68000,
      date: '2024-11-22',
      icon: 'broom',
      color: colors.error,
    },
    {
      id: 3,
      type: 'credit',
      description: 'Cashback 5%',
      amount: 3400,
      date: '2024-11-22',
      icon: 'gift',
      color: colors.secondary,
    },
    {
      id: 4,
      type: 'credit',
      description: 'Bono de referido',
      amount: 40000,
      date: '2024-11-20',
      icon: 'account-heart',
      color: colors.primary,
    },
    {
      id: 5,
      type: 'debit',
      description: 'Propina a proveedor',
      amount: -10000,
      date: '2024-11-18',
      icon: 'hand-coin',
      color: colors.error,
    },
    {
      id: 6,
      type: 'debit',
      description: 'Pago add-ons',
      amount: -35000,
      date: '2024-11-18',
      icon: 'cart',
      color: colors.error,
    },
  ];

  const benefits = [
    {
      icon: 'percent',
      title: '5% cashback',
      description: 'En todos tus servicios',
      color: colors.success,
    },
    {
      icon: 'lightning-bolt',
      title: 'Pago instantáneo',
      description: 'Sin esperas ni complicaciones',
      color: colors.secondary,
    },
    {
      icon: 'shield-check',
      title: 'Protección total',
      description: 'Tu dinero siempre seguro',
      color: colors.primary,
    },
    {
      icon: 'gift',
      title: 'Bonos exclusivos',
      description: 'Recompensas por recargar',
      color: colors.primary, // Turquesa Homecare
    },
  ];

  const handleRecharge = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || amount < 10000) {
      Alert.alert('Monto inválido', `El monto mínimo de recarga es ${formatCOP(10000)}`);
      return;
    }

    Alert.alert(
      '💰 Confirmar recarga',
      `¿Deseas recargar ${formatCOP(amount)} a tu CleanHome Wallet?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recargar',
          onPress: () => {
            Alert.alert(
              '✅ ¡Recarga exitosa!',
              `Tu saldo se actualizó a ${formatCOP(balance + amount)}`
            );
            setSelectedAmount(null);
            setCustomAmount('');
          },
        },
      ]
    );
  };

  const handleWithdraw = () => {
    if (balance === 0) {
      Alert.alert('Sin saldo', 'No tienes saldo disponible para retirar');
      return;
    }

    Alert.alert(
      '🏦 Retirar saldo',
      `Saldo disponible: ${formatCOP(balance)}\n\nEl dinero se transferirá a tu cuenta bancaria en 2-3 días hábiles.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Retirar todo',
          onPress: () => {
            Alert.alert('✅ Retiro procesado', 'Recibirás tu dinero en 2-3 días hábiles');
          },
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
          <Text style={styles.headerTitle}>Mi Wallet</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="history" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons name="eye-off" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{formatCOP(balance)}</Text>
          <Text style={styles.balanceSubtitle}>Úsalo en cualquier servicio</Text>

          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceButton} onPress={handleRecharge}>
              <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
              <Text style={styles.balanceButtonText}>Recargar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceButtonOutline} onPress={handleWithdraw}>
              <MaterialCommunityIcons name="bank-transfer" size={20} color={colors.white} />
              <Text style={styles.balanceButtonText}>Retirar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: benefit.color + '20' }]}>
                <MaterialCommunityIcons name={benefit.icon} size={20} color={benefit.color} />
              </View>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDescription}>{benefit.description}</Text>
            </View>
          ))}
        </View>

        {/* Recharge Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recargar saldo</Text>
          <View style={styles.amountsGrid}>
            {rechargeAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.amountButtonSelected,
                ]}
                onPress={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
              >
                <Text
                  style={[
                    styles.amountText,
                    selectedAmount === amount && styles.amountTextSelected,
                  ]}
                >
                  ${(amount / 1000).toFixed(0)}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>O ingresa un monto personalizado</Text>
            <View style={styles.customAmountInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={customAmount}
                onChangeText={(text) => {
                  setCustomAmount(text);
                  setSelectedAmount(null);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.rechargeButton,
              (!selectedAmount && !customAmount) && styles.rechargeButtonDisabled,
            ]}
            onPress={handleRecharge}
            disabled={!selectedAmount && !customAmount}
          >
            <MaterialCommunityIcons name="credit-card" size={20} color={colors.white} />
            <Text style={styles.rechargeButtonText}>Recargar ahora</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Movimientos recientes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View
                style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.color + '20' },
                ]}
              >
                <MaterialCommunityIcons
                  name={transaction.icon}
                  size={20}
                  color={transaction.color}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.amount > 0 ? colors.success : colors.textDark },
                ]}
              >
                {(transaction.amount > 0 ? '+' : '-') + formatCOP(Math.abs(transaction.amount))}
              </Text>
            </View>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={18} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Tu saldo nunca vence y puedes retirarlo en cualquier momento sin comisiones
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
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  balanceSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  balanceButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  balanceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  benefitCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  amountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  amountButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  amountButtonSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  amountTextSelected: {
    color: colors.primary,
  },
  customAmountContainer: {
    marginBottom: 20,
  },
  customAmountLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  rechargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  rechargeButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  rechargeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export default WalletScreen;
