import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const SubscriptionScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 79000,
      originalPrice: 99000,
      services: 2,
      discount: 20,
      color: colors.primary,
      icon: 'star-outline',
      features: [
        '2 servicios mensuales',
        '20% de descuento',
        'Prioridad estándar',
        'Cancelación flexible',
        'Sin cargos de emergencia',
      ],
      badge: null,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 139000,
      originalPrice: 199000,
      services: 4,
      discount: 30,
      color: colors.secondary,
      icon: 'star',
      features: [
        '4 servicios mensuales',
        '30% de descuento',
        'Alta prioridad',
        'Mismo proveedor siempre',
        'Emergencias sin cargo extra',
        'Productos premium incluidos',
        'Soporte 24/7',
      ],
      badge: 'MÁS POPULAR',
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 249000,
      originalPrice: 399000,
      services: 8,
      discount: 40,
      color: '#FFD700',
      icon: 'crown',
      features: [
        '8 servicios mensuales',
        '40% de descuento',
        'Máxima prioridad',
        'Mayordomo virtual dedicado',
        'Servicios ilimitados de emergencia',
        'Productos premium + eco-friendly',
        'Concierge personal',
        'Regalos exclusivos',
      ],
      badge: 'EXCLUSIVO',
    },
  ];

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.id === selectedPlan);
    Alert.alert(
      '✨ Confirmación de suscripción',
      `Estás a punto de suscribirte al plan ${plan.name} por ${formatCOP(plan.price)}/mes.\n\nBeneficios:\n• ${plan.services} servicios mensuales\n• ${plan.discount}% de descuento\n• Y mucho más...`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Suscribirse',
          onPress: () => {
            Alert.alert(
              '🎉 ¡Bienvenido a CleanHome Premium!',
              'Tu suscripción está activa. Disfruta de todos los beneficios.',
              [{ text: 'Comenzar', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  const renderPlan = (plan) => {
    const isSelected = selectedPlan === plan.id;

    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected && styles.planCardSelected,
          { borderColor: plan.color },
        ]}
        onPress={() => setSelectedPlan(plan.id)}
        activeOpacity={0.8}
      >
        {plan.badge && (
          <View style={[styles.badge, { backgroundColor: plan.color }]}>
            <Text style={styles.badgeText}>{plan.badge}</Text>
          </View>
        )}

        <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
          <MaterialCommunityIcons name={plan.icon} size={32} color={plan.color} />
        </View>

        <Text style={styles.planName}>{plan.name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>{formatCOP(plan.originalPrice)}</Text>
          <Text style={[styles.price, { color: plan.color }]}>{formatCOP(plan.price)}</Text>
          <Text style={styles.period}>/mes</Text>
        </View>

        <View style={styles.savingsContainer}>
          <MaterialCommunityIcons name="tag" size={16} color={colors.success} />
          <Text style={styles.savingsText}>
            Ahorras {formatCOP(plan.originalPrice - plan.price)}/mes
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={isSelected ? plan.color : colors.textSecondary}
              />
              <Text
                style={[
                  styles.featureText,
                  isSelected && { color: colors.textDark, fontWeight: '600' },
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: plan.color }]}>
            <MaterialCommunityIcons name="check" size={20} color={colors.white} />
            <Text style={styles.selectedText}>Seleccionado</Text>
          </View>
        )}
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Suscripciones</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <MaterialCommunityIcons name="crown" size={48} color={colors.secondary} />
          <Text style={styles.heroTitle}>Ahorra hasta 40% con membresías</Text>
          <Text style={styles.heroSubtitle}>
            Servicios regulares más económicos, prioridad en agenda y beneficios exclusivos
          </Text>
        </View>

        {/* Comparison */}
        <View style={styles.comparisonCard}>
          <View style={styles.comparisonRow}>
            <MaterialCommunityIcons name="close-circle" size={20} color={colors.error} />
            <Text style={styles.comparisonText}>
              Sin suscripción: 4 servicios = {formatCOP(272000)} (precio regular {formatCOP(68000)}/servicio)
            </Text>
          </View>
          <View style={styles.comparisonRow}>
            <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
            <Text style={styles.comparisonText}>
              Con Premium: 4 servicios = {formatCOP(139000)} (¡50% de ahorro!)
            </Text>
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>{plans.map(renderPlan)}</View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="crown" size={20} color={colors.white} />
          <Text style={styles.subscribeButtonText}>
            Suscribirse a {plans.find((p) => p.id === selectedPlan)?.name}
          </Text>
        </TouchableOpacity>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Beneficios de todas las membresías</Text>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="calendar-check" size={20} color={colors.primary} />
            <Text style={styles.benefitText}>Cancelación en cualquier momento</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="shield-check" size={20} color={colors.primary} />
            <Text style={styles.benefitText}>Garantía de satisfacción 100%</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="gift" size={20} color={colors.primary} />
            <Text style={styles.benefitText}>Primer mes con 15% adicional de descuento</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons name="account-heart" size={20} color={colors.primary} />
            <Text style={styles.benefitText}>Mismo proveedor de confianza</Text>
          </View>
        </View>

        {/* FAQ Link */}
        <TouchableOpacity style={styles.faqButton}>
          <MaterialCommunityIcons name="help-circle" size={20} color={colors.primary} />
          <Text style={styles.faqText}>¿Preguntas sobre las suscripciones?</Text>
        </TouchableOpacity>
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
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  comparisonCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  comparisonText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 3,
    borderColor: colors.borderLight,
    position: 'relative',
  },
  planCardSelected: {
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  planIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
  },
  period: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  benefitsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  faqText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SubscriptionScreen;
