# Checklist de Pruebas Funcionales viclean

## 1. Navegación y Rutas (Stack/Tabs)
Pantallas en HomeStack:
- Home
- ServiceCatalog
- ServiceDetail
- HousekeeperDetail
- RequestService
- ScheduleService
- PaymentConfirmation
- WompiCheckout
- TrackingScreen
- ChatScreen
- EmergencyService
- PhotoEvidence

Pantallas en ProfileStack:
- Profile
- ServiceHistory
- Favorites
- Referral
- Support
- Settings

Tabs:
- Inicio -> HomeStack
- Servicios -> ServiceCatalogScreen (single)
- Wallet -> WalletScreen
- Perfil -> ProfileStack

Acciones a validar:
- Botones en `HomeScreen` (EmergencyService, TrackingScreen, ServiceHistory, ScheduleService, ServiceDetail)
- Botones en `CustomerHomeScreen` (RequestService, ServiceCatalog, ServiceDetail, HousekeeperDetail, ScheduleService)
- Botones en `BookingDetailScreen` (TrackingScreen, ChatScreen, PhotoEvidence)
- Botones en `FavoritesScreen` (ServiceCatalog, HousekeeperDetail, ServiceDetail)
- Botones back (`navigation.goBack()`) retornan a la pantalla correcta.

Resultado esperado: Ningún "Route not found" en consola.

## 2. Flujos Críticos
1. Registro usuario (Register -> Login automático o redirección manual).
2. Login:
   - Email/Password
   - Google Sign-In (APK nuevo) -> token guardado en AsyncStorage
   - Apple Sign-In (iOS simulador)
3. Explorar catálogo servicios -> Detalle -> Agendar (ScheduleService) -> Confirmar pago (PaymentConfirmation) -> TrackingScreen -> PhotoEvidence.
4. Favoritos: Añadir/quitar provider y servicio; navegar a detalle.
5. Chat: Desde TrackingScreen/BookingDetail abre ChatScreen y carga booking param.
6. Notificación push simulada: Navega a pantalla configurada en data (screen).

## 3. Endpoints Backend (Pruebas con token JWT)
Base URL (ajustar): `http://localhost:8080/api`

Auth:
- POST `/auth/login` { email, password } -> token
- POST `/auth/register` -> usuario creado
- POST `/auth/forgot-password` -> correo enviado (mock)

Services:
- GET `/services` -> lista activa
- GET `/services/search?keyword=` -> búsqueda
- GET `/services/type/{type}` -> filtrado
- GET `/services/price-range?min=&max=` -> rango

Bookings:
- POST `/bookings` -> crear (requiere token)
- GET `/bookings` -> listar propios
- GET `/bookings/{id}` -> detalle
- PUT `/bookings/{id}/status?status=IN_PROGRESS` -> avanzar estado
- DELETE `/bookings/{id}` -> cancelar

Payments:
- POST `/payments/process` -> mock pago
- GET `/payments/user` -> pagos usuario
- POST `/payments/refund/{paymentId}` -> reembolso

## 4. Datos a Verificar
- Response 200/201 y estructuras JSON esperadas.
- Control de errores: 400 (validación), 401 (sin token), 404 (ID inexistente).
- Estados booking progresan: CREATED -> IN_PROGRESS -> COMPLETED.

## 5. Comandos cURL Ejemplo
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@viclean.com","password":"Secret123"}'

# Servicios
curl http://localhost:8080/api/services
curl http://localhost:8080/api/services/search?keyword=deep

# Crear booking (usar TOKEN obtenido)
curl -X POST http://localhost:8080/api/bookings -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"serviceId":1,"scheduledDate":"2025-12-01T10:00:00"}'

# Cambiar estado booking
curl -X PUT "http://localhost:8080/api/bookings/1/status?status=IN_PROGRESS" -H "Authorization: Bearer TOKEN"

# Pago
curl -X POST http://localhost:8080/api/payments/process -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"bookingId":1,"method":"CARD"}'
```

## 6. Validación AsyncStorage
Claves:
- `@cleanhome/token`
- `@cleanhome/user`
Verificar después de login y limpieza tras signOut.

## 7. Notificaciones (Manual / Simulada)
Enviar notificación de prueba (Expo push) con data: `{ "screen": "TrackingScreen", "bookingId": 1 }` -> App debe navegar si está en foreground/background.

## 8. Criterios de Aprobación
- 0 errores de navegación.
- 100% endpoints críticos accesibles con token.
- Flujo completo servicio -> pago -> tracking -> evidencia sin bloqueos.
- Login social Google sin `invalid_client`.
- Token persiste entre reinicios app.

## 9. Próximas Extensiones (Opcional)
- Tests automatizados Jest para utils y componentes.
- Detox para flujo de login y navegación core.
- Newman colección Postman para endpoints.

---
Actualizado: 2025-11-29
