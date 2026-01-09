# Guía de Contribución - Homecare

¡Gracias por tu interés en contribuir a Homecare! Este documento te guiará a través del proceso de contribución.

## 📋 Código de Conducta

Esperamos que todos los contribuyentes adhieran a nuestro código de conducta, que promueve un ambiente respetoso e inclusivo para todos.

## 🚀 Cómo Contribuir

### 1. Reportar Bugs

Si encuentras un bug, crea un issue en GitHub con:
- **Título descriptivo**: Resumen claro del problema
- **Descripción detallada**: Qué pasó y qué esperabas que pasara
- **Pasos para reproducir**: Instrucciones paso a paso para reproducir el bug
- **Información del entorno**:
  - Sistema operativo y versión
  - Versión de Java/Node.js
  - Rama en la que ocurre

**Ejemplo:**
```
Título: El formulario de registro no valida emails correctamente

Descripción:
Al registrarse con un email inválido (ej: "usuario@@example.com"), 
el sistema no muestra un error de validación.

Pasos para reproducir:
1. Ir a la pantalla de registro
2. Ingresar "usuario@@example.com" en el campo de email
3. Hacer clic en "Registrarse"

Esperado: Se debe mostrar un error indicando que el email es inválido
Actual: El formulario se envía sin error

Entorno: Windows 10, Java 17, Node 18.16.0
```

### 2. Sugerir Mejoras

Para sugerir una nueva funcionalidad:
- **Usa issues con el label `enhancement`**
- Describe claramente el caso de uso y el valor agregado
- Proporciona ejemplos o mockups si es posible
- Explica cómo beneficia a usuarios

### 3. Hacer un Pull Request

#### a) Fork el Repositorio
```bash
# En GitHub, haz clic en "Fork"
git clone https://github.com/tu-usuario/homecare.git
cd homecare
```

#### b) Crea una Rama
```bash
# Usa nombres descriptivos: feature/nombre o fix/nombre
git checkout -b feature/mi-nueva-funcionalidad
# O para bugs:
git checkout -b fix/descripcion-del-bug
```

#### c) Realiza tus Cambios
```bash
# Desarrolla tu funcionalidad
# Haz commits pequeños y descriptivos
git commit -m "feat: Agrega validación mejorada de email"
git commit -m "test: Añade tests para validación de email"
```

#### d) Sube tu Rama
```bash
git push origin feature/mi-nueva-funcionalidad
```

#### e) Abre un Pull Request
- Ve a GitHub y haz clic en "New Pull Request"
- Selecciona tu rama y la rama `master` de `Andresbrt/homecare`
- Completa el template del PR con:
  - **Descripción**: Qué cambios incluye
  - **Tipo de cambio**: Feature, Bug Fix, Documentation, etc.
  - **Testing**: Cómo probaste el cambio
  - **Checklist**: Marca los items completados

**Template de PR:**
```markdown
## Descripción
Brevemente describe los cambios que hiciste.

## Tipo de Cambio
- [ ] Bug fix (cambio que arregla un problema)
- [ ] Característica nueva (cambio que agrega funcionalidad)
- [ ] Cambio que rompe compatibilidad
- [ ] Actualización de documentación

## Cómo se probó esto
Describe los pasos para verificar tu cambio:
1. Ve a '...'
2. Haz clic en '...'
3. Verifica que '...'

## Checklist
- [ ] Mi código sigue las convenciones de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en partes complejas
- [ ] He realizado cambios correspondientes en la documentación
- [ ] Mis cambios no generan nuevas warnings
- [ ] He añadido tests que prueban que mi arreglo es efectivo o que mi feature funciona
- [ ] Los tests nuevos y existentes pasaron localmente
```

## 📝 Convenciones de Código

### Backend (Java/Spring Boot)
```java
// Usa nombres descriptivos
public class UserServiceImpl implements UserService {
    
    // Métodos pequeños y enfocados
    public User registerUser(UserRegistrationDTO dto) {
        validateEmail(dto.getEmail());
        User user = new User();
        // ...
        return user;
    }
}
```

### Frontend (JavaScript/React)
```javascript
// Componentes en PascalCase
function UserRegistrationForm() {
  const [email, setEmail] = useState('');
  
  // Funciones handler con prefijo 'handle'
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  return <form>{/* ... */}</form>;
}
```

### Commits
```
feat: Agrega nuevo endpoint de búsqueda de servicios
fix: Corrige validación de email en registro
docs: Actualiza README con instrucciones de instalación
test: Añade tests para el servicio de autenticación
refactor: Simplifica lógica de filtrado de proveedores
chore: Actualiza dependencias a versiones seguras
```

### Estilo de Código
- **Indentación**: 4 espacios (Java), 2 espacios (JavaScript)
- **Longitud de línea**: Máximo 100 caracteres
- **Comentarios**: Explica el "por qué", no el "qué"
- **Nombres significativos**: Evita abreviaturas confusas

## 🧪 Testing

Antes de enviar un PR:

```bash
# Backend
cd homecare
mvn clean test

# Frontend/Mobile
cd mobile
npm test

# O ejecuta la suite completa
./scripts/run-tests.ps1
```

## 📚 Documentación

Si añades una nueva funcionalidad, por favor:
1. Actualiza el README relevante
2. Documenta nuevos endpoints en Swagger
3. Incluye comentarios en el código para lógica compleja
4. Actualiza el CHANGELOG.md

## 🔄 Proceso de Revisión

1. Un mantenedor revisará tu PR
2. Puede solicitar cambios o aclaraciones
3. Realiza los cambios solicitados en nuevos commits
4. Una vez aprobado, tu PR será mergeado

## ❓ Preguntas

- **Issues**: Para preguntas sobre reportes de bugs
- **Discussions**: Para preguntas generales (próximamente)
- **Email**: Para cuestiones sensibles

## 📖 Recursos Útiles

- [Documentación del Proyecto](./README.md)
- [Guía de Inicio](./UNIFIED_START_GUIDE.md)
- [Endpoints de la API](./README.md#-endpoints-principales)
- [Setup de Base de Datos](./DATABASE_SETUP.md)

---

¡Gracias por contribuir a Homecare! 🚀
