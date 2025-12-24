import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import notificationService from '../services/notificationService';
import { formatCOP } from '../utils/currency';

const IncomingRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      customerName: 'María González',
      address: 'Calle 123 #45-67, Bogotá',
      serviceType: 'Premium',
      amount: 150000,
      breakdown: {
        total: 150000,
        wompiCommission: 5250,
        platformCommission: 15000,
        providerAmount: 129750,
      },
      date: 'Hoy',
      time: '3:00 PM',
      status: 'pending', // pending, accepted, rejected, counter_offered
    },
    {
      id: 2,
      customerName: 'Carlos Rodríguez',
      address: 'Av. 68 #25-12, Ap 301',
      serviceType: 'Confort',
      amount: 95000,
      breakdown: {
        total: 95000,
        wompiCommission: 3655,
        platformCommission: 9500,
        providerAmount: 81845,
      },
      date: 'Mañana',
      time: '10:00 AM',
      status: 'pending',
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [counterOfferAmount, setCounterOfferAmount] = useState('');

  // Actualizar el badge count cuando cambien las solicitudes pendientes
  useEffect(() => {
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    notificationService.setBadgeCount(pendingCount);
  }, [requests]);

  const calculateBreakdown = (totalAmount) => {
    const WOMPI_FEE = 0.029;
    const WOMPI_FIXED = 900;
    const PLATFORM_FEE = 0.10;
    
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

  const handleAcceptRequest = (request) => {
    Alert.alert(
      'Aceptar solicitud',
      `¿Confirmas que aceptas el servicio por ${formatCOP(request.amount)}?\n\nRecibirás: ${formatCOP(request.breakdown.providerAmount)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: () => {
            setRequests(requests.map(r => 
              r.id === request.id ? { ...r, status: 'accepted' } : r
            ));
            Alert.alert('¡Solicitud aceptada!', 'El cliente ha sido notificado. Recuerda tomar fotos antes y después del servicio.');
            navigation.navigate('PhotoEvidence', { 
              booking: { 
                ...request, 
                service: { title: request.serviceType } 
              } 
            });
          },
        },
      ]
    );
  };

  const handleRejectRequest = (request) => {
    Alert.alert(
      'Rechazar solicitud',
      '¿Estás seguro de que deseas rechazar esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: () => {
            setRequests(requests.map(r => 
              r.id === request.id ? { ...r, status: 'rejected' } : r
            ));
            Alert.alert('Solicitud rechazada', 'El cliente ha sido notificado.');
          },
        },
      ]
    );
  };

  const handleCounterOffer = (request) => {
    setSelectedRequest(request);
    setCounterOfferAmount(request.amount.toString());
    setShowCounterOfferModal(true);
  };

  const submitCounterOffer = () => {
    const newAmount = parseInt(counterOfferAmount);
    
    if (newAmount < 80000) {
      Alert.alert('Error', `El monto mínimo es ${formatCOP(80000)}`);
      return;
    }

    if (newAmount <= selectedRequest.amount) {
      Alert.alert('Error', 'La contraoferta debe ser mayor al monto original');
      return;
    }

    const newBreakdown = calculateBreakdown(newAmount);

    Alert.alert(
      'Enviar contraoferta',
      `Propones ${formatCOP(newAmount)}\n\nRecibirías: ${formatCOP(newBreakdown.providerAmount)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => {
            setRequests(requests.map(r => 
              r.id === selectedRequest.id 
                ? { ...r, status: 'counter_offered', counterOffer: newAmount, breakdown: newBreakdown } 
                : r
            ));
            setShowCounterOfferModal(false);
            setCounterOfferAmount('');
            Alert.alert('Contraoferta enviada', 'El cliente decidirá si acepta tu propuesta.');
          },
        },
      ]
    );
  };

  const formatInputCOP = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return colors.success;
      case 'rejected': return colors.error;
      case 'counter_offered': return colors.warning;
      default: return colors.info;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'counter_offered': return 'Contraoferta enviada';
      default: return 'Pendiente';
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Solicitudes</Text>
          <View style={styles.badgeContainer}>
            {pendingRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Pending Requests */}
        <View style={styles.content}>
          {pendingRequests.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Nuevas solicitudes</Text>
              {pendingRequests.map((request) => (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <View style={styles.customerInfo}>
                      <View style={styles.avatar}>
                        <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.customerName}>{request.customerName}</Text>
                        <Text style={styles.serviceType}>{request.serviceType}</Text>
                      </View>
                    </View>
                    <View style={styles.amountBadge}>
                      <Text style={styles.amountText}>{formatCOP(request.amount, { withSuffix: false })}</Text>
                      <Text style={styles.copText}>COP</Text>
                    </View>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="map-marker" size={18} color={colors.textMuted} />
                      <Text style={styles.detailText}>{request.address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="clock-outline" size={18} color={colors.textMuted} />
                      <Text style={styles.detailText}>{request.date} • {request.time}</Text>
                    </View>
                  </View>

                  {/* Breakdown */}
                  <View style={styles.breakdown}>
                    <Text style={styles.breakdownTitle}>Desglose de pago</Text>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>Total del cliente</Text>
                      <Text style={styles.breakdownValue}>{formatCOP(request.breakdown.total)}</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>Comisión Wompi</Text>
                      <Text style={styles.breakdownFee}>-{formatCOP(request.breakdown.wompiCommission)}</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>Comisión plataforma</Text>
                      <Text style={styles.breakdownFee}>-{formatCOP(request.breakdown.platformCommission)}</Text>
                    </View>
                    <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                      <Text style={styles.breakdownLabelTotal}>Tú recibes</Text>
                      <Text style={styles.breakdownValueTotal}>{formatCOP(request.breakdown.providerAmount)}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.rejectButton}
                      onPress={() => handleRejectRequest(request)}
                    >
                      <MaterialCommunityIcons name="close" size={20} color={colors.error} />
                      <Text style={styles.rejectButtonText}>Rechazar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.counterButton}
                      onPress={() => handleCounterOffer(request)}
                    >
                      <MaterialCommunityIcons name="cash-plus" size={20} color={colors.warning} />
                      <Text style={styles.counterButtonText}>Contraofertar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.acceptButton}
                      onPress={() => handleAcceptRequest(request)}
                    >
                      <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                      <Text style={styles.acceptButtonText}>Aceptar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="inbox" size={64} color={colors.textMuted} />
              <Text style={styles.emptyText}>No hay solicitudes pendientes</Text>
            </View>
          )}

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Historial</Text>
              {processedRequests.map((request) => (
                <View key={request.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View>
                      <Text style={styles.historyCustomer}>{request.customerName}</Text>
                      <Text style={styles.historyService}>{request.serviceType}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                    </View>
                  </View>
                  <Text style={styles.historyAmount}>{formatCOP(request.amount)}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Counter Offer Modal */}
      <Modal
        visible={showCounterOfferModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCounterOfferModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hacer contraoferta</Text>
              <TouchableOpacity onPress={() => setShowCounterOfferModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <>
                <Text style={styles.modalLabel}>Monto original: {formatCOP(selectedRequest.amount)}</Text>
                <Text style={styles.modalHint}>Propón un monto mayor</Text>

                <View style={styles.modalInput}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.counterInput}
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    value={counterOfferAmount}
                    onChangeText={(text) => setCounterOfferAmount(formatInputCOP(text))}
                    keyboardType="numeric"
                  />
                  <Text style={styles.currency}>COP</Text>
                </View>

                {counterOfferAmount && parseInt(counterOfferAmount.replace(/\D/g, '')) > selectedRequest.amount && (
                  <View style={styles.modalBreakdown}>
                    <Text style={styles.modalBreakdownTitle}>Con este monto recibirías:</Text>
                    <Text style={styles.modalBreakdownAmount}>
                      {formatCOP(calculateBreakdown(parseInt(counterOfferAmount.replace(/\D/g, ''))).providerAmount)}
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={styles.submitButton} onPress={submitCounterOffer}>
                  <Text style={styles.submitButtonText}>Enviar contraoferta</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  badgeContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  serviceType: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 2,
  },
  amountBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  copText: {
    fontSize: 11,
    color: colors.primary,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  breakdown: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  breakdownFee: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
    marginTop: 4,
  },
  breakdownLabelTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  breakdownValueTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.error + '15',
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  counterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.warning + '15',
    gap: 6,
  },
  counterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warning,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.success,
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 16,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyCustomer: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },
  historyService: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  modalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modalHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 16,
  },
  modalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textDark,
    marginRight: 8,
  },
  counterInput: {
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
  modalBreakdown: {
    backgroundColor: colors.success + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalBreakdownTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modalBreakdownAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.success,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});

export default IncomingRequestsScreen;
