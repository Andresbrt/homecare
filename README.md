# Homecare - Aplicación Completa de Servicios de Limpieza Doméstica

Homecare es una aplicación full-stack completa que conecta usuarios que necesitan servicios de limpieza con proveedores de servicios profesionales. Incluye un backend robusto construido con Spring Boot, una aplicación móvil con React Native (Expo) y un frontend web.

## 🎨 Identidad Visual

La aplicación utiliza una paleta de colores profesional para asegurar una experiencia de usuario coherente y agradable.

| Color | HEX | Descripción |
|---|---|---|
| Azul Marino Profundo | `#001B38` | Color de fondo principal, textos importantes. |
| Azul Petróleo | `#0E4D68` | Fondos secundarios, acentos oscuros. |
| Turquesa Fresco | `#49C0BC` | Botones principales, enlaces y elementos interactivos. |
| Blanco Puro | `#FFFFFF` | Textos sobre fondos oscuros, áreas de contenido. |

Estos colores se aplican tanto en la aplicación móvil como en la web para mantener una identidad de marca unificada.

## 🚀 Características Principales

### Para Clientes
- ✅ Registro y autenticación de usuarios
- ✅ Búsqueda y filtrado de proveedores de servicio
- ✅ Reserva de servicios de limpieza
- ✅ Seguimiento en tiempo real del estado del servicio
- ✅ Sistema de pagos integrado (Wompi)
- ✅ Sistema de calificaciones y reseñas

### Para Proveedores de Servicio
- ✅ Registro como proveedor de servicios
- ✅ Gestión de servicios ofrecidos
- ✅ Recepción y gestión de reservas
- ✅ Panel de estadísticas y ganancias

### Para Administradores
- ✅ Panel de administración completo
- ✅ Gestión de usuarios y proveedores
- ✅ Configuración de parámetros del sistema en tiempo real

## 🛠️ Tecnologías Utilizadas

- **Backend**:
    - [**Spring Boot 3**](https://spring.io/projects/spring-boot): Framework para la creación de aplicaciones Java robustas y configurables.
    - [**Java 17**](https://openjdk.java.net/projects/jdk/17/): Lenguaje de programación utilizado para el desarrollo del backend.
    - [**Spring Security**](https://spring.io/projects/spring-security): Marco de seguridad para autenticación y autorización.
    - [**JPA/Hibernate**](https://hibernate.org/orm/): Para la persistencia de datos y el mapeo objeto-relacional.
    - [**Maven**](https://maven.apache.org/): Herramienta de gestión de proyectos y construcción.
- **Bases de Datos**:
    - [**PostgreSQL**](https://www.postgresql.org/): Base de datos relacional robusta (recomendada).
    - [**H2**](https://www.h2database.com/html/main.html): Base de datos en memoria para desarrollo y pruebas.
    - [**MySQL**](https://www.mysql.com/): Base de datos relacional alternativa.
- **App Móvil**:
    - [**React Native**](https://reactnative.dev/): Framework para construir aplicaciones móviles nativas multiplataforma.
    - [**Expo**](https://expo.dev/): Herramientas y servicios para desarrollar, construir, desplegar y repetir rápidamente sobre React Native.
- **Frontend Web**:
    - [**HTML5**](https://developer.mozilla.org/es/docs/Web/HTML/HTML5): Estructura semántica moderna para la web.
    - [**CSS3**](https://developer.mozilla.org/es/docs/Web/CSS): Estilos responsivos con Flexbox/Grid.
    - [**JavaScript (ES6+)**](https://developer.mozilla.org/es/docs/Web/JavaScript): Lógica de aplicación moderna.
- **API Docs**:
    - [**Swagger/OpenAPI 3**](https://swagger.io/specification/): Para la documentación interactiva de la API.

## 📋 Prerrequisitos

Para poder desarrollar y ejecutar Homecare, necesitarás instalar las siguientes herramientas:

-   [**Java Development Kit (JDK) 17+**](https://www.oracle.com/java/technologies/downloads/): Se recomienda una distribución LTS como OpenJDK 17 o superior.
-   [**Apache Maven 3.6+**](https://maven.apache.org/download.cgi): Herramienta de gestión de proyectos para el backend de Spring Boot.
-   [**Node.js 18+**](https://nodejs.org/en/download/): Plataforma de tiempo de ejecución JavaScript (se recomienda la versión LTS) para la aplicación móvil.
-   [**Docker**](https://www.docker.com/products/docker-desktop/) (Opcional): Para ejecutar la base de datos (PostgreSQL) y otros servicios en contenedores durante el desarrollo.

Asegúrate de que estas herramientas estén correctamente instaladas y configuradas en tu sistema antes de continuar.

## 🚀 Instalación y Configuración

El método recomendado para iniciar el entorno de desarrollo es usar los scripts de PowerShell incluidos, que automatizan todo el proceso.

### 1. Clonar el Repositorio
```powershell
git clone https://github.com/Andresbrt/homecare.git
cd homecare
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` basado en el ejemplo proporcionado.
```powershell
cp .env.example .env
```
Luego, abre el archivo `.env` y rellena las variables necesarias, como las claves de API y las credenciales de la base de datos.

### 3. Configurar la Base de Datos
La aplicación está diseñada para ser flexible. Tienes varias opciones:
- **AWS RDS (Recomendado para Producción):** Sigue la [**Guía de Configuración de AWS RDS**](./AWS_RDS_SETUP.md) para un entorno robusto y escalable.
- **Docker (Recomendado para Desarrollo):** Simplemente ejecuta `docker-compose up -d database` para levantar un contenedor de PostgreSQL.
- **Local:** Puedes instalar PostgreSQL o MySQL localmente.

Para más detalles sobre todas las opciones, consulta la [**Guía de Configuración de Base de Datos**](./DATABASE_SETUP.md).

### 4. Iniciar el Entorno de Desarrollo
El siguiente comando inicia el backend y la aplicación móvil en modo de desarrollo con recarga en caliente.
```powershell
# Inicia todo el stack (Backend + App Móvil)
.\start-dev.ps1
```
Para otras opciones de inicio (como iniciar solo el backend o usar Docker), consulta la [**Guía de Inicio Unificada**](./UNIFIED_START_GUIDE.md).

## 📚 Documentación de API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **API Docs**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:
1. Haz un Fork del proyecto.
2. Crea una rama para tu nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto
- **GitHub**: [Homecare Repository](https://github.com/Andresbrt/homecare)
---

¡Gracias por usar Homecare! 🏠✨