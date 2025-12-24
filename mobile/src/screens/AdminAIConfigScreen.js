import React, { useEffect, useState, useContext } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { fetchAiConfig, updateAiConfig } from '../services/configService';

const AdminAIConfigScreen = ({ navigation }) => {
  const { token, user } = useContext(AuthContext);
  const [enabled, setEnabled] = useState(true);
  const [model, setModel] = useState('gpt-5.1-codex-max');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const cfg = await fetchAiConfig();
      if (cfg) {
        setEnabled(typeof cfg.enabled === 'boolean' ? cfg.enabled : true);
        if (cfg.model) setModel(cfg.model);
      }
      setLoading(false);
    })();
  }, []);

  const onSave = async () => {
    try {
      setSaving(true);
      const updated = await updateAiConfig({ token, enabled, model: model.trim() });
      setEnabled(typeof updated.enabled === 'boolean' ? updated.enabled : enabled);
      if (updated.model) setModel(updated.model);
      Alert.alert('Configuración guardada', 'La configuración AI se actualizó correctamente.');
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo actualizar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <GradientBackground>
        <View style={styles.centered}> 
          <MaterialCommunityIcons name="lock" size={32} color={colors.textLight} />
          <Text style={styles.lockText}>Acceso restringido a administradores</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textLight} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Configuración AI</Text>
            <Text style={styles.subtitle}>Alterna el uso global y define el modelo.</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Cargando configuración...</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.row}> 
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Habilitar asistente AI</Text>
                <Text style={styles.help}>Si está apagado, el chatbot no responderá.</Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                thumbColor={enabled ? colors.primary : '#d9d9d9'}
                trackColor={{ true: 'rgba(76,110,245,0.4)', false: 'rgba(255,255,255,0.2)' }}
              />
            </View>

            <Text style={styles.label}>Modelo</Text>
            <TextInput
              value={model}
              onChangeText={setModel}
              placeholder="gpt-5.1-codex-max"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={onSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 6,
  },
  title: {
    color: colors.textLight,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  help: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    color: colors.textLight,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: 10,
  },
  lockText: {
    color: colors.textLight,
    marginTop: 8,
  },
});

export default AdminAIConfigScreen;
