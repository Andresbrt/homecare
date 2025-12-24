# 🔄 Gestión Dinámica de Roles - Implementación Completa

## 📋 Resumen
Se implementó un sistema completo de cambio de roles que permite a los usuarios alternar entre CUSTOMER y SERVICE_PROVIDER, con sincronización backend y menú dinámico adaptado al rol activo.

## ✅ Cambios Implementados

### Backend (Java Spring Boot)

#### 1. **Nuevo DTO: `UpdateRoleDto.java`**
```java
// src/main/java/com/cleanhome/backend/dto/UpdateRoleDto.java
public class UpdateRoleDto {
    @NotNull(message = "El rol es requerido")
    private UserRole role;
}
```

#### 2. **Servicio: `UserService.java`**
- Nuevo método `updateUserRole(Long userId, UserRole newRole)`
- Actualiza el rol del usuario y persiste en base de datos
- Retorna `UserResponseDto` con datos actualizados

#### 3. **Controlador: `AuthController.java`**
- Nuevo endpoint: `PUT /api/auth/update-role/{userId}`
- Acepta `UpdateRoleDto` con el nuevo rol
- Validaciones con `@Valid`
- Documentación Swagger con `@Operation`

**Ejemplo de uso:**
```bash
curl -X PUT http://localhost:8080/api/auth/update-role/123 \
  -H "Content-Type: application/json" \
  -d '{"role": "SERVICE_PROVIDER"}'
```

### Frontend (React Native)

#### 1. **Normalización de Nomenclatura**
- ❌ Antes: `PROFESSIONAL`
- ✅ Ahora: `SERVICE_PROVIDER`
- **Archivos actualizados:**
  - `RegisterScreen.js`: RoleSelector, validaciones, formData
  - `UserProfileScreen.js`: handleRoleToggle, menú dinámico

#### 2. **UserProfileScreen.js - Integración API**
```javascript
const handleRoleToggle = async () => {
  const nextRole = user.role === 'CUSTOMER' ? 'SERVICE_PROVIDER' : 'CUSTOMER';
  
  // Llamada a la API
  const response = await fetch(`${API_BASE_URL}/auth/update-role/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: nextRole }),
  });
  
  const updatedUser = await response.json();
  await changeRole(nextRole); // Actualizar contexto local
};
```

#### 3. **Menú Dinámico por Rol**
```javascript
const menuOptions = [
  // Opciones compartidas
  { id: 'referrals', roles: ['CUSTOMER','SERVICE_PROVIDER'] },
  { id: 'support', roles: ['CUSTOMER','SERVICE_PROVIDER'] },
  
  // Solo CUSTOMER
  { id: 'history', screen: 'ServiceHistory', roles: ['CUSTOMER'] },
  { id: 'favorites', screen: 'Favorites', roles: ['CUSTOMER'] },
  
  // Solo SERVICE_PROVIDER
  { id: 'provider-financial', screen: 'ProviderFinancial', roles: ['SERVICE_PROVIDER'] },
  { id: 'provider-calendar', screen: 'ProviderCalendar', roles: ['SERVICE_PROVIDER'] },
].filter(opt => opt.roles.includes(user.role));
```

#### 4. **UI Toggle de Rol**
- Pill interactivo con ícono "repeat"
- Indicador de carga durante cambio
- Mensajes de confirmación amigables

### Testing

#### **test_endpoints.ps1**
Agregado test para endpoint de cambio de rol:
```powershell
# 7. Cambiar rol de usuario
$userId = $loginResp.user.id
$newRole = if ($loginResp.user.role -eq 'CUSTOMER') { 'SERVICE_PROVIDER' } else { 'CUSTOMER' }
$roleResp = Invoke-JsonPut -Url "$BaseUrl/auth/update-role/$userId" -Body @{ role=$newRole } -Token $token
```

## 🔍 Flujo de Usuario

1. **Usuario abre perfil** → Ve rol actual (CUSTOMER o SERVICE_PROVIDER)
2. **Toca pill de rol** → Se activa spinner "Cambiando..."
3. **App llama API** → `PUT /api/auth/update-role/{userId}` con nuevo rol
4. **Backend actualiza DB** → Persiste cambio en tabla `users`
5. **App actualiza contexto** → AsyncStorage + AuthContext
6. **Menú se refresca** → Muestra opciones según nuevo rol
7. **Usuario ve confirmación** → Alert "Ahora tu rol es: Proveedor de Servicios"

## 🎯 Consistencia de Datos

### Roles Backend (Java Enum)
```java
public enum UserRole {
    CUSTOMER,
    SERVICE_PROVIDER,
    ADMIN
}
```

### Roles Frontend (JavaScript)
```javascript
// RegisterScreen.js - RoleSelector
'CUSTOMER' | 'SERVICE_PROVIDER'

// UserProfileScreen.js - handleRoleToggle
const nextRole = user.role === 'CUSTOMER' ? 'SERVICE_PROVIDER' : 'CUSTOMER';
```

## ✅ Verificación de Compilación
```bash
mvn clean compile -DskipTests
# [INFO] BUILD SUCCESS
# Compilación exitosa sin errores
```

## 🚀 Próximos Pasos Recomendados

1. **Implementar pantallas faltantes:**
   - `ProviderFinancialScreen.js`
   - `ProviderCalendarScreen.js`

2. **Agregar validaciones de seguridad:**
   - Verificar permisos en backend (solo el propio usuario puede cambiar su rol)
   - `@PreAuthorize("@userSecurity.isOwner(#userId)")`

3. **Testing:**
   - Pruebas unitarias backend (UserServiceTest)
   - Pruebas E2E móvil (Detox)
   - Validar flujo completo: login → cambio rol → menú dinámico

4. **UX mejoradas:**
   - Animaciones de transición menú
   - Confirmación antes de cambiar rol
   - Información de diferencias entre roles

## 📝 Notas Técnicas

- **Persistencia doble:** AsyncStorage (local) + API (servidor)
- **Sincronización:** Cambio local solo tras confirmación API exitosa
- **Rollback:** Si API falla, rol local no cambia
- **Validación:** `@NotNull` en DTO asegura rol no nulo
- **Tipos consistentes:** Enum backend = constantes string frontend

## 🔧 Troubleshooting

### Error: "Usuario no encontrado"
- Verificar `userId` válido en request
- Confirmar token JWT válido

### Error: "El rol es requerido"
- Validar body JSON incluye campo `role`
- Verificar valor es `CUSTOMER` o `SERVICE_PROVIDER`

### Menú no se actualiza tras cambio
- Verificar `user.role` se actualiza en AuthContext
- Confirmar `menuOptions.filter()` usa `user.role` actual
- Recargar componente con `navigation.replace('Profile')`

---

**Fecha:** 29 de noviembre de 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Implementado y Compilado Exitosamente
