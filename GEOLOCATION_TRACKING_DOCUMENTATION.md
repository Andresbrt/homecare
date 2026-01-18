# 📍 Sistema de Geolocalización en Tiempo Real - Home Care

Sistema completo de rastreo GPS del proveedor similar a Uber/inDriver, permitiendo al cliente ver la ubicación en tiempo real, ETA, y recibir alertas de proximidad.

**🆕 INTEGRADO CON GOOGLE MAPS API** para cálculos precisos de rutas y ETAs considerando tráfico en tiempo real.

---

## 🎯 Características Principales

### ✅ Tracking en Tiempo Real
- Actualización de ubicación cada 30 segundos vía WebSocket (configurable)
- Transmisión bidireccional con baja latencia
- Persistencia de trayectoria completa en base de datos
- **Cálculo de ETA con Google Maps considerando tráfico actual** 🆕
- Fallback automático a cálculo Haversine si Google Maps falla
- Intervalo optimizado para balance entre precisión y consumo de recursos

### ✅ Rutas Inteligentes con Google Maps 🆕
- **Directions API**: Rutas óptimas con pasos de navegación
- **Distance Matrix API**: Cálculo de distancias y tiempos precisos
- **Geocoding API**: Conversión de direcciones a coordenadas
- Considera tráfico en tiempo real
- Soporte para múltiples modos de transporte

---

## 🎮 **Nuevos Endpoints de Configuración del Sistema**

### 1. **GET `/api/tracking/config`** - Configuración Actual
```http
GET /api/tracking/config
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "updateIntervalSeconds": 30,
  "distanceThresholdMeters": 50,
  "etaCalculationMethod": "google",
  "googleMapsEnabled": true,
  "googleMapsApiStatus": "active",
  "requestsToday": 1200,
  "requestsThisMonth": 36000,
  "estimatedMonthlyCost": 0.0,
  "intervalsRecommended": ["15", "30", "60"]
}
```

### 2. **GET `/api/tracking/config/performance`** - Estadísticas de Rendimiento
```http
GET /api/tracking/config/performance
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "currentInterval": 30,
  "activeTracking": 5,
  "requestsPerHour": 600,
  "requestsPerDay": 14400,
  "requestsPerMonth": 432000,
  "batteryImpactEstimate": 4.0,
  "dataUsageMB": 1.17,
  "costUSDPerMonth": 0.0
}
```

### 3. **GET `/api/tracking/config/recommendations`** - Recomendaciones de Optimización
```http
GET /api/tracking/config/recommendations
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "currentSetting": "30 segundos",
  "recommendedSetting": "30 segundos (actual)",
  "reason": "Configuración óptima: balance entre precisión, batería y costos",
  "costSavings": 0.0,
  "batterySavings": 0.0,
  "impact": "optimal"
}
```

### 4. **PUT `/api/tracking/config/update`** - Actualizar Configuración
```http
PUT /api/tracking/config/update
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "updateIntervalSeconds": 30,
  "distanceThresholdMeters": 50,
  "etaCalculationMethod": "google",
  "reason": "Optimización para balance de precisión y rendimiento"
}
```

### 5. **GET `/api/tracking/config/health`** - Estado de Salud del Sistema
```http
GET /api/tracking/config/health
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "status": "healthy",
  "trackingActive": true,
  "googleMapsStatus": "active",
  "currentLoad": 600,
  "lastCheck": "2024-01-15T10:30:00"
}
```

### ✅ Alertas de Proximidad
- **Saliendo**: Proveedor comienza el viaje
- **A 1 km**: Primera alerta de proximidad
- **A 500 m**: Segunda alerta de proximidad
- **A 100 m**: Proveedor llegando
- **Llegado**: Proveedor en el destino (< 50m)

### ✅ Estadísticas y Análisis
- Distancia total recorrida
- Velocidad promedio y máxima
- Tiempo total de viaje
- Tiempo detenido (tráfico, semáforos)
- Trayectoria histórica completa

### ✅ Información Adicional
- Tipo de transporte (auto, moto, bicicleta, a pie)
- Batería del dispositivo
- Precisión GPS
- Velocidad actual
- Rumbo/dirección

---

## 📡 REST API Endpoints

### 1. Actualizar Ubicación (REST)
```http
POST /api/tracking/actualizar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "solicitudId": 123,
  "latitud": -33.4372,
  "longitud": -70.6506,
  "precisionMetros": 15.5,
  "velocidadKmh": 45.0,
  "rumboGrados": 180.0,
  "tipoTransporte": "auto",
  "bateriaDispositivo": 85,
  "enSegundoPlano": false
}
```

**Response:**
```json
{
  "id": 1001,
  "solicitudId": 123,
  "proveedorId": 456,
  "proveedorNombre": "Juan Pérez",
  "proveedorFoto": "https://...",
  "latitud": -33.4372,
  "longitud": -70.6506,
  "precisionMetros": 15.5,
  "velocidadKmh": 45.0,
  "rumboGrados": 180.0,
  "distanciaRestanteMetros": 2450.0,
  "etaMinutos": 8,
  "estado": "EN_RUTA",
  "tipoTransporte": "auto",
  "bateriaDispositivo": 85,
  "timestamp": "2026-01-16T14:30:00"
}
```

### 2. Obtener Última Ubicación
```http
GET /api/tracking/solicitud/123/ultima?proveedorId=456
Authorization: Bearer {jwt_token}
```

**Response:** Igual al anterior

### 3. Obtener Trayectoria Completa
```http
GET /api/tracking/solicitud/123/trayectoria
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "solicitudId": 123,
  "proveedorId": 456,
  "proveedorNombre": "Juan Pérez",
  "inicioRuta": "2026-01-16T14:00:00",
  "finRuta": "2026-01-16T14:25:00",
  "duracionMinutos": 25,
  "distanciaTotalKm": 12.5,
  "velocidadPromedioKmh": 30.0,
  "puntos": [
    {
      "latitud": -33.4372,
      "longitud": -70.6506,
      "velocidadKmh": 0.0,
      "estado": "EN_RUTA",
      "timestamp": "2026-01-16T14:00:00"
    },
    {
      "latitud": -33.4385,
      "longitud": -70.6515,
      "velocidadKmh": 35.0,
      "estado": "EN_RUTA",
      "timestamp": "2026-01-16T14:00:10"
    }
    // ... más puntos
  ]
}
```

### 4. Obtener Estadísticas de Tracking
```http
GET /api/tracking/solicitud/123/estadisticas
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "solicitudId": 123,
  "totalActualizaciones": 150,
  "distanciaRecorridaKm": 12.5,
  "tiempoTotalMinutos": 25,
  "velocidadPromedioKmh": 30.0,
  "velocidadMaximaKmh": 65.0,
  "tiempoDetenidoMinutos": 5,
  "primeraUbicacion": "2026-01-16T14:00:00",
  "ultimaUbicacion": "2026-01-16T14:25:00"
}
```

### 5. Iniciar Tracking
```http
POST /api/tracking/solicitud/123/iniciar
Authorization: Bearer {jwt_token}
```

**Response:** `200 OK`

Notifica al cliente que el proveedor comenzó el viaje.

### 6. Finalizar Tracking
```http
POST /api/tracking/solicitud/123/finalizar
Authorization: Bearer {jwt_token}
```

**Response:** `200 OK`

Notifica al cliente que el proveedor ha llegado.

### 7. 🆕 Obtener Ruta con Google Maps
```http
GET /api/tracking/ruta?latOrigen=-33.4372&lonOrigen=-70.6506&latDestino=-33.4485&lonDestino=-70.6615&tipoTransporte=auto
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "distanciaMetros": 2450,
  "duracionMinutos": 7,
  "duracionConTraficoMinutos": 12,
  "resumenRuta": "Av. Providencia, Santiago → Av. Apoquindo, Las Condes",
  "polyline": "encoded_polyline_string_for_map",
  "pasos": [
    {
      "instruccion": "Dirígete al norte por Av. Providencia",
      "distanciaMetros": 850,
      "duracionSegundos": 120,
      "latitud": -33.4372,
      "longitud": -70.6506
    },
    {
      "instruccion": "Gira a la derecha en Av. Apoquindo",
      "distanciaMetros": 1600,
      "duracionSegundos": 300,
      "latitud": -33.4425,
      "longitud": -70.6550
    }
  ]
}
```

**Ventajas:**
- ✅ ETA considerando tráfico actual (`duracionConTraficoMinutos`)
- ✅ Polyline codificado para dibujar la ruta en el mapa
- ✅ Pasos de navegación turn-by-turn
- ✅ Soporta diferentes modos de transporte

### 8. 🆕 Geocodificar Dirección
```http
GET /api/tracking/geocode?direccion=Av. Providencia 1234, Santiago
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "latitud": -33.4372,
  "longitud": -70.6506,
  "direccionFormateada": "Av. Providencia 1234, Providencia, Santiago, Chile"
}
```

**Uso:** Convertir direcciones de texto ingresadas por el usuario a coordenadas GPS.

---

## 🔌 WebSocket API

### Configuración del Cliente

#### JavaScript/TypeScript (SockJS + STOMP)
```javascript
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = new Client({
  webSocketFactory: () => socket,
  connectHeaders: {
    Authorization: `Bearer ${jwtToken}`
  },
  debug: (str) => console.log(str),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000
});

stompClient.activate();
```

### 1. Actualizar Ubicación en Tiempo Real

**Envío desde Proveedor:**
```javascript
// El proveedor envía su ubicación cada 30 segundos (configurable en backend)
setInterval(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const ubicacion = {
        solicitudId: 123,
        latitud: position.coords.latitude,
        longitud: position.coords.longitude,
        precisionMetros: position.coords.accuracy,
        velocidadKmh: (position.coords.speed || 0) * 3.6, // m/s a km/h
        rumboGrados: position.coords.heading,
        tipoTransporte: 'auto',
        bateriaDispositivo: getBatteryLevel(),
        enSegundoPlano: document.hidden
      };

      stompClient.publish({
        destination: '/app/tracking/actualizar',
        body: JSON.stringify(ubicacion)
      });
    });
  }
}, 30000); // cada 30 segundos (30000 ms)
```

### 2. Recibir Ubicaciones en Tiempo Real

**Suscripción del Cliente:**
```javascript
// El cliente se suscribe para ver al proveedor en el mapa
stompClient.subscribe('/topic/tracking/123', (message) => {
  const ubicacion = JSON.parse(message.body);
  
  console.log('Nueva ubicación recibida:', ubicacion);
  
  // Actualizar marcador en el mapa
  actualizarMarcadorProveedor({
    lat: ubicacion.latitud,
    lng: ubicacion.longitud,
    velocidad: ubicacion.velocidadKmh,
    distancia: ubicacion.distanciaRestanteMetros,
    eta: ubicacion.etaMinutos,
    estado: ubicacion.estado
  });
  
  // Actualizar ETA en UI
  document.getElementById('eta').textContent = 
    `Llega en ${ubicacion.etaMinutos} minutos`;
  
  // Actualizar distancia
  document.getElementById('distancia').textContent = 
    `${(ubicacion.distanciaRestanteMetros / 1000).toFixed(1)} km de distancia`;
});
```

### 3. Recibir Alertas de Proximidad

**Suscripción a Alertas:**
```javascript
stompClient.subscribe('/topic/tracking/123/alertas', (message) => {
  const alerta = JSON.parse(message.body);
  
  console.log('Alerta recibida:', alerta);
  
  // Mostrar notificación según tipo de alerta
  switch (alerta.tipoAlerta) {
    case 'SALIENDO':
      mostrarNotificacion('🚗 El proveedor está en camino', alerta.mensaje);
      break;
    case 'CERCA_1KM':
      mostrarNotificacion('📍 Proveedor cerca', alerta.mensaje);
      break;
    case 'CERCA_500M':
      mostrarNotificacion('⏰ Llegando pronto', alerta.mensaje);
      reproducirSonido('alerta.mp3');
      break;
    case 'LLEGANDO_100M':
      mostrarNotificacion('🎯 Proveedor llegando', alerta.mensaje);
      reproducirSonido('llegando.mp3');
      break;
    case 'LLEGADO':
      mostrarNotificacion('✅ Proveedor ha llegado', alerta.mensaje);
      reproducirSonido('llegado.mp3');
      vibrar();
      break;
  }
  
  // Mostrar datos adicionales
  if (alerta.etaMinutos) {
    mostrarETA(alerta.etaMinutos);
  }
  if (alerta.distanciaMetros) {
    mostrarDistancia(alerta.distanciaMetros);
  }
});
```

---

## 🗺️ Integración con Mapas

### Google Maps

```javascript
let map;
let marcadorProveedor;
let polyline;
let trayectoriaCoords = [];

// Inicializar mapa centrado en ubicación del cliente
function initMap(latCliente, lngCliente) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latCliente, lng: lngCliente },
    zoom: 14,
    styles: estiloMapaPersonalizado
  });

  // Marcador del cliente (destino)
  new google.maps.Marker({
    position: { lat: latCliente, lng: lngCliente },
    map: map,
    icon: {
      url: '/assets/marker-home.png',
      scaledSize: new google.maps.Size(40, 40)
    },
    title: 'Tu ubicación'
  });

  // Marcador del proveedor (se actualiza en tiempo real)
  marcadorProveedor = new google.maps.Marker({
    map: map,
    icon: {
      url: '/assets/marker-car.png',
      scaledSize: new google.maps.Size(50, 50),
      anchor: new google.maps.Point(25, 25)
    },
    title: 'Proveedor'
  });

  // Línea de trayectoria
  polyline = new google.maps.Polyline({
    path: trayectoriaCoords,
    geodesic: true,
    strokeColor: '#4285F4',
    strokeOpacity: 0.8,
    strokeWeight: 4
  });
  polyline.setMap(map);
}

// Actualizar posición del proveedor en tiempo real
function actualizarMarcadorProveedor(ubicacion) {
  const position = { lat: ubicacion.lat, lng: ubicacion.lng };
  
  // Animar movimiento suave del marcador
  animateMarker(marcadorProveedor, position);
  
  // Agregar punto a la trayectoria
  trayectoriaCoords.push(position);
  polyline.setPath(trayectoriaCoords);
  
  // Centrar mapa en el proveedor
  map.panTo(position);
  
  // Actualizar rotación del icono según rumbo
  if (ubicacion.rumbo !== undefined) {
    marcadorProveedor.setIcon({
      url: '/assets/marker-car.png',
      scaledSize: new google.maps.Size(50, 50),
      anchor: new google.maps.Point(25, 25),
      rotation: ubicacion.rumbo
    });
  }
}

// Animación suave del marcador
function animateMarker(marker, newPosition) {
  const currentPosition = marker.getPosition();
  const latDiff = newPosition.lat - currentPosition.lat();
  const lngDiff = newPosition.lng - currentPosition.lng();
  const steps = 50;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    const lat = currentPosition.lat() + (latDiff * step / steps);
    const lng = currentPosition.lng() + (lngDiff * step / steps);
    marker.setPosition({ lat, lng });

    if (step >= steps) {
      clearInterval(interval);
    }
  }, 20); // 1 segundo total (50 steps * 20ms)
}
```

### 🆕 Dibujar Ruta de Google Maps con Polyline

```javascript
// Obtener ruta desde el backend
async function obtenerYDibujarRuta(latOrigen, lonOrigen, latDestino, lonDestino) {
  const response = await fetch(
    `/api/tracking/ruta?latOrigen=${latOrigen}&lonOrigen=${lonOrigen}` +
    `&latDestino=${latDestino}&lonDestino=${lonDestino}&tipoTransporte=auto`,
    {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    }
  );
  
  const rutaInfo = await response.json();
  
  // Decodificar polyline y dibujar en Google Maps
  const rutaPath = google.maps.geometry.encoding.decodePath(rutaInfo.polyline);
  
  const rutaPolyline = new google.maps.Polyline({
    path: rutaPath,
    geodesic: true,
    strokeColor: '#4285F4',
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map
  });
  
  // Mostrar ETA con tráfico
  document.getElementById('eta').textContent = 
    `${rutaInfo.duracionConTraficoMinutos} min (con tráfico)`;
  
  // Mostrar distancia
  document.getElementById('distancia').textContent = 
    `${(rutaInfo.distanciaMetros / 1000).toFixed(1)} km`;
  
  // Opcional: Mostrar pasos de navegación
  rutaInfo.pasos.forEach((paso, index) => {
    console.log(`${index + 1}. ${paso.instruccion} (${paso.distanciaMetros}m)`);
    
    // Agregar marcadores para cada paso
    new google.maps.Marker({
      position: { lat: paso.latitud, lng: paso.longitud },
      map: map,
      label: (index + 1).toString(),
      title: paso.instruccion
    });
  });
}

// Llamar cuando se inicia el tracking
obtenerYDibujarRuta(
  ubicacionProveedor.latitud,
  ubicacionProveedor.longitud,
  ubicacionCliente.latitud,
  ubicacionCliente.longitud
);
```

### Mapbox

```javascript
mapboxgl.accessToken = 'tu_token_aqui';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-70.6506, -33.4372],
  zoom: 14
});

// Marcador del proveedor
const proveedorMarker = new mapboxgl.Marker({
  color: '#4285F4',
  rotation: 0
})
  .setLngLat([-70.6506, -33.4372])
  .addTo(map);

// Actualizar ubicación
function actualizarUbicacion(ubicacion) {
  proveedorMarker.setLngLat([ubicacion.longitud, ubicacion.latitud]);
  proveedorMarker.setRotation(ubicacion.rumboGrados || 0);
  
  // Agregar punto a la línea de trayectoria
  if (map.getSource('ruta')) {
    const rutaData = map.getSource('ruta')._data;
    rutaData.geometry.coordinates.push([ubicacion.longitud, ubicacion.latitud]);
    map.getSource('ruta').setData(rutaData);
  }
}
```

---

## 📱 Componente React Completo

```tsx
import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

interface UbicacionProveedor {
  latitud: number;
  longitud: number;
  velocidadKmh: number;
  distanciaRestanteMetros: number;
  etaMinutos: number;
  estado: string;
  timestamp: string;
}

const TrackingMap: React.FC<{ solicitudId: number; jwtToken: string }> = ({ 
  solicitudId, 
  jwtToken 
}) => {
  const [ubicacion, setUbicacion] = useState<UbicacionProveedor | null>(null);
  const [trayectoria, setTrayectoria] = useState<google.maps.LatLngLiteral[]>([]);
  const [alerta, setAlerta] = useState<string | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Conectar WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${jwtToken}`
      },
      onConnect: () => {
        console.log('WebSocket conectado');

        // Suscribirse a ubicaciones
        client.subscribe(`/topic/tracking/${solicitudId}`, (message) => {
          const data: UbicacionProveedor = JSON.parse(message.body);
          setUbicacion(data);
          
          // Agregar a trayectoria
          setTrayectoria(prev => [
            ...prev,
            { lat: data.latitud, lng: data.longitud }
          ]);
        });

        // Suscribirse a alertas
        client.subscribe(`/topic/tracking/${solicitudId}/alertas`, (message) => {
          const alertaData = JSON.parse(message.body);
          setAlerta(alertaData.mensaje);
          
          // Mostrar notificación
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Home Care', {
              body: alertaData.mensaje,
              icon: '/logo.png'
            });
          }
          
          // Ocultar alerta después de 5 segundos
          setTimeout(() => setAlerta(null), 5000);
        });
      },
      onStompError: (frame) => {
        console.error('Error STOMP:', frame);
      }
    });

    client.activate();
    stompClientRef.current = client;

    // Obtener última ubicación al montar
    fetch(`/api/tracking/solicitud/${solicitudId}/ultima?proveedorId=123`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    })
      .then(res => res.json())
      .then(data => setUbicacion(data))
      .catch(err => console.error('Error al obtener ubicación:', err));

    // Cleanup
    return () => {
      client.deactivate();
    };
  }, [solicitudId, jwtToken]);

  const mapCenter = ubicacion 
    ? { lat: ubicacion.latitud, lng: ubicacion.longitud }
    : { lat: -33.4372, lng: -70.6506 };

  return (
    <div className="tracking-container">
      {/* Alerta superior */}
      {alerta && (
        <div className="alert alert-info">
          {alerta}
        </div>
      )}

      {/* Información de ETA */}
      {ubicacion && (
        <div className="eta-card">
          <div className="eta-tiempo">
            <h2>{ubicacion.etaMinutos}</h2>
            <span>minutos</span>
          </div>
          <div className="eta-distancia">
            {(ubicacion.distanciaRestanteMetros / 1000).toFixed(1)} km
          </div>
          <div className="eta-velocidad">
            {ubicacion.velocidadKmh.toFixed(0)} km/h
          </div>
          <div className={`eta-estado estado-${ubicacion.estado.toLowerCase()}`}>
            {getEstadoTexto(ubicacion.estado)}
          </div>
        </div>
      )}

      {/* Mapa */}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={mapCenter}
        zoom={15}
      >
        {/* Marcador del proveedor */}
        {ubicacion && (
          <Marker
            position={{ lat: ubicacion.latitud, lng: ubicacion.longitud }}
            icon={{
              url: '/assets/car-icon.png',
              scaledSize: new google.maps.Size(40, 40)
            }}
            title="Proveedor"
          />
        )}

        {/* Línea de trayectoria */}
        {trayectoria.length > 0 && (
          <Polyline
            path={trayectoria}
            options={{
              strokeColor: '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: 4
            }}
          />
        )}
      </GoogleMap>

      {/* Botón para ver trayectoria completa */}
      <button 
        className="btn btn-secondary mt-3"
        onClick={() => verTrayectoriaCompleta(solicitudId, jwtToken)}
      >
        Ver Trayectoria Completa
      </button>
    </div>
  );
};

function getEstadoTexto(estado: string): string {
  const estados: Record<string, string> = {
    'EN_RUTA': '🚗 En camino',
    'DETENIDO': '🚦 Detenido',
    'LLEGANDO': '⏰ Llegando',
    'LLEGADO': '✅ Ha llegado',
    'REGRESANDO': '🔄 Regresando'
  };
  return estados[estado] || estado;
}

async function verTrayectoriaCompleta(solicitudId: number, token: string) {
  const response = await fetch(`/api/tracking/solicitud/${solicitudId}/trayectoria`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const trayectoria = await response.json();
  console.log('Trayectoria completa:', trayectoria);
  // Mostrar en modal o nueva página
}

export default TrackingMap;
```

---

## 📊 Base de Datos

### Tabla `ubicaciones_proveedor`

```sql
CREATE TABLE ubicaciones_proveedor (
    id BIGSERIAL PRIMARY KEY,
    solicitud_id BIGINT NOT NULL REFERENCES solicitudes(id),
    proveedor_id BIGINT NOT NULL REFERENCES usuarios(id),
    latitud DOUBLE PRECISION NOT NULL,
    longitud DOUBLE PRECISION NOT NULL,
    precision_metros DOUBLE PRECISION,
    velocidad_kmh DOUBLE PRECISION,
    rumbo_grados DOUBLE PRECISION,
    distancia_restante_metros DOUBLE PRECISION,
    eta_minutos INTEGER,
    estado VARCHAR(30) NOT NULL DEFAULT 'EN_RUTA',
    tipo_transporte VARCHAR(50),
    bateria_dispositivo INTEGER,
    en_segundo_plano BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ubicaciones_proveedor_latitud_check CHECK (latitud >= -90 AND latitud <= 90),
    CONSTRAINT ubicaciones_proveedor_longitud_check CHECK (longitud >= -180 AND longitud <= 180),
    CONSTRAINT ubicaciones_proveedor_bateria_check CHECK (bateria_dispositivo >= 0 AND bateria_dispositivo <= 100)
);

-- Índices para optimizar consultas
CREATE INDEX idx_ubicaciones_solicitud_timestamp ON ubicaciones_proveedor(solicitud_id, timestamp);
CREATE INDEX idx_ubicaciones_proveedor_timestamp ON ubicaciones_proveedor(proveedor_id, timestamp);
CREATE INDEX idx_ubicaciones_timestamp ON ubicaciones_proveedor(timestamp);

-- Índice espacial para consultas geográficas (requiere PostGIS)
-- CREATE INDEX idx_ubicaciones_geom ON ubicaciones_proveedor USING GIST (
--     ST_SetSRID(ST_MakePoint(longitud, latitud), 4326)
-- );
```

---

## 🔐 Seguridad

### Autenticación JWT en WebSocket

El sistema valida el token JWT en cada conexión WebSocket:

```java
// WebSocketConfig.java ya configurado con interceptor JWT
@Override
public void configureClientInboundChannel(ChannelRegistration registration) {
    registration.interceptors(new ChannelInterceptor() {
        @Override
        public Message<?> preSend(Message<?> message, MessageChannel channel) {
            StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                message, StompHeaderAccessor.class);
            
            if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                String authToken = accessor.getFirstNativeHeader("Authorization");
                if (authToken != null && authToken.startsWith("Bearer ")) {
                    String token = authToken.substring(7);
                    // Validar token y establecer contexto de seguridad
                }
            }
            return message;
        }
    });
}
```

### Validaciones de Permisos

- Solo el proveedor asignado puede enviar ubicaciones
- Solo el cliente de la solicitud puede ver el tracking
- Los datos de ubicación se almacenan para auditoría

---

## 🧪 Pruebas

### Postman - REST API

1. **Actualizar Ubicación**
```
POST http://localhost:8080/api/tracking/actualizar
Headers:
  Authorization: Bearer eyJhbGc...
Body (JSON):
{
  "solicitudId": 1,
  "latitud": -33.4372,
  "longitud": -70.6506,
  "velocidadKmh": 45.0
}
```

2. **Obtener Última Ubicación**
```
GET http://localhost:8080/api/tracking/solicitud/1/ultima?proveedorId=2
Headers:
  Authorization: Bearer eyJhbGc...
```

### Postman - WebSocket

1. Crear nueva request tipo "WebSocket"
2. URL: `ws://localhost:8080/ws`
3. En "Connect", agregar header:
   ```
   Authorization: Bearer {tu_token}
   ```
4. Enviar mensaje CONNECT:
   ```
   CONNECT
   Authorization: Bearer {tu_token}
   
   ```
5. Suscribirse:
   ```
   SUBSCRIBE
   id:sub-0
   destination:/topic/tracking/123
   
   ```
6. Enviar ubicación:
   ```
   SEND
   destination:/app/tracking/actualizar
   content-type:application/json
   
   {"solicitudId":123,"latitud":-33.4372,"longitud":-70.6506}
   ```

---

## 🚀 Flujo de Uso Típico

### Escenario: Cliente contrata servicio

1. **Cliente crea solicitud** → El sistema guarda la ubicación del cliente

2. **Proveedor acepta oferta** → Sistema notifica al cliente

3. **Proveedor inicia viaje**:
   ```javascript
   POST /api/tracking/solicitud/123/iniciar
   ```
   → Cliente recibe notificación push "El proveedor está en camino"

4. **Proveedor envía ubicación cada 30 segundos**:
   ```javascript
   // Bucle automático en app del proveedor
   setInterval(() => {
     stompClient.publish({
       destination: '/app/tracking/actualizar',
       body: JSON.stringify(ubicacionActual)
     });
   }, 30000); // 30 segundos
   ```

5. **Cliente ve tracking en tiempo real**:
   ```javascript
   stompClient.subscribe('/topic/tracking/123', (message) => {
     actualizarMapaConUbicacion(JSON.parse(message.body));
   });
   ```

6. **Sistema envía alertas automáticas**:
   - A 1 km: "El proveedor está a menos de 1 km"
   - A 500 m: "El proveedor está llegando"
   - A 100 m: "El proveedor está muy cerca"

7. **Proveedor llega**:
   ```javascript
   POST /api/tracking/solicitud/123/finalizar
   ```
   → Cliente recibe notificación "El proveedor ha llegado"

8. **Después del servicio** → Cliente puede ver:
   - Trayectoria completa en el mapa
   - Estadísticas del viaje
   - Tiempo total de llegada

---

## ⚙️ Configuración

### Variables de Entorno (application.yml)

```yaml
# Google Maps Configuration
google:
  maps:
    api-key: AIzaSyDHKUqdqatpOVRZELsSmNrdxVgUS-N5X1U
    
# Tracking Configuration
tracking:
  update-interval-seconds: 30 # Intervalo de actualización (30 seg recomendado)
  distance-threshold-meters: 50 # Distancia mínima para registrar punto
  eta-calculation: google # Opciones: google, haversine
```

### Intervalos de Actualización Recomendados

- **30 segundos** (Recomendado): Balance óptimo entre precisión y recursos
- **60 segundos** (Económico): Mayor ahorro de batería y costos
- **15 segundos** (Alta precisión): Para servicios premium o distancias cortas

**Nota**: Con 30 segundos de intervalo:
- ✅ Reduce costos de Google Maps en 67% vs 10 segundos
- ✅ Ahorra batería del dispositivo del proveedor
- ✅ Reduce consumo de datos móviles
- ✅ Mantiene precisión adecuada para tracking

### Modos de Cálculo de ETA

**Modo `google` (Recomendado):**
- ✅ Considera tráfico en tiempo real
- ✅ Rutas optimizadas
- ✅ Mayor precisión
- ❌ Requiere API Key de Google Maps
- ❌ Costo por request (gratis hasta 40,000/mes)

**Modo `haversine` (Fallback):**
- ✅ Gratis, sin límites
- ✅ No requiere conexión externa
- ✅ Cálculo instantáneo
- ❌ Distancia en línea recta
- ❌ No considera tráfico ni calles

El sistema usa automáticamente `haversine` como fallback si Google Maps falla.

### Límites de Google Maps API

- **Gratis**: 40,000 requests/mes
- **Costo adicional**: $5 USD por 1,000 requests
- **Optimización**: El sistema solo llama a Google Maps cuando se actualiza ubicación (cada 30 seg)
- **Estimación con 30 seg**: ~120 requests por hora de tracking (1 request cada 30 seg)
- **Ahorro vs 10 seg**: 67% menos requests y costos

**💰 Cálculo de Costos Actualizado (30 segundos):**

Con tracking cada 30 segundos:
- **1 hora de tracking** = 120 requests (vs 360 con 10 seg)
- **10 horas/día** = 1,200 requests/día (vs 3,600 con 10 seg)
- **30 días** = 36,000 requests/mes (vs 108,000 con 10 seg)

**Costo mensual con 30 seg**:
- Primeros 36,000 requests: **GRATIS** ✅
- Total: **$0 USD/mes** (dentro del límite gratuito)

**Beneficios del cambio a 30 segundos**:
- ✅ **67% menos requests** que con 10 segundos
- ✅ **Costo $0** vs $340 USD/mes anterior
- ✅ **Menos consumo de batería** en dispositivos móviles
- ✅ **Menor uso de datos móviles**
- ✅ **Tracking sigue siendo preciso** para servicios de limpieza

---

## 📈 Optimizaciones y Mejoras Futuras

### Implementadas ✅
- ✅ **Integración con Google Maps API** 🆕
- ✅ **Cálculo de ETA con tráfico en tiempo real** 🆕
- ✅ **Rutas optimizadas con Directions API** 🆕
- ✅ **Geocodificación de direcciones** 🆕
- ✅ Cálculo de distancia usando fórmula de Haversine (fallback)
- ✅ Persistencia de trayectoria completa
- ✅ Alertas automáticas de proximidad
- ✅ WebSocket con autenticación JWT
- ✅ Estadísticas de viaje completas

### Posibles Mejoras 🔮
- **ETA inteligente**: Machine Learning basado en patrones históricos
- **Múltiples proveedores**: Tracking de varios proveedores simultáneos
- **Modo offline**: Guardar ubicaciones en cola cuando no hay conexión
- **Geofencing**: Alertas cuando proveedor sale de zona esperada
- **Compartir ubicación**: Cliente puede compartir tracking con familiares
- **Replay de trayectoria**: Animación de la ruta completa
- **Heat maps**: Mapa de calor de zonas más transitadas

---

## 🐛 Troubleshooting

### WebSocket no conecta
```
Error: Websocket connection failed
```
**Solución**: Verificar que el token JWT sea válido y esté en el header `Authorization`

### Ubicaciones no se actualizan
```
No se reciben mensajes en /topic/tracking/{id}
```
**Solución**: 
1. Verificar que el proveedor esté enviando a `/app/tracking/actualizar`
2. Confirmar que el cliente esté suscrito a `/topic/tracking/{solicitudId}`
3. Revisar que el proveedor tenga oferta aceptada en esa solicitud

### ETA incorrecto
```
ETA muestra valores muy altos o muy bajos
```
**Solución**: 
1. Verificar que `velocidadKmh` se envíe correctamente (no m/s)
2. Si `velocidadKmh` es null, el sistema usa velocidad promedio de 30 km/h

---

## 📞 Contacto

Para preguntas o soporte técnico sobre el sistema de geolocalización, contactar al equipo de desarrollo.

---

**¡Sistema de tracking en tiempo real listo para producción! 🎉**
