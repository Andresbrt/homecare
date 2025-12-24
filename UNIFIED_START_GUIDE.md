# 🚀 Guía de Inicialización Unificada - viclean

## 📋 ¿Qué opciones tengo para iniciar el proyecto?

Este proyecto ofrece **3 métodos** para iniciar todo el stack completo. Elige el que mejor se adapte a tu flujo de trabajo:

---

## ⚡ OPCIÓN 1: Script PowerShell Automático (RECOMENDADO)

### ✅ Ventajas
- Un solo comando inicia todo
- Verifica dependencias automáticamente
- Abre ventanas separadas para cada servicio
- Detecta y limpia puertos ocupados
- Perfecto para desarrollo local rápido

### 🎯 Uso Básico

```powershell
# Iniciar todo el stack
.\start-dev.ps1
```

### 🎨 Opciones Avanzadas

```powershell
# Reiniciar limpiando procesos previos
.\start-dev.ps1 -Clean

# Solo backend
.\start-dev.ps1 -SkipFrontend -SkipMobile

# Solo mobile
.\start-dev.ps1 -SkipBackend -SkipFrontend

# Backend + Mobile (sin frontend web)
.\start-dev.ps1 -SkipFrontend

# Saltando la base de datos (si usas una externa)
.\start-dev.ps1 -SkipDatabase
```

### 📊 Qué Inicia

| Servicio | Puerto | URL |
|----------|--------|-----|
| **Backend API** | 8080 | http://localhost:8080 |
| **Swagger Docs** | 8080 | http://localhost:8080/swagger-ui.html |
| **Frontend Web** | 3000 | http://localhost:3000 |
| **Mobile Expo** | 8081 | http://localhost:8081 |
| **Expo DevTools** | 19002 | http://localhost:19002 |

### 🛑 Detener Todo

```powershell
# Cerrar cada ventana PowerShell con Ctrl+C
# O limpiar puertos:
.\scripts\kill-ports.ps1
```

---

## 🐳 OPCIÓN 2: Docker Compose

### ✅ Ventajas
- Entorno aislado y consistente
- Base de datos PostgreSQL incluida
- Fácil deployment y escalado
- No contamina tu sistema local
- Ideal para CI/CD

### 📦 Requisitos Previos

```bash
# Verificar Docker instalado
docker --version
docker-compose --version
```

### 🚀 Comandos

```bash
# Construir e iniciar todo
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Solo logs del backend
docker-compose logs -f backend

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BD)
docker-compose down -v

# Reconstruir tras cambios en código
docker-compose up -d --build
```

### 📊 Servicios Incluidos

```yaml
viclean-db:       # PostgreSQL en puerto 5432
viclean-backend:  # Spring Boot en puerto 8080
# viclean-frontend (opcional)
# viclean-redis (opcional)
```

### 🔧 Configuración

Crea archivo `.env` con tus variables:

```bash
cp .env.example .env
# Edita .env con tus valores
```

### 🔍 Troubleshooting Docker

```bash
# Ver estado de contenedores
docker-compose ps

# Entrar al backend
docker exec -it viclean-backend sh

# Ver logs de base de datos
docker-compose logs database

# Reiniciar servicio específico
docker-compose restart backend
```

---

## 🎨 OPCIÓN 3: VS Code Tasks (Integrado en IDE)

### ✅ Ventajas
- Integrado directamente en VS Code
- Atajos de teclado personalizables
- Panel de tareas organizado
- Ideal para desarrollo diario

### 🎯 Uso

1. **Abrir paleta de comandos**: `Ctrl + Shift + P`
2. **Escribir**: `Tasks: Run Task`
3. **Seleccionar tarea**:

### 📋 Tasks Disponibles

| Emoji | Tarea | Descripción |
|-------|-------|-------------|
| 🚀 | Iniciar Todo | Ejecuta `start-dev.ps1` completo |
| 🔥 | Backend - Spring Boot | Solo backend en puerto 8080 |
| 📱 | Mobile - Expo Start | Solo app mobile con Expo |
| 🐳 | Docker - Iniciar Todo | `docker-compose up -d` |
| 🛑 | Docker - Detener Todo | `docker-compose down` |
| 🧪 | Test - Endpoints Backend | Ejecuta smoke tests |
| 🧹 | Limpiar Puertos | Mata procesos en puertos |

### ⌨️ Atajo Rápido

```
Ctrl + Shift + B  →  Ejecuta tarea por defecto (Iniciar Todo)
```

### 🔧 Personalizar

Edita `.vscode/tasks.json` para ajustar tareas a tu gusto.

---

## 📊 Comparación de Métodos

| Característica | PowerShell Script | Docker Compose | VS Code Tasks |
|----------------|-------------------|----------------|---------------|
| **Rapidez inicial** | ⚡⚡⚡ | ⚡⚡ | ⚡⚡⚡ |
| **Aislamiento** | ❌ | ✅✅✅ | ❌ |
| **Facilidad setup** | ✅✅✅ | ✅✅ | ✅✅✅ |
| **Debugging** | ✅✅✅ | ✅ | ✅✅✅ |
| **Producción** | ❌ | ✅✅✅ | ❌ |
| **Flexibilidad** | ✅✅✅ | ✅✅ | ✅✅ |

---

## 🎓 Flujos de Trabajo Recomendados

### 👨‍💻 Desarrollo Diario (PowerShell)
```powershell
# Al empezar el día
.\start-dev.ps1 -Clean

# Trabajar normalmente...

# Al terminar
# Ctrl+C en cada ventana
```

### 🚢 Preparar para Deploy (Docker)
```bash
# Verificar que todo funciona en contenedores
docker-compose up -d
docker-compose logs -f

# Hacer cambios...
docker-compose up -d --build

# Push a producción
docker-compose -f docker-compose.prod.yml up -d
```

### 🔧 Debug Rápido (VS Code)
```
Ctrl+Shift+B  →  Iniciar solo lo necesario
F5            →  Attach debugger
```

---

## 🆘 Problemas Comunes

### ❌ Puerto 8080 ocupado
```powershell
.\scripts\kill-ports.ps1
# O manualmente:
Get-NetTCPConnection -LocalPort 8080 | % { Stop-Process $_.OwningProcess -Force }
```

### ❌ Base de datos no conecta
```bash
# Verificar PostgreSQL corriendo
Get-NetTCPConnection -LocalPort 5432

# Con Docker:
docker-compose up database
```

### ❌ Expo no inicia
```bash
cd mobile
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

### ❌ Backend no compila
```bash
mvn clean install -DskipTests
```

---

## 📚 Archivos de Configuración

```
proyecto/
├── start-dev.ps1              # Script principal
├── docker-compose.yml         # Orquestación Docker
├── Dockerfile.backend         # Build backend
├── .env.example               # Template variables
├── .vscode/
│   └── tasks.json            # Tasks VS Code
└── scripts/
    └── kill-ports.ps1        # Limpieza puertos
```

---

## 🎯 Recomendación Final

**Para desarrollo local diario**: 
```powershell
.\start-dev.ps1 -Clean
```

**Para entornos de producción/staging**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Para trabajo en VS Code**:
```
Ctrl+Shift+B
```

---

**¡Listo para desarrollar! 🚀**
