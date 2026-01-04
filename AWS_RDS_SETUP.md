# Guía de Configuración de AWS RDS para Homecare

Esta guía describe cómo configurar una base de datos PostgreSQL en Amazon RDS (Relational Database Service) utilizando el nivel gratuito de AWS para que sirva como base de datos de producción o desarrollo para la aplicación Homecare.

## ¿Por Qué AWS RDS?

- **Administrado y Seguro:** AWS se encarga del mantenimiento, las copias de seguridad y la seguridad de la base de datos.
- **Escalable:** Puedes empezar con el nivel gratuito y escalar la capacidad de la base de datos a medida que la aplicación crece.
- **Monitoreo Integrado:** Proporciona paneles para supervisar el rendimiento, las conexiones y el uso de la CPU.
- **Ciberseguridad:** Permite una configuración de red segura mediante grupos de seguridad y VPC, además de cifrado en reposo y en tránsito.

## Paso 1: Crear una Cuenta de AWS

Si aún no tienes una, crea una cuenta en [aws.amazon.com](https://aws.amazon.com/). Necesitarás una tarjeta de crédito para el registro, pero el nivel gratuito no generará costos si se siguen los pasos correctamente.

## Paso 2: Navegar a Amazon RDS

1.  Inicia sesión en la [Consola de Administración de AWS](https://aws.amazon.com/console/).
2.  En la barra de búsqueda, escribe `RDS` y selecciona el servicio.

## Paso 3: Crear la Base de Datos

1.  En el panel de RDS, haz clic en **"Crear base de datos"**.

2.  **Elegir un método de creación de base de datos:**
    *   Selecciona **"Creación estándar"**.

3.  **Configuración del motor:**
    *   Elige **"PostgreSQL"**.
    *   Deja la versión por defecto o selecciona una reciente (ej. PostgreSQL 15.x).

4.  **Plantillas:**
    *   Selecciona **"Nivel gratuito"**. Esto limitará automáticamente las opciones a las que son gratuitas.

5.  **Configuración:**
    *   **Identificador de la instancia de base de datos:** `homecare-db` (o un nombre de tu elección).
    *   **Nombre de usuario maestro:** `homecare_admin`.
    *   **Contraseña maestra:** Crea una contraseña segura y guárdala en un lugar seguro (como un gestor de contraseñas). **No la guardes en el código.**

6.  **Configuración de la instancia:**
    *   La plantilla "Nivel gratuito" debería seleccionar `db.t3.micro` o `db.t2.micro`, lo cual es correcto.

7.  **Almacenamiento:**
    *   Deja los valores predeterminados que ofrece el nivel gratuito (normalmente 20 GB de almacenamiento SSD de uso general).

8.  **Conectividad:**
    *   **Acceso público:** Selecciona **"Sí"** para poder conectarte a la base de datos desde tu máquina local o desde un servicio de hosting externo.
        *   **¡ADVERTENCIA DE SEGURIDAD!** Permitir el acceso público desde cualquier IP (0.0.0.0/0) es un riesgo de seguridad. Para producción, es **muy recomendable** configurar los grupos de seguridad de VPC para permitir solo las direcciones IP de tu aplicación de backend. Para desarrollo, puedes permitir temporalmente tu IP.
    *   **Grupo de seguridad de la VPC:** Puedes crear uno nuevo o seleccionar el predeterminado. Asegúrate de que las reglas de entrada permitan el tráfico en el puerto de PostgreSQL (5432).

9.  **Autenticación de la base de datos:**
    *   Selecciona **"Autenticación por contraseña"**.

10. **Configuración adicional:**
    *   **Nombre de la base de datos inicial:** `homecare`
    *   Puedes desactivar las copias de seguridad automáticas para ahorrar costos si es solo para desarrollo, pero se recomiendan para producción.

11. Haz clic en **"Crear base de datos"**. La creación tardará unos minutos.

## Paso 4: Obtener las Credenciales de Conexión

Una vez que el estado de la base de datos sea "Disponible":

1.  Haz clic en el nombre de la instancia de base de datos que creaste.
2.  En la pestaña **"Conectividad y seguridad"**, encontrarás:
    *   **Punto de enlace (Endpoint):** Es la URL de tu base de datos (ej. `homecare-db.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com`).
    *   **Puerto:** `5432`.

## Paso 5: Conectar la Aplicación Backend

El backend de Homecare está configurado para usar variables de entorno para la conexión a la base de datos, lo cual es una buena práctica de seguridad.

Para ejecutar el backend localmente conectado a tu nueva base de datos de RDS, necesitarás configurar las siguientes variables de entorno antes de iniciar la aplicación:

-   **`DB_URL`**: `jdbc:postgresql://<TU_PUNTO_DE_ENLACE_RDS>:5432/homecare`
-   **`DB_USERNAME`**: `homecare_admin` (o el que hayas configurado).
-   **`DB_PASSWORD`**: Tu contraseña maestra.
-   **`DB_DRIVER`**: `org.postgresql.Driver`
-   **`DB_DIALECT`**: `org.hibernate.dialect.PostgreSQLDialect`

### Ejemplo en PowerShell (Windows)

```powershell
$env:DB_URL="jdbc:postgresql://homecare-db.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/homecare"
$env:DB_USERNAME="homecare_admin"
$env:DB_PASSWORD="tu_contraseña_segura"
$env:DB_DRIVER="org.postgresql.Driver"
$env:DB_DIALECT="org.hibernate.dialect.PostgreSQLDialect"

# Luego, inicia tu aplicación Spring Boot
mvn spring-boot:run
```

## Recomendaciones de Seguridad

-   **NUNCA** publiques tus credenciales de base de datos (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) en un repositorio de Git.
-   Para un entorno de producción, utiliza **AWS Secrets Manager** para gestionar las credenciales de la base de datos y accede a ellas desde tu aplicación de backend de forma segura.
-   Configura los **grupos de seguridad de la VPC** para que solo las direcciones IP de tu servidor de aplicaciones puedan acceder a la base de datos.
-   Habilita el **cifrado en tránsito** (SSL/TLS) para todas las conexiones a la base de datos. RDS lo soporta por defecto.
