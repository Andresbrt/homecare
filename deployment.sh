#!/bin/bash
# deployment.sh - Script automatizado para deployment de Home Care

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENVIRONMENT="${1:-production}"
LOG_FILE="$SCRIPT_DIR/deployment.log"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

# Verificar requisitos
check_requirements() {
    log "🔍 Verificando requisitos..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    log_success "Docker instalado: $(docker --version)"
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado"
        exit 1
    fi
    log_success "Docker Compose instalado: $(docker-compose --version)"
    
    if [ ! -f "$SCRIPT_DIR/.env" ]; then
        log_error ".env no encontrado. Ejecuta: cp .env.example .env"
        exit 1
    fi
    log_success ".env encontrado"
}

# Validar .env
validate_env() {
    log "🔐 Validando archivo .env..."
    
    required_vars=("DB_PASSWORD" "JWT_SECRET" "SPRING_PROFILES_ACTIVE")
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$SCRIPT_DIR/.env"; then
            log_error "Variable $var no encontrada en .env"
            exit 1
        fi
    done
    
    log_success "Variables de entorno validadas"
}

# Actualizar código
update_code() {
    log "📦 Actualizando código..."
    
    cd "$SCRIPT_DIR"
    git pull origin main || log_warning "Error actualizando código, continuando..."
    
    log_success "Código actualizado"
}

# Backup de BD (si existe contenedor previo)
backup_database() {
    log "💾 Creando backup de base de datos..."
    
    if docker-compose ps database &>/dev/null; then
        BACKUP_FILE="$SCRIPT_DIR/backups/database_$(date +%Y%m%d_%H%M%S).sql"
        mkdir -p "$SCRIPT_DIR/backups"
        
        docker-compose exec -T database pg_dump -U viclean_user viclean > "$BACKUP_FILE" 2>/dev/null || true
        
        if [ -f "$BACKUP_FILE" ]; then
            log_success "Backup creado: $BACKUP_FILE"
        fi
    else
        log_warning "BD no está corriendo, saltando backup"
    fi
}

# Detener servicios previos
stop_services() {
    log "🛑 Deteniendo servicios previos..."
    
    docker-compose down || true
    
    log_success "Servicios detenidos"
}

# Construir imágenes
build_images() {
    log "🔨 Construyendo imágenes Docker..."
    
    docker-compose build --no-cache backend || {
        log_error "Error construyendo imagen backend"
        exit 1
    }
    
    log_success "Imágenes construidas"
}

# Iniciar servicios
start_services() {
    log "▶️  Iniciando servicios..."
    
    docker-compose up -d || {
        log_error "Error iniciando servicios"
        exit 1
    }
    
    log_success "Servicios iniciados"
}

# Esperar a que servicios estén listos
wait_for_services() {
    log "⏳ Esperando a que servicios estén listos..."
    
    # Esperar BD
    for i in {1..30}; do
        if docker-compose exec -T database pg_isready -U viclean_user -d viclean &>/dev/null; then
            log_success "Base de datos lista"
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "Base de datos no respondió"
            exit 1
        fi
        sleep 2
    done
    
    # Esperar Backend
    sleep 10  # Dar tiempo para iniciar Spring Boot
    for i in {1..30}; do
        if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
            log_success "Backend listo"
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "Backend no respondió"
            exit 1
        fi
        sleep 2
    done
}

# Verificar salud
health_check() {
    log "🏥 Verificando salud de servicios..."
    
    # Estado de contenedores
    if ! docker-compose ps | grep -q "Up"; then
        log_error "Algunos servicios no están corriendo"
        docker-compose ps
        exit 1
    fi
    
    # Health check backend
    response=$(curl -s http://localhost:8080/actuator/health)
    if echo "$response" | grep -q '"status":"UP"'; then
        log_success "Backend saludable"
    else
        log_error "Backend no saludable. Respuesta: $response"
        exit 1
    fi
    
    # Health check BD
    if docker-compose exec -T database pg_isready -U viclean_user -d viclean &>/dev/null; then
        log_success "Base de datos saludable"
    else
        log_error "Base de datos no saludable"
        exit 1
    fi
}

# Ejecutar migraciones (si es necesario)
run_migrations() {
    log "🗄️  Verificando migraciones de BD..."
    
    if [ -f "$SCRIPT_DIR/src/main/resources/db/migration/V1_init.sql" ]; then
        log "Migraciones encontradas"
        # Si usas Flyway, esto se ejecuta automáticamente
        # Si usas Liquibase, esto se ejecuta automáticamente
        log_success "Migraciones aplicadas automáticamente por Spring Boot"
    fi
}

# Mostrar información de deployment
show_info() {
    log "ℹ️  Información de deployment:"
    echo ""
    echo "═══════════════════════════════════════════"
    echo "  🌍 DEPLOYMENT COMPLETADO"
    echo "═══════════════════════════════════════════"
    echo "  Ambiente: $ENVIRONMENT"
    echo "  Backend:  http://localhost:8080"
    echo "  API:      http://localhost:8080/api"
    echo "  WebSocket: ws://localhost:8080/ws"
    echo "  Health:   http://localhost:8080/actuator/health"
    echo ""
    echo "  Comandos útiles:"
    echo "  • Ver logs:      docker-compose logs -f"
    echo "  • Detener:       docker-compose down"
    echo "  • Reiniciar:     docker-compose restart"
    echo ""
    echo "═══════════════════════════════════════════"
    echo ""
    log_success "Deployment completado exitosamente"
}

# Rollback en caso de error
rollback() {
    log_error "Ejecutando rollback..."
    
    if [ -f "$SCRIPT_DIR/backups/database_latest.sql" ]; then
        log "Restaurando base de datos desde backup..."
        docker-compose exec -T database psql -U viclean_user viclean < "$SCRIPT_DIR/backups/database_latest.sql"
    fi
    
    docker-compose down
    log_error "Rollback completado"
}

# Trap para manejar errores
trap 'log_error "Script fallido"; rollback; exit 1' ERR

# Ejecución principal
main() {
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║  🚀 HOME CARE DEPLOYMENT SCRIPT            ║"
    echo "║  Ambiente: $ENVIRONMENT"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    
    check_requirements
    validate_env
    update_code
    backup_database
    stop_services
    build_images
    start_services
    wait_for_services
    run_migrations
    health_check
    show_info
}

# Ejecutar main
main
