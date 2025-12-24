# Homecare - Aplicación Completa de Servicios de Limpieza Doméstica

Homecare es una aplicación full-stack completa que conecta usuarios que necesitan servicios de limpieza con proveedores de servicios profesionales, similar a Uber/InDrive pero especializada en limpieza doméstica. Incluye un backend robusto construido con Spring Boot y un frontend moderno e intuitivo.

## 🚀 Características Principales

### Para Clientes
- ✅ Registro y autenticación de usuarios
- ✅ Búsqueda y filtrado de proveedores de servicio
- ✅ Reserva de servicios de limpieza
- ✅ Seguimiento en tiempo real del estado del servicio
- ✅ Sistema de pagos integrado
- ✅ Sistema de calificaciones y reseñas
- ✅ Gestión de perfil y direcciones

### Para Proveedores de Servicio
- ✅ Registro como proveedor de servicios
- ✅ Gestión de servicios ofrecidos
- ✅ Recepción y gestión de reservas
- ✅ Sistema de calificaciones
- ✅ Gestión de disponibilidad
- ✅ Panel de estadísticas

### Para Administradores
- ✅ Panel de administración completo
- ✅ Gestión de usuarios y proveedores
- ✅ Moderación de reseñas
- ✅ Estadísticas del sistema
- ✅ Gestión de pagos y comisiones

## 🛠️ Tecnologías Utilizadas

### Backend
- **Framework**: Spring Boot 3.2.5
- **Base de Datos**: PostgreSQL (con soporte para H2 en desarrollo)
- **Seguridad**: Spring Security + JWT Authentication
- **ORM**: JPA/Hibernate
- **Documentación API**: Swagger/OpenAPI 3
- **Validación**: Bean Validation
- **Build Tool**: Maven
- **Java Version**: 17

### Frontend
- **HTML5**: Estructura semántica moderna
- **CSS3**: Estilos responsivos con Flexbox/Grid
- **JavaScript ES6+**: Lógica de aplicación moderna
- **Fetch API**: Comunicación asíncrona con backend
- **LocalStorage**: Persistencia de sesión cliente
- **Responsive Design**: Adaptativo a dispositivos móviles

## 📋 Prerrequisitos

- Java 17 o superior
- Maven 3.6 o superior
- PostgreSQL 12 o superior (para producción)

## 🚀 Instalación y Configuración

### 🎯 Inicio Rápido (Todo en 1 Comando)

```powershell
# Clonar e iniciar proyecto completo
git clone https://github.com/tu-usuario/viclean.git
cd viclean
.\start-dev.ps1
```

**¡Eso es todo!** El script automáticamente:
- ✅ Verifica dependencias (Java, Maven, Node.js)
- ✅ Inicia el backend en puerto 8080
- ✅ Inicia la app móvil en puerto 8081
- ✅ Abre ventanas separadas para cada servicio

### 📚 Métodos de Inicio Disponibles

Tienes **3 opciones** para iniciar el stack completo. [Ver guía detallada →](UNIFIED_START_GUIDE.md)

| Método | Comando | Mejor Para |
|--------|---------|------------|
| **PowerShell Script** ⚡ | `.\start-dev.ps1` | Desarrollo diario |
| **Docker Compose** 🐳 | `docker-compose up -d` | Producción/Equipos |
| **VS Code Tasks** 🎨 | `Ctrl+Shift+B` | Integrado en IDE |

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/viclean.git
cd viclean
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus valores (DB, JWT, APIs)
```

**Variables importantes:**
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Base de datos
- `JWT_SECRET` - Clave secreta para tokens (cambiar en producción)
- `GOOGLE_OAUTH_CLIENT_ID` - OAuth Google (mobile)
- `GOOGLE_MAPS_API_KEY` - Google Maps
- `WOMPI_*` - Pasarela de pagos (Colombia)

### 3. Configurar la base de datos (Opcional con Docker)

#### Con Docker Compose (Automático)
```bash
docker-compose up database -d
# PostgreSQL estará en localhost:5432
```

#### PostgreSQL Manual (Producción)
```sql
CREATE DATABASE viclean;
CREATE USER viclean_user WITH ENCRYPTED PASSWORD 'viclean_pass';
GRANT ALL PRIVILEGES ON DATABASE viclean TO viclean_user;
```

### 4. Ejecutar la aplicación

#### 🚀 OPCIÓN 1: Script Unificado (RECOMENDADO)
```bash
# Inicia todo el stack (Backend + Frontend + Mobile)
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1

# Opciones disponibles:
.\start-dev.ps1 -Clean                           # Reinicia todo limpiando procesos previos
.\start-dev.ps1 -SkipBackend                     # Solo frontend y mobile
.\start-dev.ps1 -SkipMobile                      # Solo backend y frontend
.\start-dev.ps1 -SkipFrontend -SkipMobile        # Solo backend
```

#### 🐳 OPCIÓN 2: Docker Compose
```bash
# Iniciar todo con Docker
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener todo
docker-compose down
```

#### 🛠️ OPCIÓN 3: VS Code Tasks
1. Presiona `Ctrl+Shift+P`
2. Escribe "Tasks: Run Task"
3. Selecciona "🚀 Iniciar Todo (Dev Stack Completo)"

#### ⚙️ OPCIÓN 4: Manual (Componente por componente)

**Backend**
```bash
mvn spring-boot:run
```
La API estará disponible en: `http://localhost:8080/api`

**Mobile App**
```bash
cd mobile
npm install --legacy-peer-deps
npx expo start
```

**Frontend Web**
1. Abrir el archivo `frontend/index.html` en tu navegador web
2. O usar un servidor web local:
```bash
# Con Python 3
python -m http.server 3000

# Con Node.js (http-server)
npx http-server frontend/ -p 3000
```
El frontend estará disponible en: `http://localhost:3000`

## 🖥️ Interfaz de Usuario

### Características del Frontend
- **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y desktop
- **Navegación Intuitiva**: Interfaz similar a aplicaciones de servicios populares
- **Autenticación Completa**: Formularios de login y registro con validación
- **Gestión de Servicios**: Los proveedores pueden crear y gestionar sus servicios
- **Reservas**: Los clientes pueden reservar servicios fácilmente
- **Perfil de Usuario**: Gestión completa de información personal
- **Notificaciones**: Sistema de alertas y confirmaciones en tiempo real
- **Modo Oscuro**: Soporte automático según las preferencias del sistema

### Páginas Principales
- **Inicio**: Landing page con presentación de servicios
- **Login/Registro**: Autenticación de usuarios con roles
- **Servicios**: Listado y gestión de servicios de limpieza
- **Perfil**: Información personal y configuración de cuenta

### Flujo de Usuario

#### Para Clientes
1. Registro con rol "Cliente"
2. Explorar servicios disponibles
3. Reservar servicios
4. Gestionar perfil personal

#### Para Proveedores
1. Registro con rol "Proveedor de Servicios"
2. Completar información de empresa
3. Crear y gestionar servicios
4. Recibir y gestionar reservas

## 📚 Documentación de API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

## 🔑 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a endpoints protegidos:

1. Registra un usuario: `POST /api/auth/register`
2. Inicia sesión: `POST /api/auth/login`
3. Usa el token recibido en el header: `Authorization: Bearer {token}`

### Roles de Usuario
- **CUSTOMER**: Usuarios que solicitan servicios
- **SERVICE_PROVIDER**: Proveedores de servicios de limpieza
- **ADMIN**: Administradores del sistema

## 📖 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/verify?token={token}` - Verificación de email
- `POST /api/auth/forgot-password` - Solicitar restablecimiento de contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña

### Usuarios
- `GET /api/users/{id}` - Obtener usuario por ID
- `PUT /api/users/{id}` - Actualizar perfil de usuario
- `DELETE /api/users/{id}` - Desactivar usuario

### Servicios
- `GET /api/services` - Listar servicios disponibles
- `GET /api/services/search` - Búsqueda avanzada de servicios
- `POST /api/services` - Crear nuevo servicio (Proveedores)
- `PUT /api/services/{id}` - Actualizar servicio
- `DELETE /api/services/{id}` - Eliminar servicio

### Reservas
- `POST /api/bookings` - Crear nueva reserva
- `GET /api/bookings` - Listar reservas del usuario
- `GET /api/bookings/{id}` - Obtener detalles de reserva
- `PUT /api/bookings/{id}/status` - Actualizar estado de reserva
- `POST /api/bookings/{id}/cancel` - Cancelar reserva

### Calificaciones
- `POST /api/ratings` - Crear calificación
- `GET /api/ratings/provider/{providerId}` - Calificaciones de proveedor
- `PUT /api/ratings/{id}` - Actualizar calificación

## 🗄️ Modelo de Datos

### Entidades Principales

#### User
- Información personal del usuario
- Credenciales de autenticación
- Dirección y ubicación
- Rol en el sistema

#### ServiceProvider
- Información del proveedor de servicios
- Servicios ofrecidos
- Calificaciones y estadísticas
- Configuración de disponibilidad

#### Service
- Información del servicio
- Precios y duración estimada
- Tipo de servicio

#### Booking
- Detalles de la reserva
- Fechas y horarios
- Estado del servicio
- Dirección del servicio

#### Payment
- Información del pago
- Estado de la transacción
- Método de pago

#### Rating
- Calificación del servicio
- Comentarios
- Información del evaluador

## ⚙️ Configuración AI (toggle en runtime)

- **Lectura (público):** `GET /api/config/ai`
	- Respuesta: `{ "enabled": true|false, "model": "gpt-5.1-codex-max" }`

- **Actualización (rol ADMIN):** `PUT /api/config/ai`
	- Headers: `Authorization: Bearer <token_admin>`
	- Ejemplo:
		```bash
		curl -X PUT "http://localhost:8080/api/config/ai" \
			-H "Authorization: Bearer $TOKEN_ADMIN" \
			-H "Content-Type: application/json" \
			-d '{"enabled":true,"model":"gpt-5.1-codex-max"}'
		```

- **Flags backend:** `AI_ENABLED`, `AI_MODEL` en `.env` y `application-*.properties` (incl. Docker).
- **Mobile (Admin):** Perfil → Configuración → "Configurar AI (Admin)" para alternar `enabled` y `model` usando el endpoint protegido.

- **Tests de seguridad:** `ConfigControllerSecurityTest` cubre GET público (200), PUT admin (200) y PUT no admin (403). Suite completa pasando (`mvn test`).

- **Rate limiting opcional (PUT /api/config/ai):** habilítalo con `ai.rate-limit.enabled=true` (por defecto `false`). Límite por IP: `ai.rate-limit.max-requests` (default 20) cada `ai.rate-limit.window-seconds` (default 60s). Respuesta 429 cuando se excede.

- **Salud/Métricas:** Actuator expone `ai.enabled`, `ai.model` y parámetros de rate limiting en `/actuator/health` (requiere `spring-boot-starter-actuator`).

## 🧪 Testing

### Ejecutar tests
```bash
mvn test
```

### Test de integración
```bash
mvn integration-test
```

## 🚀 Deployment

### Variables de Entorno de Producción
```bash
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=jdbc:postgresql://tu-servidor:5432/cleanhome_db
export DATABASE_USERNAME=tu-usuario
export DATABASE_PASSWORD=tu-password
export JWT_SECRET=tu-clave-secreta-muy-larga-y-segura
export MAIL_USERNAME=tu-email@dominio.com
export MAIL_PASSWORD=tu-password-de-app
```

### Docker (Opcional)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/cleanhome-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Estructura del Proyecto

```
cleanhome-backend/
├── src/main/java/com/cleanhome/backend/
│   ├── config/           # Configuraciones de Spring
│   ├── controller/       # Controladores REST
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # Entidades JPA
│   ├── enums/           # Enumeraciones
│   ├── repository/      # Repositorios JPA
│   ├── security/        # Configuración de seguridad
│   └── service/         # Lógica de negocio
├── src/main/resources/
│   ├── application.properties
│   └── application-dev.properties
├── frontend/
│   ├── index.html       # Página principal del frontend
│   ├── css/
│   │   └── styles.css   # Estilos de la aplicación
│   └── js/
│       └── app.js       # Lógica JavaScript de la aplicación
├── pom.xml              # Configuración de Maven
└── README.md            # Documentación del proyecto
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Para preguntas o soporte, contacta a:
- Email: dev@cleanhome.com
- GitHub: [CleanHome Repository](https://github.com/tu-usuario/cleanhome-backend)

---

¡Gracias por usar CleanHome! 🏠✨