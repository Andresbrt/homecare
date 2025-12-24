# ==========================================
# CleanHome MySQL Setup - Manual Instructions
# ==========================================

## Instalación de MySQL (Windows)

1. **Descargar MySQL**:
   https://dev.mysql.com/downloads/installer/

2. **Instalar con configuración por defecto**:
   - Puerto: 3306
   - Usuario root con contraseña: `root`

3. **Verificar instalación**:
   ```powershell
   mysql --version
   ```

## Crear Base de Datos desde VS Code con SQLTools

### 1. Instalar extensión SQLTools
- Abrir VS Code
- Ir a Extensions (Ctrl+Shift+X)
- Buscar e instalar: **SQLTools**
- Buscar e instalar: **SQLTools MySQL/MariaDB**

### 2. Configurar Conexión
- Presionar `Ctrl+Shift+P`
- Escribir: `SQLTools: Add New Connection`
- Seleccionar: **MySQL**
- Configurar:
  ```
  Name: CleanHome Dev
  Server: localhost
  Port: 3306
  Database: cleanhome_dev
  Username: root
  Password: root
  ```

### 3. Ejecutar Scripts SQL desde VS Code

**Opción A - Dejar que Flyway lo haga automáticamente**:
```powershell
cd "c:\Users\ANDRES\OneDrive\Desktop\andres rico"
mvn clean install
mvn spring-boot:run
```
Flyway ejecutará automáticamente las migraciones en `src/main/resources/db/migration/`

**Opción B - Ejecutar manualmente con SQLTools**:
1. Conectar a MySQL con SQLTools (icono en barra lateral)
2. Abrir archivo: `V1__initial_schema.sql`
3. Seleccionar todo el contenido (Ctrl+A)
4. Presionar `Ctrl+E Ctrl+E` para ejecutar
5. Repetir con `V2__indexes_optimizations.sql` y `V3__production_seed_data.sql`

## Credenciales de Prueba (después de ejecutar V3)

### Admin
- Email: admin@cleanhome.com
- Password: Admin@2025!

### Cliente de Prueba
- Email: juan.perez@example.com  
- Password: Customer@2025!

### Proveedor de Prueba
- Email: maria.gonzalez@example.com
- Password: Provider@2025!

## Verificar Tablas Creadas

```sql
USE cleanhome_dev;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM services;
```

## Estructura Final

```
cleanhome_dev/
├── users (3 registros)
├── service_providers (1 registro)
├── services (4 servicios)
├── provider_services (4 tipos)
├── bookings (vacía)
├── payments (vacía)
└── ratings (vacía)
```

## Conexión desde Spring Boot

El backend ya está configurado para conectarse automáticamente:
- Dev: `jdbc:mysql://localhost:3306/cleanhome_dev`
- User: `root`
- Password: `root`

Las migraciones Flyway se ejecutan automáticamente al arrancar la aplicación.
