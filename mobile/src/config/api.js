import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getApiUrl() {
  // 1. Variable de entorno tiene prioridad
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Detectar IP del host desde Expo
  const debuggerHost = Constants.expoConfig?.hostUri || 
                       Constants.manifest?.debuggerHost ||
                       Constants.manifest2?.extra?.expoGo?.debuggerHost;
  
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:8081/api`;
  }

  // 3. Fallback por plataforma
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8081/api'; // Emulador Android
  }
  
  return 'http://localhost:8081/api'; // Web/iOS
}

export const API_BASE_URL = getApiUrl();

console.log('🔗 API_BASE_URL:', API_BASE_URL);
