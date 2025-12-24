import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const ProviderFinancialScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');

  const balance = {
    available: 1250000,
    pending: 340000,
    totalEarned: 8950000,
  };

  const earnings = {
    week: 1250000,
    month: 4850000,
    year: 8950000,
  };

  const commissions = {
    platform: 895000, // 10%
    wompi: 287900, // 2.9% + 900 COP por transacción
    total: 1182900,
  };

  const transactions = [
    {
      id: '1',
      type: 'service',
      customerName: 'Laura Méndez',
      serviceType: 'Limpieza profunda',
      date: '2025-11-24',
      time: '15:00',
      grossAmount: 180000,
      platformCommission: 18000,
      wompiCommission: 6120,
      netAmount: 155880,
      status: 'completed',
    },
    {
      id: '2',
      type: 'service',
      customerName: 'Luis Romero',
      serviceType: 'Express 60min',
      date: '2025-11-23',
      time: '09:00',
      grossAmount: 80000,
      platformCommission: 8000,
      wompiCommission: 3220,
      netAmount: 68780,
      status: 'completed',
    },
    {
      id: '3',
      type: 'withdrawal',
      bankName: 'Bancolombia',
      accountNumber: '**** 4521',
      date: '2025-11-22',
      amount: -500000,
      status: 'completed',
    },
    {
      id: '4',
      type: 'service',
      customerName: 'Oficina Creativa',
      serviceType: 'Limpieza de oficinas',
      date: '2025-11-21',
      time: '08:00',
      grossAmount: 350000,
      platformCommission: 35000,
      wompiCommission: 11050,
      netAmount: 303950,
      status: 'pending',
    },
  ];

  // Usamos el formateador centralizado de COP

  const handleWithdraw = () => {
    Alert.alert(
      'Retirar dinero',
      `Saldo disponible: ${formatCOP(balance.available)} COP\n\n¿Cuánto deseas retirar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => {
            Alert.alert(
              'Retiro solicitado',
              'Tu retiro será procesado en las próximas 24-48 horas.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const handleDownloadReceipt = (transaction) => {
    Alert.alert(
      'Descargar comprobante',
      `Comprobante de ${transaction.type === 'service' ? 'servicio' : 'retiro'}\nID: ${transaction.id}`,
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      default:
        return status;
    }
  };

  return (
    <GradientBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finanzas</Text>
        <TouchableOpacity onPress={handleWithdraw} style={styles.withdrawButton}>
          <MaterialCommunityIcons name="bank-transfer-out" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
            <MaterialCommunityIcons name="wallet" size={24} color="white" />
          </View>
          <Text style={styles.balanceAmount}>{formatCOP(balance.available)}</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Pendiente</Text>
              <Text style={styles.balanceItemValue}>{formatCOP(balance.pending)}</Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Total ganado</Text>
              <Text style={styles.balanceItemValue}>{formatCOP(balance.totalEarned)}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earnings Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Ingresos - {selectedPeriod === 'week' ? 'Esta semana' : selectedPeriod === 'month' ? 'Este mes' : 'Este año'}</Text>
          </View>

          <View style={styles.earningRow}>
            <Text style={styles.earningLabel}>Ingresos brutos</Text>
            <Text style={styles.earningValue}>{formatCOP(earnings[selectedPeriod])}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.earningRow}>
            <Text style={styles.earningLabelFee}>Comisión plataforma (10%)</Text>
            <Text style={styles.earningValueFee}>
              -{formatCOP(commissions.platform)}
            </Text>
          </View>

          <View style={styles.earningRow}>
            <Text style={styles.earningLabelFee}>Comisión Wompi</Text>
            <Text style={styles.earningValueFee}>
              -{formatCOP(commissions.wompi)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.earningRow}>
            <Text style={styles.earningLabelTotal}>Total neto</Text>
            <Text style={styles.earningValueTotal}>
              {formatCOP(earnings[selectedPeriod] - commissions.total)}
            </Text>
          </View>
        </View>

        {/* Proyección */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="trending-up" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Proyección</Text>
          </View>

          <View style={styles.projectionRow}>
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Próxima semana</Text>
              <Text style={styles.projectionValue}>{formatCOP(1350000)}</Text>
              <Text style={styles.projectionGrowth}>+8% 📈</Text>
            </View>
            <View style={styles.projectionDivider} />
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Próximo mes</Text>
              <Text style={styles.projectionValue}>{formatCOP(5200000)}</Text>
              <Text style={styles.projectionGrowth}>+7% 📈</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar transacciones..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Transaction History */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="history" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Historial de transacciones</Text>
          </View>

          {transactions.map((transaction, index) => (
            <View key={transaction.id}>
              {transaction.type === 'service' ? (
                <TouchableOpacity
                  style={styles.transactionRow}
                  onPress={() => handleDownloadReceipt(transaction)}
                >
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIcon,
                        { backgroundColor: colors.primary + '10' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="broom"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{transaction.customerName}</Text>
                      <Text style={styles.transactionSubtitle}>{transaction.serviceType}</Text>
                      <Text style={styles.transactionDate}>
                        {transaction.date} • {transaction.time}
                      </Text>
                      <View style={styles.transactionBreakdown}>
                        <Text style={styles.breakdownText}>
                          Bruto: {formatCOP(transaction.grossAmount)}
                        </Text>
                        <Text style={styles.breakdownText}>
                          -{formatCOP(transaction.platformCommission + transaction.wompiCommission)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={styles.transactionAmount}>
                      +{formatCOP(transaction.netAmount)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(transaction.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(transaction.status) },
                        ]}
                      >
                        {getStatusText(transaction.status)}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colors.text.tertiary}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.transactionRow}
                  onPress={() => handleDownloadReceipt(transaction)}
                >
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIcon,
                        { backgroundColor: colors.error + '10' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="bank-transfer-out"
                        size={20}
                        color={colors.error}
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>Retiro a banco</Text>
                      <Text style={styles.transactionSubtitle}>
                        {transaction.bankName} {transaction.accountNumber}
                      </Text>
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: colors.error }]}>
                      {formatCOP(transaction.amount)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(transaction.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(transaction.status) },
                        ]}
                      >
                        {getStatusText(transaction.status)}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colors.text.tertiary}
                    />
                  </View>
                </TouchableOpacity>
              )}
              {index < transactions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  withdrawButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 20,
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
  },
  balanceItemLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  balanceDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  periodButtonTextActive: {
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginLeft: 12,
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  earningLabel: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
  },
  earningValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  earningLabelFee: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  earningValueFee: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
  earningLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  earningValueTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  projectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectionItem: {
    flex: 1,
    alignItems: 'center',
  },
  projectionLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  projectionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  projectionGrowth: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  projectionDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  transactionSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  transactionBreakdown: {
    flexDirection: 'row',
    gap: 8,
  },
  breakdownText: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProviderFinancialScreen;
