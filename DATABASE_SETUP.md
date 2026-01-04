# ==========================================
# Guía de Configuración de la Base de Datos de Homecare
# ==========================================

Esta guía cubre las opciones para configurar la base de datos para la aplicación Homecare.

## Opción 1: AWS RDS (Recomendado para Producción y Desarrollo en la Nube)

Para un entorno seguro, escalable y fácil de supervisar, recomendamos utilizar Amazon RDS con PostgreSQL. La aplicación está preconfigurada para conectarse a una instancia de PostgreSQL utilizando variables de entorno.

Hemos preparado una guía detallada para configurar una base de datos en el nivel gratuito de AWS.

➡️ **Consulta la guía completa aquí: [Guía de Configuración de AWS RDS](./AWS_RDS_SETUP.md)**

Una vez configurado, solo necesitas establecer las variables de entorno como se indica en la guía y el backend se conectará automáticamente.

## Opción 2: MySQL Local (Alternativa para Desarrollo Local)

Si prefieres un entorno de desarrollo completamente local, puedes usar MySQL.

### 1. Instalación de MySQL
- **Descargar e instalar MySQL Community Server:** [dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- Durante la instalación, puedes usar la configuración predeterminada. Asegúrate de recordar la contraseña que establezcas para el usuario `root`.

### 2. Crear la Base de Datos
- Conéctate a tu servidor MySQL usando la herramienta de tu preferencia (MySQL Workbench, DBeaver, o la línea de comandos).
- Crea la base de datos para el proyecto:
  ```sql
  CREATE DATABASE homecare_dev;
  ```

### 3. Configuración de la Aplicación
El backend está configurado para buscar un perfil de Spring. Para usar una base de datos MySQL local, puedes usar el perfil `docker` que está configurado para MySQL.

Abre el archivo `src/main/resources/application-docker.properties` y asegúrate de que las credenciales coincidan con tu configuración local:
```properties
# src/main/resources/application-docker.properties
spring.datasource.url=jdbc:mysql://localhost:3306/homecare_dev?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=tu_contraseña_de_root
```

### 4. Ejecutar la Aplicación
Para activar este perfil, puedes pasar un argumento al ejecutar la aplicación:
```bash
# Limpia, instala y ejecuta la aplicación con el perfil 'docker'
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=docker
```
Flyway, la herramienta de migración de base de datos integrada, creará y poblará automáticamente el esquema de la base de datos al iniciar la aplicación por primera vez.

## Credenciales de Prueba (Después de la Migración Inicial)

La base de datos se poblará con datos de prueba si Flyway se ejecuta correctamente.

- **Admin:**
  - Email: `admin@cleanhome.com`
  - Password: `Admin@2025!`
- **Cliente:**
  - Email: `juan.perez@example.com`  
  - Password: `Customer@2025!`
- **Proveedor:**
  - Email: `maria.gonzalez@example.com`
  - Password: `Provider@2025!`
