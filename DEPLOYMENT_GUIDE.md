# 🚀 GUÍA DE DEPLOYMENT - HOME CARE

## Requisitos Previos

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git**
- **Acceso a servidor** (AWS, DigitalOcean, Azure, etc.)
- **Variables de entorno** configuradas

---

## 📋 Paso 1: Preparar Código

```bash
# Clonar repositorio
git clone <repositorio>
cd homecare

# Actualizar código
git pull origin main

# Compilar Backend (opcional, Docker lo hace automáticamente)
mvn clean package -DskipTests
```

---

## 🔐 Paso 2: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con valores reales
nano .env  # o tu editor preferido
```

**Campos críticos a cambiar:**
- `DB_PASSWORD` - Contraseña segura para PostgreSQL
- `JWT_SECRET` - Clave larga y aleatoria (mín. 32 caracteres)
- `WOMPI_*` - Credenciales de pasarela de pagos
- `GOOGLE_MAPS_API_KEY` - API key de Google Maps

Genera JWT_SECRET seguro:
```bash
openssl rand -base64 32
```

---

## 🐳 Paso 3: Construir y Levantar Servicios

```bash
# Construir imagen Docker
docker-compose build

# Levantar servicios (backend + db)
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs del backend
docker-compose logs -f backend

# Ver logs de BD
docker-compose logs -f database
```

**Salida esperada:**
```
✓ backend is up (running)
✓ database is up (running)
```

---

## ✅ Paso 4: Verificar que Todo Funciona

### Salud de la aplicación
```bash
curl http://localhost:8080/actuator/health
# Respuesta: {"status":"UP"}
```

### Tests de endpoints
```bash
# Obtener configuración
curl http://localhost:8080/api/config

# Verificar base de datos
curl http://localhost:8080/api/health
```

### Verificar base de datos
```bash
# Conectarse a PostgreSQL
docker exec -it viclean-db psql -U viclean_user -d viclean

# En la consola psql:
\dt          # Listar todas las tablas
\l           # Listar bases de datos
SELECT COUNT(*) FROM users;  # Verificar datos
\q           # Salir
```

---

## 📦 Paso 5: Deployment a Producción

### Opción A: AWS EC2

```bash
# 1. SSH a servidor EC2
ssh -i tu-clave.pem ubuntu@tu-servidor.com

# 2. Instalar Docker y Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Clonar repositorio
git clone <repositorio>
cd homecare

# 4. Copiar .env
cp .env.example .env
# Editar .env con valores de producción

# 5. Levantar servicios
docker-compose up -d

# 6. Configurar reverse proxy (Nginx)
sudo apt update && sudo apt install nginx
```

Configuración Nginx (`/etc/nginx/sites-available/homecare`):
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/homecare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

### Opción B: DigitalOcean / Heroku

```bash
# DigitalOcean App Platform
doctl apps create --spec app.yaml

# Heroku
heroku create tu-app-name
heroku config:set JWT_SECRET=xxxxx
git push heroku main
```

---

## 🔄 Paso 6: Mantenimiento Continuo

### Actualizar código
```bash
git pull origin main
docker-compose build
docker-compose up -d
```

### Backups de BD
```bash
# Crear backup
docker exec viclean-db pg_dump -U viclean_user viclean > backup.sql

# Restaurar
docker exec -i viclean-db psql -U viclean_user viclean < backup.sql
```

### Monitoreo
```bash
# Ver logs en vivo
docker-compose logs -f

# Estadísticas de contenedores
docker stats

# Espacio en disco
docker system df
```

### Limpiar recursos
```bash
# Remover contenedores detenidos
docker container prune

# Remover imágenes sin usar
docker image prune

# Remover volúmenes sin usar
docker volume prune

# Todo (CUIDADO)
docker system prune -a
```

---

## 🚨 Troubleshooting

### Backend no inicia
```bash
# Ver error detallado
docker-compose logs backend

# Reiniciar
docker-compose restart backend
```

### Base de datos no conecta
```bash
# Verificar que BD está healthy
docker-compose logs database

# Reconectar
docker-compose down
docker-compose up -d
```

### Puerto en uso
```bash
# Encontrar qué usa puerto 8080
sudo lsof -i :8080

# O cambiar puerto en docker-compose.yml
# Cambiar "8080:8080" a "8081:8080"
```

### Permisos negados
```bash
# Ejecutar con sudo
sudo docker-compose up -d

# O agregar usuario a grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📊 Checklist Pre-Producción

- [ ] Variables de entorno (.env) configuradas
- [ ] JWT_SECRET generado y seguro
- [ ] Base de datos con backup
- [ ] SSL/HTTPS configurado
- [ ] Firewall permitiendo puerto 80 y 443
- [ ] Dominios DNS configurados
- [ ] Logs monitoreados (journalctl, CloudWatch, etc.)
- [ ] Email de alertas configurado
- [ ] Plan de recuperación ante desastres

---

## 📞 Soporte

Para problemas, revisar:
1. Logs: `docker-compose logs -f`
2. Health checks: `curl http://localhost:8080/actuator/health`
3. Documentación: Ver README.md principal
4. Issues en GitHub: Buscar problema similar

---

**¡Deployment completado! 🎉**

Backend disponible en: `http://localhost:8080` (desarrollo) o `https://tu-dominio.com` (producción)

Mobile conecta a: `https://tu-dominio.com/api`
