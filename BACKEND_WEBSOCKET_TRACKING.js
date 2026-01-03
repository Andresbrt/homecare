// 🔌 Servidor WebSocket para Tracking en Tiempo Real
// Archivo: backend/src/services/trackingService.js (Node.js/Express + Socket.io)

/**
 * Servicio de Tracking en Tiempo Real
 * 
 * Responsabilidades:
 * - Recibir ubicación del proveedor
 * - Enviar ubicación a usuario conectado
 * - Calcular ETA
 * - Notificar cuando proveedor está cerca
 * - Manejar desconexiones
 */

const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const { calculateDistance, calculateETA } = require('./geolocationUtils');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:8081', 'http://localhost:3000'],
    credentials: true,
  },
});

// Almacenar conexiones activas
// bookingId -> { userSocket, providerSocket, booking, lastProviderLocation }
const activeBookings = new Map();

// ===========================
// 1️⃣ SOCKET.IO EVENTS
// ===========================

io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`);

  // ===========================
  // USUARIO INICIA TRACKING
  // ===========================
  socket.on('tracking-started', (data) => {
    const { bookingId, userId } = data;
    console.log(`👤 Usuario ${userId} comienza tracking para booking ${bookingId}`);

    if (!activeBookings.has(bookingId)) {
      activeBookings.set(bookingId, {
        userSocket: socket,
        providerSocket: null,
        booking: { id: bookingId, userId },
        lastProviderLocation: null,
        trackingStarted: Date.now(),
      });
    } else {
      const booking = activeBookings.get(bookingId);
      booking.userSocket = socket;
    }

    // Notificar que usuario está listo
    socket.emit('tracking-ready', { bookingId });
  });

  // ===========================
  // PROVEEDOR REGISTRA UBICACIÓN
  // ===========================
  socket.on('provider-location-update', (data) => {
    const { bookingId, providerId, latitude, longitude, accuracy, speed, heading } = data;

    const booking = activeBookings.get(bookingId);
    if (!booking) {
      console.warn(`⚠️ Booking no encontrado: ${bookingId}`);
      return;
    }

    // Actualizar ubicación del proveedor
    booking.providerSocket = socket;
    booking.lastProviderLocation = {
      latitude,
      longitude,
      accuracy: accuracy || 5,
      speed: speed || 0,
      heading: heading || 0,
      timestamp: Date.now(),
    };

    console.log(`📍 Proveedor ${providerId} en (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);

    // Enviar al usuario conectado
    if (booking.userSocket && booking.userSocket.connected) {
      booking.userSocket.emit('provider-location', {
        latitude,
        longitude,
        accuracy: accuracy || 5,
        speed: speed || 0,
        heading: heading || 0,
        timestamp: Date.now(),
      });
    }

    // Calcular y enviar ETA si hay ubicación del usuario
    if (booking.userLocation) {
      const distance = calculateDistance(
        booking.userLocation.latitude,
        booking.userLocation.longitude,
        latitude,
        longitude
      );

      const eta = calculateETA(distance, speed || 30);

      if (booking.userSocket && booking.userSocket.connected) {
        booking.userSocket.emit('eta-update', {
          distance,
          eta,
          timestamp: Date.now(),
        });
      }

      // Notificar cuando proveedor está a menos de 500m
      if (distance < 0.5 && !booking.arrivedNotificationSent) {
        booking.arrivedNotificationSent = true;
        if (booking.userSocket && booking.userSocket.connected) {
          booking.userSocket.emit('provider-arrived', {
            distance: distance * 1000, // En metros
            message: '¡Tu proveedor está llegando!',
          });
        }
      }
    }
  });

  // ===========================
  // USUARIO ENVÍA SU UBICACIÓN
  // ===========================
  socket.on('user-location-update', (data) => {
    const { bookingId, latitude, longitude, accuracy } = data;

    const booking = activeBookings.get(bookingId);
    if (!booking) return;

    booking.userLocation = { latitude, longitude, accuracy };

    // Opcional: enviar al proveedor
    if (booking.providerSocket && booking.providerSocket.connected) {
      booking.providerSocket.emit('user-location', {
        latitude,
        longitude,
        accuracy,
      });
    }
  });

  // ===========================
  // PROVEEDOR ACTUALIZA ESTADO
  // ===========================
  socket.on('provider-status-update', (data) => {
    const { bookingId, status } = data;
    // status: 'on-way', 'arrived', 'in-service', 'completed'

    const booking = activeBookings.get(bookingId);
    if (!booking) return;

    console.log(`📊 Booking ${bookingId} nuevo estado: ${status}`);

    if (booking.userSocket && booking.userSocket.connected) {
      booking.userSocket.emit('provider-status', {
        status,
        timestamp: Date.now(),
      });
    }
  });

  // ===========================
  // CANCELAR BOOKING
  // ===========================
  socket.on('booking-cancelled', (data) => {
    const { bookingId, reason } = data;

    const booking = activeBookings.get(bookingId);
    if (!booking) return;

    console.log(`🚫 Booking ${bookingId} cancelado: ${reason}`);

    // Notificar al otro lado
    if (booking.userSocket && booking.userSocket.connected) {
      booking.userSocket.emit('booking-cancelled', { reason });
    }
    if (booking.providerSocket && booking.providerSocket.connected) {
      booking.providerSocket.emit('booking-cancelled', { reason });
    }

    // Limpiar
    activeBookings.delete(bookingId);
  });

  // ===========================
  // COMPLETAR SERVICIO
  // ===========================
  socket.on('service-completed', (data) => {
    const { bookingId, duration, distance, rating } = data;

    const booking = activeBookings.get(bookingId);
    if (!booking) return;

    console.log(`✅ Servicio completado: ${bookingId}`);

    // Notificar al usuario
    if (booking.userSocket && booking.userSocket.connected) {
      booking.userSocket.emit('service-completed', {
        duration,
        distance,
        rating,
      });
    }

    // Limpiar después de 5 segundos
    setTimeout(() => {
      activeBookings.delete(bookingId);
    }, 5000);
  });

  // ===========================
  // DESCONEXIÓN
  // ===========================
  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);

    // Limpiar bookings donde este socket está involucrado
    for (const [bookingId, booking] of activeBookings.entries()) {
      if (booking.userSocket?.id === socket.id || booking.providerSocket?.id === socket.id) {
        console.log(`🧹 Limpiando booking: ${bookingId}`);
        activeBookings.delete(bookingId);
      }
    }
  });

  // ===========================
  // ERROR HANDLING
  // ===========================
  socket.on('error', (error) => {
    console.error(`⚠️ Error en socket ${socket.id}:`, error);
  });
});

// ===========================
// 2️⃣ RUTAS HTTP
// ===========================

app.get('/api/bookings/:bookingId/status', (req, res) => {
  const { bookingId } = req.params;
  const booking = activeBookings.get(bookingId);

  if (!booking) {
    return res.status(404).json({ error: 'Booking no encontrado' });
  }

  res.json({
    bookingId,
    isActive: true,
    lastProviderLocation: booking.lastProviderLocation,
    userConnected: booking.userSocket?.connected || false,
    providerConnected: booking.providerSocket?.connected || false,
    trackingDuration: Date.now() - booking.trackingStarted,
  });
});

app.get('/api/tracking/active', (req, res) => {
  const activeCount = activeBookings.size;
  res.json({
    activeBookings: activeCount,
    bookings: Array.from(activeBookings.keys()),
  });
});

// ===========================
// 3️⃣ INICIAR SERVIDOR
// ===========================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🚀 SERVIDOR WEBSOCKET INICIADO     ║
║  Puerto: ${PORT}                          ║
║  Tracking en tiempo real activo          ║
╚════════════════════════════════════════╝
  `);
});

// ===========================
// 4️⃣ EXPORTAR PARA TESTING
// ===========================

module.exports = {
  app,
  server,
  io,
  activeBookings,
};

// ===========================
// NOTAS IMPORTANTES
// ===========================

/**
 * FLUJO DE CONEXIÓN:
 * 
 * 1. Usuario inicia tracking → emit 'tracking-started'
 * 2. Proveedor conecta y emite 'provider-location-update' cada 5 segundos
 * 3. Servidor calcula ETA y envía al usuario
 * 4. Cuando distancia < 500m → emit 'provider-arrived'
 * 5. Servicio completado → emit 'service-completed'
 * 6. Limpiar conexión
 * 
 * EVENTOS DEL CLIENTE (MOBILE):
 * - tracking-started: Usuario inicia tracking
 * - provider-location-update: Proveedor envia ubicación
 * - user-location-update: Usuario envia ubicación (opcional)
 * - booking-cancelled: Cancelar servicio
 * - service-completed: Servicio terminado
 * 
 * EVENTOS DEL SERVIDOR → CLIENTE:
 * - tracking-ready: Usuario listo
 * - provider-location: Ubicación actualizada
 * - eta-update: ETA actualizado
 * - provider-arrived: Proveedor cerca
 * - provider-status: Estado del proveedor
 * - service-completed: Servicio completo
 * - booking-cancelled: Servicio cancelado
 * 
 * OPTIMIZACIONES:
 * - Ubicación cada 5 segundos (configurable)
 * - Limpiar conexiones inactivas
 * - Usar namespaces para múltiples bookings
 * - Implementar heartbeat para detectar desconexiones
 * 
 * SEGURIDAD:
 * - Validar bookingId con JWT token
 * - Verificar que usuario/proveedor pertenecen al booking
 * - Rate limiting en ubicaciones (5s mínimo)
 * - Encriptar ubicaciones en tránsito
 */
