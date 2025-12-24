import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { formatCOP } from '../utils/currency';

const InventoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: 'apps' },
    { id: 'cleaning', name: 'Limpieza', icon: 'spray-bottle' },
    { id: 'disinfection', name: 'Desinfección', icon: 'shield-check' },
    { id: 'equipment', name: 'Equipos', icon: 'toolbox' },
    { id: 'eco', name: 'Eco-friendly', icon: 'leaf' },
  ];

  const products = [
    {
      id: 1,
      name: 'Desengrasante Profesional',
      category: 'cleaning',
      brand: 'Mr. Muscle',
      quantity: 3,
      unit: 'litros',
      minStock: 2,
      status: 'good',
      price: 28500,
      lastUsed: '2024-11-20',
      usageRate: 0.5, // litros por servicio
      estimatedDays: 12,
    },
    {
      id: 2,
      name: 'Desinfectante hospitalario',
      category: 'disinfection',
      brand: 'Lysol',
      quantity: 1,
      unit: 'litros',
      minStock: 2,
      status: 'low',
      price: 35000,
      lastUsed: '2024-11-22',
      usageRate: 0.3,
      estimatedDays: 6,
    },
    {
      id: 3,
      name: 'Limpiador multiusos eco',
      category: 'eco',
      brand: 'Seventh Generation',
      quantity: 5,
      unit: 'litros',
      minStock: 3,
      status: 'good',
      price: 42000,
      lastUsed: '2024-11-23',
      usageRate: 0.4,
      estimatedDays: 25,
    },
    {
      id: 4,
      name: 'Aspiradora industrial',
      category: 'equipment',
      brand: 'Kärcher',
      quantity: 1,
      unit: 'unidad',
      minStock: 1,
      status: 'good',
      price: 850000,
      lastUsed: '2024-11-24',
      nextMaintenance: '2024-12-15',
      condition: 'excellent',
    },
    {
      id: 5,
      name: 'Paños de microfibra',
      category: 'cleaning',
      brand: 'Generic',
      quantity: 8,
      unit: 'unidades',
      minStock: 10,
      status: 'low',
      price: 15000,
      lastUsed: '2024-11-25',
      usageRate: 2,
      estimatedDays: 8,
    },
  ];

  const stats = {
    totalProducts: 18,
    lowStock: 3,
    totalValue: 2450000,
    monthlyConsumption: 350000,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return colors.success;
      case 'low':
        return colors.warning;
      case 'critical':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'good':
        return 'Stock normal';
      case 'low':
        return 'Stock bajo';
      case 'critical':
        return 'Stock crítico';
      default:
        return 'Sin stock';
    }
  };

  const handleReorder = (product) => {
    Alert.alert(
      '🛒 Reordenar producto',
      `¿Deseas agregar "${product.name}" a tu lista de compras?\n\nCantidad sugerida: ${product.minStock * 2} ${product.unit}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agregar a lista',
          onPress: () => {
            Alert.alert('✅ Agregado', 'Producto agregado a tu lista de compras');
          },
        },
      ]
    );
  };

  const handleQuickOrder = () => {
    const lowStockItems = products.filter((p) => p.status === 'low' || p.status === 'critical');
    Alert.alert(
      '⚡ Orden rápida',
      `Se ordenarán ${lowStockItems.length} productos con stock bajo.\n\nTotal estimado: ${formatCOP(lowStockItems
        .reduce((sum, p) => sum + p.price * 2, 0))}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar orden',
          onPress: () => {
            Alert.alert('🎉 ¡Orden confirmada!', 'Recibirás tus productos en 2-3 días hábiles');
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inventario</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="plus-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="package-variant" size={20} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalProducts}</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </View>
          <View style={[styles.statCard, styles.statCardWarning]}>
            <MaterialCommunityIcons name="alert" size={20} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.warning }]}>{stats.lowStock}</Text>
            <Text style={styles.statLabel}>Stock bajo</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="cash" size={20} color={colors.success} />
            <Text style={styles.statValue}>{formatCOP(stats.totalValue)}</Text>
            <Text style={styles.statLabel}>Valor total</Text>
          </View>
        </View>

        {/* Quick Order */}
        {stats.lowStock > 0 && (
          <TouchableOpacity style={styles.quickOrderBanner} onPress={handleQuickOrder}>
            <View style={styles.quickOrderLeft}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color={colors.secondary} />
              <View>
                <Text style={styles.quickOrderTitle}>Orden rápida disponible</Text>
                <Text style={styles.quickOrderText}>
                  {stats.lowStock} productos necesitan reabastecimiento
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.secondary} />
          </TouchableOpacity>
        )}

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                selectedCategory === cat.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <MaterialCommunityIcons
                name={cat.icon}
                size={18}
                color={selectedCategory === cat.id ? colors.white : colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
          </Text>

          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productLeft}>
                  <View
                    style={[
                      styles.productIcon,
                      { backgroundColor: getStatusColor(product.status) + '20' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={categories.find((c) => c.id === product.category)?.icon || 'package'}
                      size={24}
                      color={getStatusColor(product.status)}
                    />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                  </View>
                </View>

                <View
                  style={[styles.statusBadge, { backgroundColor: getStatusColor(product.status) }]}
                >
                  <Text style={styles.statusText}>{getStatusText(product.status)}</Text>
                </View>
              </View>

              <View style={styles.productMeta}>
                <View style={styles.metaRow}>
                  <MaterialCommunityIcons name="package-variant" size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>
                    Stock: {product.quantity} {product.unit}
                  </Text>
                  {product.status === 'low' && (
                    <Text style={styles.metaWarning}>
                      (Mín: {product.minStock} {product.unit})
                    </Text>
                  )}
                </View>

                {product.estimatedDays && (
                  <View style={styles.metaRow}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.metaText}>
                      Duración estimada: ~{product.estimatedDays} días
                    </Text>
                  </View>
                )}

                {product.nextMaintenance && (
                  <View style={styles.metaRow}>
                    <MaterialCommunityIcons name="wrench" size={16} color={colors.textSecondary} />
                    <Text style={styles.metaText}>
                      Próximo mantenimiento: {new Date(product.nextMaintenance).toLocaleDateString('es-CO')}
                    </Text>
                  </View>
                )}

                <View style={styles.metaRow}>
                  <MaterialCommunityIcons name="calendar" size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>
                    Último uso: {new Date(product.lastUsed).toLocaleDateString('es-CO')}
                  </Text>
                </View>
              </View>

              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>
                  {formatCOP(product.price)}/{product.unit === 'unidad' ? 'und' : 'L'}
                </Text>
                <TouchableOpacity
                  style={styles.reorderButton}
                  onPress={() => handleReorder(product)}
                >
                  <MaterialCommunityIcons name="cart-plus" size={18} color={colors.primary} />
                  <Text style={styles.reorderButtonText}>Reordenar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Shopping List */}
        <TouchableOpacity style={styles.shoppingListButton}>
          <MaterialCommunityIcons name="clipboard-list" size={20} color={colors.white} />
          <Text style={styles.shoppingListText}>Ver lista de compras (5)</Text>
        </TouchableOpacity>

        {/* Analytics */}
        <TouchableOpacity style={styles.analyticsButton}>
          <MaterialCommunityIcons name="chart-bar" size={18} color={colors.primary} />
          <Text style={styles.analyticsText}>Ver análisis de consumo</Text>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statCardWarning: {
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning + '30',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  quickOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quickOrderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  quickOrderText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
    marginLeft: 12,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContent: {
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.white,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  productMeta: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  metaWarning: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '600',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  reorderButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  shoppingListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  shoppingListText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },
  analyticsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default InventoryScreen;
