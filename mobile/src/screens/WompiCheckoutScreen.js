import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.10:8080/api';

export default function WompiCheckoutScreen({ route, navigation }) {
  const { amount, email, reference } = route.params;
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('@cleanhome/token');
        const payload = { amount, currency: 'COP', email, reference };
        const res = await fetch(`${API_BASE_URL}/payments/wompi/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        // Wompi devuelve transaction.data.url u otro campo según versión
        const url = json?.data?.url || json?.data?.payment_link || json?.data?.redirect_url;
        if (!url) throw new Error('No se recibió URL de checkout');
        setCheckoutUrl(url);
      } catch (e) {
        Alert.alert('Error', e.message || 'No fue posible iniciar el pago');
        navigation.goBack();
      }
    })();
  }, [amount, email, reference, navigation]);

  if (!checkoutUrl) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: checkoutUrl }}
      onNavigationStateChange={(navState) => {
        // Opcional: detectar retorno a app y consultar estado
        // por ejemplo si URL contiene '?status=approved' etc.
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
