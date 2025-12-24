import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import ModernButton from '../components/ModernButton';
import { colors } from '../theme/colors';

const ColorPaletteScreen = ({ navigation }) => {
  const colorSections = [
    {
      title: 'Paleta Principal - Elegante y Profesional ✨',
      description: 'Ideal para una app que inspire limpieza y confianza',
      colors: [
        { name: 'Primario', code: '#3EB8C2', color: colors.primary, text: colors.white, description: 'Azul claro principal' },
        { name: 'Azul Petróleo', code: '#1A5F7A', color: colors.primaryDark, text: colors.white, description: 'Detalles y acentos' },
        { name: 'Verde Menta', code: '#A0E8AF', color: colors.secondary, text: colors.textDark, description: 'Secundario fresco' },
        { name: 'Blanco Nieve', code: '#F9FBFD', color: colors.background, text: colors.textDark, description: 'Fondo principal' },
        { name: 'Gris Carbón', code: '#333333', color: colors.textDark, text: colors.white, description: 'Texto principal' },
      ]
    },
    {
      title: 'Colores de Estado',
      colors: [
        { name: 'Éxito', code: '#A0E8AF', color: colors.success, text: colors.textDark, description: 'Verde menta para éxito' },
        { name: 'Error', code: '#F87171', color: colors.error, text: colors.white, description: 'Rojo suave para errores' },
        { name: 'Advertencia', code: '#FCD34D', color: colors.warning, text: colors.textDark, description: 'Amarillo para avisos' },
        { name: 'Información', code: '#3EB8C2', color: colors.info, text: colors.white, description: 'Azul claro para info' },
      ]
    },
    {
      title: 'Fondos y Superficies',
      colors: [
        { name: 'Fondo Principal', code: '#F9FBFD', color: colors.background, text: colors.textDark, description: 'Blanco nieve' },
        { name: 'Fondo Alternativo', code: '#FFFFFF', color: colors.backgroundAlt, text: colors.textDark, description: 'Blanco puro' },
        { name: 'Superficie', code: '#FFFFFF', color: colors.surface, text: colors.textDark, description: 'Blanco para tarjetas' },
        { name: 'Superficie Alt', code: '#F9FBFD', color: colors.surfaceAlt, text: colors.textDark, description: 'Alternativo' },
      ]
    },
    {
      title: 'Textos',
      colors: [
        { name: 'Text Primary', code: '#1A1A1A', color: colors.textPrimary, text: colors.white },
        { name: 'Text Secondary', code: '#4A5568', color: colors.textSecondary, text: colors.white },
        { name: 'Text Tertiary', code: '#718096', color: colors.textTertiary, text: colors.white },
        { name: 'Text Muted', code: '#A0AEC0', color: colors.textMuted, text: colors.white },
        { name: 'Text Light', code: '#E2E8F0', color: colors.textLight, text: colors.textDark },
        { name: 'Text Dark', code: '#2D3748', color: colors.textDark, text: colors.white },
      ]
    },
    {
      title: 'Colores de Texto',
      colors: [
        { name: 'Texto Principal', code: '#333333', color: colors.textDark, text: colors.white, description: 'Gris carbón para títulos' },
        { name: 'Texto Secundario', code: '#6B7280', color: colors.textSecondary, text: colors.white, description: 'Para subtítulos' },
        { name: 'Texto Silenciado', code: '#9CA3AF', color: colors.textMuted, text: colors.white, description: 'Para placeholders' },
        { name: 'Texto Claro', code: '#FFFFFF', color: colors.textLight, text: colors.textDark, description: 'Para fondos oscuros' },
      ]
    },
    {
      title: 'Elementos de UI',
      colors: [
        { name: 'Borde', code: '#E5E7EB', color: colors.border, text: colors.textDark, description: 'Bordes sutiles' },
        { name: 'Borde Claro', code: '#F3F4F6', color: colors.borderLight, text: colors.textDark, description: 'Bordes muy suaves' },
        { name: 'Borde Oscuro', code: '#D1D5DB', color: colors.borderDark, text: colors.textDark, description: 'Bordes definidos' },
        { name: 'Blanco', code: '#FFFFFF', color: colors.white, text: colors.textDark, description: 'Blanco puro' },
        { name: 'Negro', code: '#000000', color: colors.black, text: colors.white, description: 'Negro puro' },
      ]
    }
  ];

  const renderColorCard = (colorItem, index) => (
    <View 
      key={index} 
      style={[
        styles.colorCard, 
        { backgroundColor: colorItem.color },
        colorItem.border && { borderWidth: 2, borderColor: colors.border }
      ]}
    >
      <View style={styles.colorInfo}>
        <Text style={[styles.colorName, { color: colorItem.text }]}>
          {colorItem.name}
        </Text>
        {colorItem.code && (
          <Text style={[styles.colorCode, { color: colorItem.text }]}>
            {colorItem.code}
          </Text>
        )}
        {colorItem.description && (
          <Text style={[styles.colorDescription, { color: colorItem.text, opacity: 0.8 }]}>
            {colorItem.description}
          </Text>
        )}
      </View>
    </View>
  );

  const renderSection = (section, sectionIndex) => (
    <View key={sectionIndex} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.colorsGrid}>
        {section.colors.map(renderColorCard)}
      </View>
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="palette" 
            size={48} 
            color={colors.primary} 
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.title}>CleanHome - Paleta Elegante</Text>
          <Text style={styles.subtitle}>
            🧹 Paleta inspirada en limpieza y profesionalismo
          </Text>
          <View style={styles.palettePreview}>
            <View style={[styles.previewCircle, { backgroundColor: colors.primary }]} />
            <View style={[styles.previewCircle, { backgroundColor: colors.primaryDark }]} />
            <View style={[styles.previewCircle, { backgroundColor: colors.secondary }]} />
            <View style={[styles.previewCircle, { backgroundColor: colors.background }]} />
            <View style={[styles.previewCircle, { backgroundColor: colors.textDark }]} />
          </View>
        </View>

        {colorSections.map(renderSection)}

        <View style={styles.buttonsSection}>
          <Text style={styles.sectionTitle}>Botones de Ejemplo</Text>
          
          <ModernButton
            title="Botón Primario"
            variant="primary"
            icon="check"
            onPress={() => {}}
            style={{ marginBottom: 12 }}
          />
          
          <ModernButton
            title="Botón Secundario"
            variant="secondary"
            icon="heart"
            onPress={() => {}}
            style={{ marginBottom: 12 }}
          />
          
          <ModernButton
            title="Botón Outline"
            variant="outline"
            icon="star"
            onPress={() => {}}
            style={{ marginBottom: 12 }}
          />
          
          <ModernButton
            title="Botón Ghost"
            variant="ghost"
            icon="home"
            onPress={() => {}}
            style={{ marginBottom: 12 }}
          />
        </View>

        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Tarjetas de Ejemplo</Text>
          
          <View style={styles.exampleCard}>
            <MaterialCommunityIcons name="broom" size={32} color={colors.primary} />
            <Text style={styles.cardTitle}>Limpieza Profunda</Text>
            <Text style={styles.cardSubtitle}>Servicio completo para tu hogar</Text>
            <Text style={styles.cardPrice}>Desde $80,000 COP</Text>
          </View>
          
          <View style={styles.exampleCard}>
            <MaterialCommunityIcons name="lightning-bolt" size={32} color={colors.warning} />
            <Text style={styles.cardTitle}>Servicio Express</Text>
            <Text style={styles.cardSubtitle}>Limpieza rápida en 60 minutos</Text>
            <Text style={styles.cardPrice}>Desde $80,000 COP</Text>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  palettePreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  previewCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
    minHeight: 120,
  },
  colorInfo: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  colorName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  colorCode: {
    fontSize: 11,
    opacity: 0.9,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 4,
  },
  colorDescription: {
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
    marginTop: 2,
  },
  buttonsSection: {
    marginBottom: 30,
  },
  cardsSection: {
    marginBottom: 30,
  },
  exampleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default ColorPaletteScreen;