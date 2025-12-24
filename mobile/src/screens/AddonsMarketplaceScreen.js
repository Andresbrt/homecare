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

const AddonsMarketplaceScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const categories = [
    { id: 'all', name: 'Todos', icon: 'apps' },
    { id: 'deep', name: 'Profunda', icon: 'spray' },
    { id: 'special', name: 'Especial', icon: 'star' },
    { id: 'maintenance', name: 'Mantenimiento', icon: 'wrench' },
    { id: 'eco', name: 'Eco', icon: 'leaf' },
  ];

  const addons = [
    {
      id: 1,
      name: 'Limpieza de horno',
      category: 'deep',
      description: 'Limpieza profunda de horno interior y exterior',
      duration: '30 min',
      price: 25000,
      rating: 4.8,
      popular: true,
      icon: 'stove',
      color: '#FF6B00',
    },
    {
      id: 2,
      name: 'Limpieza de nevera',
      category: 'deep',
      description: 'Descongelado y limpieza completa interior/exterior',
      duration: '45 min',
      price: 30000,
      rating: 4.9,
      popular: true,
      icon: 'fridge',
      color: colors.primary,
    },
    {
      id: 3,
      name: 'Ventanas completas',
      category: 'special',
      description: 'Limpieza de ventanas por dentro y por fuera',
      duration: '60 min',
      price: 35000,
      rating: 4.7,
      icon: 'window-closed',
      color: '#00BCD4',
    },
    {
      id: 4,
      name: 'Lavado de cortinas',
      category: 'special',
      description: 'Desmontaje, lavado y montaje de cortinas',
      duration: '90 min',
      price: 45000,
      rating: 4.6,
      icon: 'curtains',
      color: '#9C27B0',
    },
    {
      id: 5,
      name: 'Limpieza de alfombras',
      category: 'deep',
      description: 'Aspirado profundo y limpieza con máquina',
      duration: '45 min',
      price: 40000,
      rating: 4.8,
      popular: true,
      icon: 'rug',
      color: '#795548',
    },
    {
      id: 6,
      name: 'Desinfección total',
      category: 'special',
      description: 'Desinfección hospitalaria de todas las superficies',
      duration: '30 min',
      price: 35000,
      rating: 5.0,
      icon: 'bacteria',
      color: colors.error,
    },
    {
      id: 7,
      name: 'Limpieza de balcón/terraza',
      category: 'maintenance',
      description: 'Barrido, lavado y organización',
      duration: '40 min',
      price: 28000,
      rating: 4.5,
      icon: 'balcony',
      color: '#4CAF50',
    },
    {
      id: 8,
      name: 'Productos eco-friendly',
      category: 'eco',
      description: 'Uso exclusivo de productos biodegradables',
      duration: '+0 min',
      price: 15000,
      rating: 4.9,
      icon: 'leaf',
      color: '#8BC34A',
    },
    {
      id: 9,
      name: 'Interior de closets',
      category: 'deep',
      description: 'Organización y limpieza profunda de closets',
      duration: '50 min',
      price: 32000,
      rating: 4.7,
      icon: 'hanger',
      color: '#FF9800',
    },
    {
      id: 10,
      name: 'Planchado de ropa',
      category: 'special',
      description: 'Servicio de planchado hasta 15 prendas',
      duration: '60 min',
      price: 38000,
      rating: 4.6,
      icon: 'iron',
      color: '#607D8B',
    },
  ];

  const toggleCart = (addon) => {
    const existingItem = cart.find((item) => item.id === addon.id);
    if (existingItem) {
      setCart(cart.filter((item) => item.id !== addon.id));
    } else {
      setCart([...cart, { ...addon, quantity: 1 }]);
    }
  };

  const isInCart = (addonId) => cart.some((item) => item.id === addonId);

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega servicios adicionales para continuar');
      return;
    }

    Alert.alert(
      '✨ Confirmar add-ons',
      `${cart.length} servicio${cart.length > 1 ? 's' : ''} adicional${
        cart.length > 1 ? 'es' : ''
      }\n\nTotal: ${formatCOP(getCartTotal())}\n\n¿Agregar a tu próximo servicio?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            Alert.alert('🎉 ¡Agregado!', 'Los servicios se agregaron a tu reserva');
            setCart([]);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const filteredAddons = addons.filter((addon) => {
    const matchesSearch = addon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || addon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularAddons = addons.filter((a) => a.popular);

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Servicios Adicionales</Text>
          <TouchableOpacity onPress={() => cart.length > 0 && handleCheckout()}>
            <View>
              <MaterialCommunityIcons
                name="cart"
                size={24}
                color={cart.length > 0 ? colors.primary : colors.textSecondary}
              />
              {cart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cart.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <MaterialCommunityIcons name="plus-circle" size={40} color={colors.secondary} />
          <Text style={styles.heroTitle}>Personaliza tu servicio</Text>
          <Text style={styles.heroSubtitle}>
            Agrega servicios especializados para un resultado perfecto
          </Text>
        </View>

        {/* Popular */}
        {searchQuery === '' && selectedCategory === 'all' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="fire" size={20} color={colors.secondary} />
              <Text style={styles.sectionTitle}>Más solicitados</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularScroll}
            >
              {popularAddons.map((addon) => (
                <TouchableOpacity
                  key={addon.id}
                  style={styles.popularCard}
                  onPress={() => toggleCart(addon)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.popularIcon, { backgroundColor: addon.color + '20' }]}>
                    <MaterialCommunityIcons name={addon.icon} size={28} color={addon.color} />
                  </View>
                  <Text style={styles.popularName}>{addon.name}</Text>
                  <View style={styles.popularMeta}>
                    <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                    <Text style={styles.popularRating}>{addon.rating}</Text>
                  </View>
                    <Text style={styles.popularPrice}>{formatCOP(addon.price)}</Text>
                  <View
                    style={[
                      styles.popularButton,
                      isInCart(addon.id) && styles.popularButtonAdded,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={isInCart(addon.id) ? 'check' : 'plus'}
                      size={16}
                      color={isInCart(addon.id) ? colors.success : colors.white}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar servicios..."
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

        {/* All Addons */}
        <View style={styles.section}>
          <Text style={styles.resultsTitle}>
            {filteredAddons.length} servicio{filteredAddons.length !== 1 ? 's' : ''}
          </Text>

          {filteredAddons.map((addon) => (
            <View key={addon.id} style={styles.addonCard}>
              <View style={styles.addonLeft}>
                <View style={[styles.addonIcon, { backgroundColor: addon.color + '20' }]}>
                  <MaterialCommunityIcons name={addon.icon} size={32} color={addon.color} />
                </View>
                <View style={styles.addonInfo}>
                  <Text style={styles.addonName}>{addon.name}</Text>
                  <Text style={styles.addonDescription}>{addon.description}</Text>
                  <View style={styles.addonMeta}>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.metaText}>{addon.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                      <Text style={styles.metaText}>{addon.rating}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.addonRight}>
                <Text style={styles.addonPrice}>{formatCOP(addon.price)}</Text>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    isInCart(addon.id) && styles.addButtonAdded,
                  ]}
                  onPress={() => toggleCart(addon)}
                >
                  <MaterialCommunityIcons
                    name={isInCart(addon.id) ? 'check' : 'plus'}
                    size={20}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartSummary}>
            <Text style={styles.cartSummaryLabel}>{cart.length} servicio(s) agregado(s)</Text>
            <Text style={styles.cartSummaryTotal}>{formatCOP(getCartTotal())}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Agregar a reserva</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 140,
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
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
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
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
  },
  popularScroll: {
    gap: 12,
    paddingRight: 24,
  },
  popularCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
  },
  popularIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'center',
  },
  popularName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
    minHeight: 36,
  },
  popularMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  popularRating: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  popularPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  popularButton: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
  },
  popularButtonAdded: {
    backgroundColor: colors.success,
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
  resultsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  addonCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  addonLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  addonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addonInfo: {
    flex: 1,
  },
  addonName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  addonDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  addonMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addonRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  addonPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonAdded: {
    backgroundColor: colors.success,
  },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartSummaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cartSummaryTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});

export default AddonsMarketplaceScreen;
