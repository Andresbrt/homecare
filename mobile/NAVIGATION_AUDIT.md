# Auditoría de Navegación viclean

Fecha: 2025-11-29

## 1. Definiciones de Rutas
Root Stack (App.js):
- Main (contiene tabs)
- Login
- Register

Tabs (`MainTabs.js`):
- Inicio -> HomeStack
- Servicios -> ServiceCatalogScreen
- Wallet -> WalletScreen
- Perfil -> ProfileStack

HomeStack:
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

ProfileStack:
- Profile
- ServiceHistory
- Favorites
- Referral
- Support
- Settings

## 2. Rutas Usadas con `navigation.navigate`
Pantallas destino detectadas:
- EmergencyService
- TrackingScreen
- ServiceHistory
- ScheduleService
- ServiceDetail
- Register
- Login
- ChatScreen
- PaymentConfirmation
- Inicio (tab)
- ServiceCatalog
- RequestService
- HousekeeperDetail
- PhotoEvidence
- Favorites (indirecto en ProfileStack)

## 3. Diferencias / Inconsistencias
- Todas las rutas navegadas existen en los stacks o tabs.
- `navigation.navigate('Inicio', { ... })`: pasa params al Tab. HomeStack (pantalla Home) no recibe directamente esos params; si se necesitan deben propagarse vía listeners o usar `navigation.navigate('Home', params)`.
- BookingDetailScreen navega a PhotoEvidence, TrackingScreen, ChatScreen con objeto `booking` sin validación de forma; conviene validar shape antes de navegar.
- Varias navegaciones a ServiceCatalog con distintos params (`filterType`, `showFeatured`, etc.). Verificar que `ServiceCatalogScreen` lee todos esos params (recomendado implementar `route.params` defaults).

## 4. Riesgos Potenciales
| Caso | Riesgo | Mitigación |
| ---- | ------ | ---------- |
| Params a tab 'Inicio' | Ignorados silenciosamente | Cambiar a `Home` o usar contexto global |
| booking incompleto | Pantallas dependientes fallan al acceder campos | Añadir guard clause antes de navigate |
| Falta defaults en ServiceCatalog | Undefined checks repetidos | Crear función normalizarParams |
| PhotoEvidence requiere booking | Navegación sin booking → crash | Redirigir a Home si falta |

## 5. Recomendaciones Técnicas
1. Sustituir `navigation.navigate('Inicio', params)` por `navigation.navigate('Home', params)` si se requiere consumo en Home.
2. Crear helper `safeNavigateBooking(screen, booking)` que valide campos clave (`id`, `status`).
3. En `ServiceCatalogScreen`, definir:
```js
const { filterType = null, showFeatured = false, fromRecommendation = false } = route.params || {};
```
4. Añadir en `PhotoEvidenceScreen`:
```js
if (!route.params?.booking) { navigation.replace('Home'); return null; }
```
5. Documentar convención: Navegación a tab sin params; navegación a pantalla interna con params.

## 6. Estado Final
Sin rutas faltantes tras agregar HousekeeperDetail, RequestService y PhotoEvidence. Lista limpia.

---
Fin auditoría.
