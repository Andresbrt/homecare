# ⚡ QUICK DEPLOYMENT GUIDE

## 🚀 Deployment en 5 Minutos

### Windows
```powershell
# 1. Configurar variables de entorno
Copy-Item .env.example .env
# Editar .env con tus valores (especialmente DB_PASSWORD y JWT_SECRET)

# 2. Ejecutar deployment automático
.\deployment.ps1 -Environment production

# 3. Verificar
Start-Process "http://localhost:8080/actuator/health"
```

### Linux / macOS
```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores (especialmente DB_PASSWORD y JWT_SECRET)

# 2. Hacer script ejecutable
chmod +x deployment.sh

# 3. Ejecutar deployment automático
./deployment.sh production

# 4. Verificar
curl http://localhost:8080/actuator/health
```

---

## 📋 Checklist Rápido

- [ ] Clonar repositorio
- [ ] Copiar `.env.example` a `.env`
- [ ] Cambiar `DB_PASSWORD` a contraseña segura
- [ ] Cambiar `JWT_SECRET` a clave aleatoria (generar con: `openssl rand -base64 32`)
- [ ] Ejecutar deployment script
- [ ] Verificar que servicios estén corriendo: `docker-compose ps`
- [ ] Probar endpoint: `curl http://localhost:8080/actuator/health`
- [ ] ✅ Listo para producción

---

## 🔧 Comandos Post-Deployment

```bash
# Ver logs
docker-compose logs -f backend        # Backend
docker-compose logs -f database       # Base de datos

# Reiniciar servicios
docker-compose restart

# Detener
docker-compose down

# Backup de BD
docker exec viclean-db pg_dump -U viclean_user viclean > backup.sql

# Ejecutar SQL en BD
docker exec -i viclean-db psql -U viclean_user viclean < script.sql
```

---

## 🌐 URLs de Acceso

| Servicio | URL Local | URL Producción |
|----------|-----------|----------------|
| API | `http://localhost:8080/api` | `https://api.tu-dominio.com/api` |
| WebSocket | `ws://localhost:8080/ws` | `wss://api.tu-dominio.com/ws` |
| Health | `http://localhost:8080/actuator/health` | `https://api.tu-dominio.com/actuator/health` |
| Database | `localhost:5432` | `private-db.tu-dominio.com:5432` |

---

## 🔐 Variables de Entorno Críticas

```env
# Base de datos
DB_PASSWORD=tu-contraseña-segura-aqui

# JWT
JWT_SECRET=xxxxx-clave-de-32-caracteres-minimo

# Ambiente
SPRING_PROFILES_ACTIVE=production

# Google Maps
GOOGLE_MAPS_API_KEY=tu-api-key

# Wompi (pagos)
WOMPI_PUBLIC_KEY=prod_...
WOMPI_PRIVATE_KEY=prv_...
```

Generar JWT seguro:
```bash
# Linux/macOS
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) -replace '[^A-Za-z0-9+/=]'
```

---

## ✅ Verificación Post-Deploy

```bash
# Health check completo
curl http://localhost:8080/actuator/health

# Respuesta esperada:
# {"status":"UP","components":{"db":{"status":"UP"},...}}

# Ver containers
docker-compose ps

# Ver logs de error
docker-compose logs | grep -i error
```

---

## 🆘 Si Algo Falla

1. **BD no conecta**
   ```bash
   docker-compose restart database
   sleep 10
   docker-compose restart backend
   ```

2. **Backend no inicia**
   ```bash
   docker-compose logs backend
   # Ver el error, editar .env según sea necesario
   docker-compose restart backend
   ```

3. **Puerto en uso**
   ```bash
   # Cambiar en docker-compose.yml
   # De: ports: - "8080:8080"
   # A:  ports: - "8081:8080"
   ```

4. **Permisos en Linux**
   ```bash
   sudo usermod -aG docker $USER
   # Cerrar y abrir terminal
   ```

---

## 📞 Soporte Rápido

1. Ver logs: `docker-compose logs -f`
2. Revisar .env tiene todas las variables
3. Ejecutar health check
4. Revisar guía completa: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**¡Listo! Backend en vivo en 5 minutos ⚡**
