import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const { width } = Dimensions.get('window');

const AnalyticsDashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [animatedValue] = useState(new Animated.Value(0));

  const periods = [
    { id: 'day', label: 'Hoy', icon: 'calendar-today' },
    { id: 'week', label: 'Semana', icon: 'calendar-week' },
    { id: 'month', label: 'Mes', icon: 'calendar-month' },
    { id: 'year', label: 'Año', icon: 'calendar' },
  ];

  // Datos simulados de analytics
  const analytics = {
    day: {
      earnings: { current: 156, previous: 134, change: 16.4 },
      jobs: { current: 4, previous: 3, change: 33.3 },
      rating: { current: 4.9, previous: 4.8, change: 2.1 },
      hours: { current: 6.5, previous: 5.2, change: 25.0 },
    },
    week: {
      earnings: { current: 1248, previous: 1089, change: 14.6 },
      jobs: { current: 28, previous: 24, change: 16.7 },
      rating: { current: 4.9, previous: 4.7, change: 4.3 },
      hours: { current: 42.5, previous: 38.2, change: 11.3 },
    },
    month: {
      earnings: { current: 4856, previous: 4234, change: 14.7 },
      jobs: { current: 112, previous: 98, change: 14.3 },
      rating: { current: 4.8, previous: 4.6, change: 4.3 },
      hours: { current: 168.5, previous: 152.8, change: 10.3 },
    },
    year: {
      earnings: { current: 52430, previous: 47891, change: 9.5 },
      jobs: { current: 1247, previous: 1134, change: 10.0 },
      rating: { current: 4.8, previous: 4.5, change: 6.7 },
      hours: { current: 1856.5, previous: 1723.2, change: 7.7 },
    },
  };

  const topServices = [
    { id: 1, name: 'Limpieza Profunda', jobs: 45, earnings: 2340, percentage: 35 },
    { id: 2, name: 'Express 60min', jobs: 38, earnings: 1520, percentage: 28 },
    { id: 3, name: 'Oficinas', jobs: 22, earnings: 1876, percentage: 20 },
    { id: 4, name: 'Eco-friendly', jobs: 18, earnings: 1245, percentage: 17 },
  ];

  const recentFeedback = [
    {
      id: 1,
      client: 'María González',
      rating: 5,
      comment: 'Excelente trabajo, muy profesional y detallista',
      service: 'Limpieza Profunda',
      date: '2024-11-15',
    },
    {
      id: 2,
      client: 'Carlos Ruiz',
      rating: 5,
      comment: 'Rápido y eficiente, recomiendo 100%',
      service: 'Express 60min',
      date: '2024-11-14',
    },
    {
      id: 3,
      client: 'Ana Martínez',
      rating: 4,
      comment: 'Buen servicio, llegó puntual',
      service: 'Oficinas',
      date: '2024-11-13',
    },
  ];

  const weeklyEarnings = [
    { day: 'L', amount: 175, max: 250 },
    { day: 'M', amount: 220, max: 250 },
    { day: 'X', amount: 190, max: 250 },
    { day: 'J', amount: 245, max: 250 },
    { day: 'V', amount: 210, max: 250 },
    { day: 'S', amount: 185, max: 250 },
    { day: 'D', amount: 23, max: 250 },
  ];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const getCurrentData = () => analytics[selectedPeriod];

  const formatCurrency = (amount) => formatCOP(amount);

  const getChangeColor = (change) => {
    return change >= 0 ? colors.success : colors.error;
  };

  const renderMetricCard = (title, icon, value, previousValue, change, prefix = '', suffix = '') => (
    <Animated.View
      style={[
        styles.metricCard,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.metricHeader}>
        <View style={styles.metricIcon}>
          <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricValue}>
          {prefix === '$' && suffix.includes('COP')
            ? formatCOP(value)
            : `${prefix}${typeof value === 'number' ? value.toLocaleString('es-CO') : value}${suffix}`}
        </Text>
        <View style={styles.metricChange}>
          <MaterialCommunityIcons
            name={change >= 0 ? 'trending-up' : 'trending-down'}
            size={14}
            color={getChangeColor(change)}
          />
          <Text style={[styles.changeText, { color: getChangeColor(change) }]}>
            {Math.abs(change).toFixed(1)}%
          </Text>
        </View>
      </View>
      <Text style={styles.metricPrevious}>
        Anterior: {prefix === '$' && suffix.includes('COP')
          ? formatCOP(previousValue)
          : `${prefix}${typeof previousValue === 'number' ? previousValue.toLocaleString('es-CO') : previousValue}${suffix}`}
      </Text>
    </Animated.View>
  );

  const renderChart = () => (
    <Animated.View
      style={[
        styles.chartContainer,
        {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.chartTitle}>📊 Ganancias esta semana</Text>
      <View style={styles.chart}>
        {weeklyEarnings.map((item, index) => (
          <View key={index} style={styles.chartBar}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(item.amount / item.max) * 100}%`,
                    backgroundColor: item.amount > 200 ? colors.success : colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.day}</Text>
            <Text style={styles.barValue}>{formatCOP(item.amount)}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderTopServices = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🏆 Servicios más populares</Text>
      {topServices.map((service, index) => (
        <View key={service.id} style={styles.serviceItem}>
          <View style={styles.serviceRank}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceStats}>
              {service.jobs} trabajos • {formatCurrency(service.earnings)}
            </Text>
          </View>
          <View style={styles.serviceProgress}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${service.percentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{service.percentage}%</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRecentFeedback = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>💬 Comentarios recientes</Text>
      {recentFeedback.map((feedback) => (
        <View key={feedback.id} style={styles.feedbackItem}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.clientName}>{feedback.client}</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <MaterialCommunityIcons
                  key={i}
                  name="star"
                  size={12}
                  color={i < feedback.rating ? '#FFD700' : colors.textMuted}
                />
              ))}
            </View>
          </View>
          <Text style={styles.feedbackComment}>"{feedback.comment}"</Text>
          <View style={styles.feedbackFooter}>
            <Text style={styles.feedbackService}>{feedback.service}</Text>
            <Text style={styles.feedbackDate}>{feedback.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderGoals = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎯 Objetivos del mes</Text>
      <View style={styles.goalItem}>
        <Text style={styles.goalLabel}>Ingresos objetivo: {formatCOP(5000)}</Text>
        <View style={styles.goalProgress}>
          <View style={styles.goalBar}>
            <View style={[styles.goalFill, { width: '97%' }]} />
          </View>
          <Text style={styles.goalText}>{formatCOP(4856)} (97%)</Text>
        </View>
      </View>
      <View style={styles.goalItem}>
        <Text style={styles.goalLabel}>Trabajos objetivo: 120</Text>
        <View style={styles.goalProgress}>
          <View style={styles.goalBar}>
            <View style={[styles.goalFill, { width: '93%' }]} />
          </View>
          <Text style={styles.goalText}>112 (93%)</Text>
        </View>
      </View>
      <View style={styles.goalItem}>
        <Text style={styles.goalLabel}>Rating objetivo: 4.9</Text>
        <View style={styles.goalProgress}>
          <View style={styles.goalBar}>
            <View style={[styles.goalFill, { width: '98%' }]} />
          </View>
          <Text style={styles.goalText}>4.8 (98%)</Text>
        </View>
      </View>
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textLight} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>Panel de control y métricas</Text>
          </View>
          <TouchableOpacity style={styles.exportButton}>
            <MaterialCommunityIcons name="download" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <MaterialCommunityIcons
                name={period.icon}
                size={16}
                color={selectedPeriod === period.id ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Metrics Cards */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Ganancias',
            'currency-usd',
            getCurrentData().earnings.current,
            getCurrentData().earnings.previous,
            getCurrentData().earnings.change,
            '$',
            ' COP'
          )}
          {renderMetricCard(
            'Trabajos',
            'briefcase',
            getCurrentData().jobs.current,
            getCurrentData().jobs.previous,
            getCurrentData().jobs.change
          )}
          {renderMetricCard(
            'Rating',
            'star',
            getCurrentData().rating.current,
            getCurrentData().rating.previous,
            getCurrentData().rating.change,
            '',
            '/5'
          )}
          {renderMetricCard(
            'Horas',
            'clock',
            getCurrentData().hours.current,
            getCurrentData().hours.previous,
            getCurrentData().hours.change,
            '',
            'h'
          )}
        </View>

        {/* Chart */}
        {selectedPeriod === 'week' && renderChart()}

        {/* Top Services */}
        {renderTopServices()}

        {/* Goals */}
        {renderGoals()}

        {/* Recent Feedback */}
        {renderRecentFeedback()}

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights inteligentes</Text>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="trending-up" size={20} color={colors.success} />
            <Text style={styles.insightText}>
              Tus ganancias han aumentado 14.6% esta semana. ¡Excelente trabajo!
            </Text>
          </View>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="clock" size={20} color={colors.warning} />
            <Text style={styles.insightText}>
              Los viernes son tu día más productivo. Considera aumentar disponibilidad.
            </Text>
          </View>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="star" size={20} color={colors.primary} />
            <Text style={styles.insightText}>
              Tu rating promedio está en 4.9. ¡Mantén la excelencia!
            </Text>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  exportButton: {
    padding: 4,
  },
  periodSelector: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  periodButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: colors.primary,
  },
  periodText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  periodTextActive: {
    color: colors.textLight,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: (width - 52) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricValue: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricPrevious: {
    color: colors.textMuted,
    fontSize: 10,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chartTitle: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
  },
  barLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  barValue: {
    color: colors.textLight,
    fontSize: 9,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  serviceRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  serviceStats: {
    color: colors.textMuted,
    fontSize: 12,
  },
  serviceProgress: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: '600',
  },
  feedbackItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  feedbackComment: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 18,
  },
  feedbackFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedbackService: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  feedbackDate: {
    color: colors.textMuted,
    fontSize: 11,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalLabel: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  goalText: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '600',
    minWidth: 60,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  insightText: {
    color: colors.textLight,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});

export default AnalyticsDashboardScreen;