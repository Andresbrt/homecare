# Guía de Solución de Problemas - Homecare

Esta guía te ayudará a resolver problemas comunes al trabajar con Homecare.

## 🚀 Problemas de Instalación y Setup

### Java no se encuentra en el PATH

**Problema:**
```
'java' is not recognized as an internal or external command
```

**Solución:**
1. Instala JDK 17 o superior desde [openjdk.java.net](https://openjdk.java.net/)
2. Verifica que esté instalado:
   ```powershell
   java -version
   ```
3. Si no funciona, agrega Java al PATH:
   - Windows: Variables de entorno → JAVA_HOME → Añade `C:\Program Files\Java\jdk-17`

### Maven no se encuentra

**Problema:**
```
'mvn' is not recognized as an internal or external command
```

**Solución:**
1. Descarga Maven desde [maven.apache.org](https://maven.apache.org/download.cgi)
2. Extrae el archivo y añade `bin` al PATH
3. Verifica:
   ```powershell
   mvn -version
   ```

### Node.js o npm no se encuentran

**Problema:**
```
'npm' is not recognized as an internal or external command
```

**Solución:**
1. Instala Node.js desde [nodejs.org](https://nodejs.org/)
2. Verifica la instalación:
   ```powershell
   node --version
   npm --version
   ```

---

## 🐳 Problemas de Base de Datos

### Error de conexión a PostgreSQL

**Problema:**
```
org.postgresql.util.PSQLException: Connection to localhost:5432 refused
```

**Causa:** PostgreSQL no está corriendo o no está configurado correctamente.

**Soluciones:**

1. **Si usas Docker (Recomendado):**
   ```powershell
   # Verifica que el contenedor está corriendo
   docker ps | findstr postgres
   
   # Si no está, inicia docker-compose
   docker-compose up -d database
   
   # Espera 10 segundos para que la base de datos inicie
   Start-Sleep -Seconds 10
   ```

2. **Si usas PostgreSQL local:**
   ```powershell
   # En Windows, verifica el servicio
   Get-Service postgresql-x64-*
   
   # Si no está corriendo, inicia el servicio
   Start-Service postgresql-x64-15  # Ajusta el número de versión
   ```

3. **Verifica las credenciales en `.env`:**
   ```env
   DB_URL=jdbc:postgresql://localhost:5432/homecare
   DB_USERNAME=homecare_admin
   DB_PASSWORD=tu_contraseña
   ```

### Error: "Database 'homecare' does not exist"

**Solución:**
```bash
# Crea la base de datos manualmente
psql -U homecare_admin -h localhost -c "CREATE DATABASE homecare;"
```

### Error de autenticación de base de datos

**Problema:**
```
org.postgresql.util.PSQLException: FATAL: password authentication failed
```

**Solución:**
1. Verifica que `DB_USERNAME` y `DB_PASSWORD` son correctos en `.env`
2. Si usas Docker, verifica en `docker-compose.yml`:
   ```yaml
   environment:
     POSTGRES_USER: homecare_admin
     POSTGRES_PASSWORD: tu_contraseña
   ```
3. Resetea el contenedor:
   ```powershell
   docker-compose down -v
   docker-compose up -d database
   ```

---

## 🚪 Problemas de Autenticación

### Error: "Invalid JWT token"

**Solución:**
1. Verifica que `JWT_SECRET` en `.env` es consistente
2. Asegúrate de que el token no ha expirado (JWT_EXPIRATION_MS)
3. Comprueba que incluyes el token en el header:
   ```
   Authorization: Bearer tu_token_jwt_aqui
   ```

### No puedo hacer login

**Problema:**
```
401 Unauthorized: Invalid credentials
```

**Pasos para solucionar:**
1. Verifica que el usuario existe en la base de datos
2. Comprueba que la contraseña es correcta
3. Intenta registrar un nuevo usuario si es necesario
4. Verifica los logs del backend:
   ```powershell
   # Ver últimas líneas de logs
   Get-Content logs/spring.log -Tail 50
   ```

---

## 🌐 Problemas de Puerto

### Error: "Address already in use"

**Problema:**
```
Address already in use: bind
```

**Esto ocurre cuando el puerto ya está siendo usado.**

**Solución:**

1. **Mata los procesos usando los puertos:**
   ```powershell
   .\scripts\kill-ports.ps1
   ```

2. **O manualmente:**
   ```powershell
   # Backend (puerto 8080)
   Stop-Process -Port 8080 -Force
   
   # Expo (puerto 8081)
   Stop-Process -Port 8081 -Force
   
   # Web (puerto 3000)
   Stop-Process -Port 3000 -Force
   ```

3. **O cambia los puertos en la configuración:**
   - Backend: Modifica `application.properties` (server.port=8888)
   - Expo: `expo start --port 8085`
   - Web: Modifica el servidor web

---

## 📱 Problemas de Aplicación Móvil (Expo)

### Error: "Unable to resolve module"

**Problema:**
```
Unable to resolve module from ...
```

**Solución:**
```powershell
# Limpia el caché y reinstala dependencias
cd mobile
rm -r node_modules package-lock.json
npm install
```

### Expo Go no conecta a la app local

**Problema:**
El código QR no funciona o la app no carga.

**Soluciones:**

1. **Verifica que ambos están en la misma red:**
   - Tu computadora y teléfono deben estar en el mismo Wi-Fi
   - La red no debe bloquear puertos UDP

2. **Usa Expo Go con tunnel:**
   ```powershell
   cd mobile
   expo start --tunnel
   # Usa el código QR generado
   ```

3. **O usa USB (Android):**
   ```powershell
   adb devices  # Verifica que tu dispositivo aparece
   cd mobile
   expo start --localhost
   ```

### Error de Google Maps en la app

**Problema:**
```
Google Maps view not loading
```

**Solución:**
1. Verifica que `GOOGLE_MAPS_API_KEY` está en `.env.example`
2. Obtén una clave desde [Google Cloud Console](https://console.cloud.google.com/)
3. Habilita las APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Directions API
4. Actualiza el `.env` en la carpeta `mobile`

---

## 💳 Problemas de Pagos (Wompi)

### Error: "Invalid Wompi credentials"

**Solución:**
1. Verifica las credenciales en `.env`:
   ```env
   WOMPI_PUBLIC_KEY=pub_test_...
   WOMPI_PRIVATE_KEY=prv_test_...
   WOMPI_EVENTS_SECRET=test_events_...
   ```
2. Comprueba que estás usando credenciales de **Sandbox** para desarrollo
3. Obtén las credenciales desde [Wompi Dashboard](https://dashboard.wompi.co/)

### Transacción rechazada

**Problema:**
```
Transaction declined
```

**Para Testing:**
- Usa tarjeta de prueba: `4242 4242 4242 4242`
- Mes/Año: `12/25`
- CVV: `123`

---

## 📝 Problemas de Logs y Debugging

### No veo logs del backend

**Solución:**
1. Verifica que `logging.level.root=INFO` en `application.properties`
2. Revisa los logs en:
   ```powershell
   # En Windows
   Get-Content logs/spring.log
   
   # O en tiempo real
   Get-Content logs/spring.log -Tail 50 -Wait
   ```

### Habilitar debug mode

**Agregar a `application.properties`:**
```properties
logging.level.root=DEBUG
logging.level.com.homecare=DEBUG
logging.level.org.springframework=DEBUG
```

---

## 🔧 Problemas Generales

### Script PowerShell no se ejecuta

**Error:**
```
cannot be loaded because running scripts is disabled on this system
```

**Solución:**
```powershell
# Ejecuta PowerShell como Administrador, luego:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### El frontend web no carga

**Solución:**
1. Verifica que está corriendo:
   ```powershell
   netstat -ano | findstr :3000
   ```
2. Limpia la caché del navegador (Ctrl+Shift+Delete)
3. Intenta incógnito
4. Verifica la consola del navegador (F12) para errores

### Cambios en código no se reflejan

**Solución:**
1. **Backend**: Reinicia el servidor (mvn clean spring-boot:run)
2. **Frontend**: Recarga la página (Ctrl+F5)
3. **Mobile**: Recarga la app (doble R en la terminal de Expo)

---

## 🆘 Si aún tienes problemas

1. **Revisa los logs** de cada componente
2. **Verifica la conectividad** entre servicios:
   - Backend: http://localhost:8080/api/health
   - Base de datos: Intenta conectar con pgAdmin
3. **Consulta la documentación** del README relevante
4. **Abre un issue** en GitHub con:
   - Descripción del problema
   - Logs completos
   - Steps para reproducir
   - Tu entorno (OS, versiones, etc.)

---

## 📞 Soporte

- **GitHub Issues**: Para reportar bugs
- **Documentación**: Lee el README.md y otras guías
- **Pull Requests**: Contribuye mejoras a esta guía

¡Esperamos que esta guía te haya ayudado! 🚀
