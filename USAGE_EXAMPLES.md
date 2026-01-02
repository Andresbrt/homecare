# 🎯 Ejemplos Prácticos de Uso - viclean

## 🚀 Escenarios Comunes de Desarrollo

### 1️⃣ Primer Día - Setup Inicial

```powershell
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/viclean.git
cd viclean

# 2. Configurar variables
cp .env.example .env
# Editar .env con tus credenciales

# 3. Iniciar stack completo
.\start-dev.ps1

# 4. Abrir en navegador
start http://localhost:8080/swagger-ui.html    # API Docs
start http://localhost:19002                    # Expo DevTools

# 5. Probar endpoints
cd mobile
.\test_endpoints.ps1 -Email "test@viclean.com" -Password "Secret123"
```

**Resultado esperado:**
- 🔥 Backend corriendo en puerto 8080
- 📱 Expo Metro en puerto 8081
- ✅ 3 ventanas PowerShell abiertas

---

### 2️⃣ Desarrollo Solo Backend

```powershell
# Iniciar solo backend (sin frontend/mobile)
.\start-dev.ps1 -SkipFrontend -SkipMobile

# O manualmente:
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Probar endpoints
curl http://localhost:8080/api/services
curl http://localhost:8080/actuator/health
```

**Uso típico:** Desarrollando nuevos endpoints, debugging backend

---

### 3️⃣ Desarrollo Solo Mobile

```powershell
# Iniciar solo app móvil
.\start-dev.ps1 -SkipBackend -SkipFrontend

# O manualmente:
cd mobile
npx expo start

# Opciones Expo:
# - Presiona 'a' para Android emulator
# - Escanea QR con Expo Go app
# - Presiona 'w' para abrir en navegador
```

**Uso típico:** Trabajando en UI/UX, componentes React Native

---

### 4️⃣ Reinicio Limpio (Puertos Ocupados)

```powershell
# Si algo quedó colgado en puerto 8080/8081
.\start-dev.ps1 -Clean

# O limpiar manualmente:
.\scripts\kill-ports.ps1

# Verificar puertos libres:
Get-NetTCPConnection -LocalPort 8080,8081,19000 -State Listen
```

**Uso típico:** Error "Address already in use", procesos zombies

---

### 5️⃣ Testing Full Stack

```powershell
# 1. Iniciar todo
.\start-dev.ps1

# 2. Ejecutar tests backend
mvn test

# 3. Probar endpoints
.\mobile\test_endpoints.ps1

# 4. Probar en dispositivo real
# Expo Go app → Escanear QR → Probar flujos
```

---

### 6️⃣ Preparar para Deploy con Docker

```bash
# 1. Build imagen backend
docker build -f Dockerfile.backend -t viclean-backend:latest .

# 2. Iniciar stack completo
docker-compose up -d

# 3. Verificar salud
docker-compose ps
docker-compose logs -f backend

# 4. Probar endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:8080/api/services

# 5. Detener cuando termines
docker-compose down
```

---

### 7️⃣ Debug con VS Code

```
1. Ctrl+Shift+B → Iniciar Todo
2. F5 → Attach Debugger (backend)
3. Breakpoints en UserService.java
4. Probar desde mobile app
```

**Configuración debug en `.vscode/launch.json`:**
```json
{
  "type": "java",
  "name": "Debug Spring Boot",
  "request": "attach",
  "hostName": "localhost",
  "port": 5005
}
```

---

### 8️⃣ Trabajo en Equipo

**Desarrollador Frontend:**
```powershell
# Solo necesita backend corriendo
.\start-dev.ps1 -SkipMobile -SkipFrontend
# Luego trabaja en /frontend
```

**Desarrollador Mobile:**
```powershell
# Backend ya corriendo (Docker o servidor remoto)
cd mobile
npx expo start
```

**Desarrollador Backend:**
```powershell
# Solo backend
.\start-dev.ps1 -SkipFrontend -SkipMobile
# O con hot-reload:
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```

---

### 9️⃣ Actualizar Dependencias

**Backend:**
```bash
mvn versions:display-dependency-updates
mvn clean install -U
```

**Mobile:**
```bash
cd mobile
npm outdated
npm update --legacy-peer-deps
npx expo-doctor
```

---

### 🔟 Cambiar de Rama (Feature Branch)

```bash
# 1. Detener servicios
# Ctrl+C en cada ventana

# 2. Cambiar rama
git checkout feature/nueva-funcionalidad

# 3. Actualizar dependencias si cambiaron
mvn clean install -DskipTests
cd mobile && npm install --legacy-peer-deps

# 4. Reiniciar limpio
.\start-dev.ps1 -Clean
```

---

## 🛠️ Comandos Útiles Combinados

### Ver Logs de Todo

```powershell
# PowerShell Script (ventanas separadas)
# Los logs aparecen en cada ventana

# Docker Compose
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo base de datos
docker-compose logs -f database
```

### Resetear Base de Datos

```bash
# Con Docker
docker-compose down -v  # ⚠️ BORRA TODOS LOS DATOS
docker-compose up database -d

# Manualmente
psql -U viclean_user -d viclean
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### Build para Producción

```bash
# Backend JAR
mvn clean package -DskipTests
java -jar target/cleanhome-backend-1.0.0.jar

# Mobile APK
cd mobile
eas build --platform android --profile production

# Docker Image
docker build -f Dockerfile.backend -t viclean:1.0.0 .
docker push tu-registry/viclean:1.0.0
```

---

## 📊 Monitoreo y Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/metrics

# Base de datos
docker exec -it viclean-db psql -U viclean_user -d viclean -c "SELECT count(*) FROM users;"

# Expo status
curl http://localhost:8081/status
```

---

## 🔧 Troubleshooting Rápido

| Problema | Comando Fix |
|----------|-------------|
| Puerto ocupado | `.\scripts\kill-ports.ps1` |
| BD no conecta | `docker-compose up database -d` |
| Expo crashea | `cd mobile; rm -rf node_modules; npm i --legacy-peer-deps` |
| Backend no compila | `mvn clean install -DskipTests` |
| Cache corrupto | `mvn clean; rm -rf target` |
| Expo cache | `npx expo start --clear` |

---

## 🎓 Workflow Recomendado Diario

```powershell
# 🌅 MAÑANA
.\start-dev.ps1 -Clean
git pull origin develop

# 💻 DURANTE EL DÍA
# - Desarrollar features
# - Hacer commits pequeños
# - Probar con test_endpoints.ps1

# 🌙 TARDE
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/mi-feature
# Ctrl+C en todas las ventanas
```

---

**¡Todo listo para desarrollar eficientemente! 🚀**
