import * as Location from 'expo-location';

export async function requestForegroundPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentPosition(options = {}) {
  const granted = await requestForegroundPermission();
  if (!granted) throw new Error('Permiso de ubicación denegado');
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, ...options });
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
  };
}

export async function watchPosition(callback, options = {}) {
  const granted = await requestForegroundPermission();
  if (!granted) throw new Error('Permiso de ubicación denegado');
  return Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 4000, distanceInterval: 5, ...options },
    (loc) => {
      callback({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
        timestamp: loc.timestamp,
      });
    }
  );
}
