// Stub para react-native-maps en web
import { View, Text, StyleSheet } from 'react-native';

const MapView = ({ children, style, ...props }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.text}>📍 Mapa no disponible en web</Text>
    <Text style={styles.subtitle}>Usa la app móvil para ver el mapa</Text>
  </View>
);

const Marker = () => null;
const Polyline = () => null;
const PROVIDER_GOOGLE = 'google';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default MapView;
export { Marker, Polyline, PROVIDER_GOOGLE };
