# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-08

### Agregado
- ✨ Sistema completo de autenticación con JWT
- ✨ Registro y login de usuarios (clientes y proveedores)
- ✨ Búsqueda y filtrado de proveedores de servicios
- ✨ Sistema de reservas de servicios
- ✨ Seguimiento en tiempo real del estado de reservas
- ✨ Integración con pasarela de pagos Wompi
- ✨ Sistema de calificaciones y reseñas
- ✨ Panel de administración con gestión de usuarios
- ✨ Documentación interactiva con Swagger/OpenAPI
- ✨ Aplicación móvil con React Native (Expo)
- ✨ Frontend web responsivo
- ✨ Soporte para múltiples roles de usuario (Cliente, Proveedor, Admin)
- ✨ Sistema de notificaciones en tiempo real
- ✨ Google Maps integrado para ubicación de servicios
- ✨ API RESTful completa y documentada

### Características de Base de Datos
- ✨ Soporte para PostgreSQL, MySQL y H2
- ✨ Migraciones automáticas de base de datos
- ✨ Seed data para desarrollo

### Documentación
- 📚 README completo con guía de instalación
- 📚 Guía de configuración de base de datos
- 📚 Documentación de AWS RDS
- 📚 Guía de inicio rápido
- 📚 Ejemplos de uso de API
- 📚 Guía de testing

### DevOps
- 🐳 Dockerfile y docker-compose para desarrollo
- 🐳 Scripts de PowerShell para automatización
- 🐳 Variables de entorno configurables

## [Próximas Versiones Planeadas]

### En Desarrollo
- [ ] Sistema de chat en tiempo real entre clientes y proveedores
- [ ] Historial de transacciones y reportes
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Integración con más pasarelas de pago
- [ ] Sistema de descuentos y cupones
- [ ] Programa de referidos
- [ ] Analytics avanzados para administradores

### Mejoras Planeadas
- [ ] Optimización de rendimiento en listado de servicios
- [ ] Caché distribuido con Redis
- [ ] Pruebas de carga automatizadas
- [ ] Documentación en múltiples idiomas
- [ ] Aplicación iOS nativa (complementaria a React Native)
- [ ] Integración CI/CD mejorada

---

## Cómo Reportar Cambios

Para contribuidores: Documenta nuevos cambios en este archivo siguiendo el formato anterior:

```markdown
## [Versión] - YYYY-MM-DD

### Agregado
- Nueva funcionalidad A
- Nueva funcionalidad B

### Cambiado
- Cambio en funcionalidad X

### Arreglado
- Bug fix para problema Y

### Removido
- Funcionalidad obsoleta Z
```

Categorías disponibles:
- **Agregado** (Added): Nuevas funcionalidades
- **Cambiado** (Changed): Cambios en funcionalidades existentes
- **Deprecado** (Deprecated): Funcionalidades que serán removidas
- **Removido** (Removed): Funcionalidades eliminadas
- **Arreglado** (Fixed): Bugs arreglados
- **Seguridad** (Security): Vulnerabilidades arregladas
