# 🧪 Guía de Testeo - CleanHome App

## 🚀 Estado de la Aplicación
✅ **Backend**: Ejecutándose correctamente en `http://localhost:8080/api`
✅ **Frontend**: Abierto en el navegador desde `frontend/index.html`
✅ **Base de Datos**: H2 en memoria inicializada con todas las tablas

## 📋 Plan de Testeo Completo

### 1. **Verificaciones Iniciales**
- [ ] El frontend se carga correctamente en el navegador
- [ ] La página muestra el diseño responsivo de CleanHome
- [ ] La navegación funciona (Inicio, Servicios, Perfil)
- [ ] Los estilos CSS se cargan correctamente

### 2. **Testeo de Autenticación**

#### Registro de Usuario Cliente
1. **Ir a la página de registro**:
   - Hacer clic en "Registrarse" en la navegación
   - O hacer clic en "Registrarse" en la sección hero

2. **Completar formulario de registro**:
   ```
   Nombre: Juan
   Apellido: Pérez
   Email: juan.perez@example.com
   Contraseña: password123
   Teléfono: +1234567890
   Dirección: Calle Principal 123
   Ciudad: Bogotá
   Estado: Cundinamarca
   Código Postal: 110111
   Rol: Cliente
   ```

3. **Verificar**:
   - [ ] El formulario se envía correctamente
   - [ ] Aparece notificación de registro exitoso
   - [ ] Se redirige automáticamente a login

#### Registro de Proveedor de Servicios
1. **Registrar un proveedor**:
   ```
   Nombre: María
   Apellido: García
   Email: maria.garcia@cleansrv.com
   Contraseña: provider123
   Teléfono: +0987654321
   Dirección: Avenida Central 456
   Ciudad: Medellín
   Estado: Antioquia
   Código Postal: 050001
   Rol: Proveedor de Servicios
   Nombre de la Empresa: LimpiezaTotal SAS
   Descripción: Especialistas en limpieza profunda y mantenimiento
   Años de Experiencia: 5
   ```

2. **Verificar**:
   - [ ] Los campos adicionales aparecen al seleccionar "Proveedor"
   - [ ] El registro se completa exitosamente

#### Login de Usuarios
1. **Login como Cliente**:
   - Email: `juan.perez@example.com`
   - Contraseña: `password123`

2. **Login como Proveedor**:
   - Email: `maria.garcia@cleansrv.com`
   - Contraseña: `provider123`

3. **Verificar**:
   - [ ] Login exitoso muestra nombre del usuario
   - [ ] Se muestra el rol correcto en la navegación
   - [ ] Los botones de login/registro desaparecen
   - [ ] Aparece botón de "Cerrar Sesión"

### 3. **Testeo de Gestión de Servicios**

#### Como Proveedor de Servicios
1. **Crear servicios** (logueado como María García):
   
   **Servicio 1**:
   ```
   Nombre: Limpieza Básica Residencial
   Descripción: Limpieza general de hogar, incluye barrido, trapeo y desempolvado
   Tipo: Limpieza Básica
   Precio: 50000
   Duración: 2
   Espacios Disponibles: 10
   ```

   **Servicio 2**:
   ```
   Nombre: Limpieza Profunda de Oficinas
   Descripción: Limpieza exhaustiva para espacios corporativos, incluye ventanas y alfombras
   Tipo: Limpieza de Oficinas
   Precio: 120000
   Duración: 4
   Espacios Disponibles: 5
   ```

2. **Verificar**:
   - [ ] Los servicios se crean correctamente
   - [ ] Aparecen en la sección "Mis Servicios"
   - [ ] Se pueden eliminar servicios
   - [ ] Los servicios aparecen en la lista pública

#### Como Cliente
1. **Ver servicios disponibles**:
   - [ ] Los servicios creados aparecen en la página principal
   - [ ] Se muestran correctamente: nombre, tipo, precio, duración
   - [ ] Aparece botón "Reservar" para clientes

2. **Reservar un servicio** (logueado como Juan Pérez):
   - Hacer clic en "Reservar" en cualquier servicio
   - Ingresar fecha: `2025-10-26 10:00`
   - [ ] La reserva se procesa exitosamente
   - [ ] Aparece notificación de confirmación

### 4. **Testeo de Perfil de Usuario**

#### Verificar Información del Perfil
1. **Como Cliente**:
   - [ ] Se muestra información personal completa
   - [ ] Datos coinciden con el registro

2. **Como Proveedor**:
   - [ ] Se muestra información personal
   - [ ] Se muestran datos adicionales de empresa
   - [ ] Años de experiencia se visualizan correctamente

### 5. **Testeo de Navegación y UX**

#### Funcionalidades Generales
- [ ] La navegación entre páginas funciona sin errores
- [ ] Los botones responden correctamente
- [ ] Las notificaciones aparecen y desaparecen
- [ ] El diseño es responsivo en diferentes tamaños de pantalla
- [ ] Los íconos se cargan correctamente (Font Awesome)

#### Cerrar Sesión
- [ ] El botón "Cerrar Sesión" funciona
- [ ] Se limpia el almacenamiento local
- [ ] Se regresa al estado de usuario no autenticado

### 6. **Testeo de Validaciones**

#### Validaciones de Frontend
- [ ] Campos requeridos muestran error si están vacíos
- [ ] Formato de email se valida
- [ ] Los formularios no se envían con datos incompletos

#### Validaciones de Backend
- [ ] Email duplicado no permite registro
- [ ] Datos inválidos retornan errores apropiados
- [ ] Autenticación requerida para endpoints protegidos

### 7. **Testeo de API (Opcional)**

#### Endpoints de Autenticación
```bash
# Registro
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"test123","role":"CUSTOMER"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### Verificar Swagger (si el backend está ejecutándose)
- Abrir: `http://localhost:8080/api/swagger-ui/index.html`
- [ ] La documentación se carga correctamente
- [ ] Se pueden probar endpoints directamente

### 8. **Testeo de Casos Edge**

#### Manejo de Errores
- [ ] Error de conexión con backend se maneja graciosamente
- [ ] Credenciales incorrectas muestran mensaje apropiado
- [ ] Timeout de sesión se maneja correctamente

#### Datos Límite
- [ ] Nombres muy largos se truncan o validan
- [ ] Precios con decimales se manejan correctamente
- [ ] Fechas futuras/pasadas se validan apropiadamente

## 🏁 Criterios de Éxito

### ✅ Funcionalidades Críticas
- [ ] Registro y login de usuarios funciona
- [ ] Creación de servicios por proveedores funciona
- [ ] Reserva de servicios por clientes funciona
- [ ] Navegación y UX son intuitivas

### ✅ Calidad Técnica
- [ ] No hay errores de JavaScript en consola
- [ ] Todas las peticiones HTTP responden correctamente
- [ ] El diseño es consistente y profesional
- [ ] La aplicación es responsiva

### ✅ Experiencia de Usuario
- [ ] El flujo de usuario es intuitivo
- [ ] Las notificaciones son claras e informativas
- [ ] Los formularios son fáciles de completar
- [ ] La información se presenta de manera organizada

## 🐛 Reportar Problemas

Si encuentras algún problema durante las pruebas:

1. **Anotar el problema**: Descripción detallada
2. **Pasos para reproducir**: Secuencia exacta de acciones
3. **Comportamiento esperado**: Qué debería pasar
4. **Comportamiento actual**: Qué está pasando
5. **Información del navegador**: Chrome, Firefox, etc.

## 🎯 Próximos Pasos de Desarrollo

Una vez completadas las pruebas, se pueden implementar:

- [ ] Sistema de notificaciones en tiempo real
- [ ] Geolocalización para servicios cercanos
- [ ] Sistema de pagos integrado
- [ ] Chat entre clientes y proveedores
- [ ] Dashboard de administración
- [ ] Aplicación móvil

---

**¡La aplicación CleanHome está lista para el testeo completo!** 🚀