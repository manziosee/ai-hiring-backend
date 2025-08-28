#!/bin/bash

# AI Hiring Platform Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    local missing_deps=()
    
    case "$1" in
        "docker")
            command -v docker >/dev/null 2>&1 || missing_deps+=("docker")
            command -v docker-compose >/dev/null 2>&1 || missing_deps+=("docker-compose")
            ;;
        "kubernetes")
            command -v kubectl >/dev/null 2>&1 || missing_deps+=("kubectl")
            ;;
        "fly")
            command -v flyctl >/dev/null 2>&1 || missing_deps+=("flyctl")
            ;;
    esac
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing required dependencies: ${missing_deps[*]}"
        exit 1
    fi
}

# Load environment variables
load_env() {
    if [ -f .env ]; then
        log "Loading environment variables from .env file"
        export $(cat .env | grep -v '^#' | xargs)
    else
        warning "No .env file found. Using default values."
    fi
}

# Pre-deployment checks
pre_deploy_checks() {
    log "Running pre-deployment checks..."
    
    # Check if package.json exists
    if [ ! -f package.json ]; then
        error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    # Check if Dockerfile exists
    if [ ! -f Dockerfile ]; then
        error "Dockerfile not found"
        exit 1
    fi
    
    # Run tests
    if [ "$SKIP_TESTS" != "true" ]; then
        log "Running tests..."
        npm test || {
            error "Tests failed. Deployment aborted."
            exit 1
        }
    fi
    
    success "Pre-deployment checks passed"
}

# Docker deployment
deploy_docker() {
    log "🐳 Deploying with Docker Compose..."
    
    # Stop existing containers
    docker-compose down --remove-orphans
    
    # Build images
    log "Building Docker images..."
    docker-compose build --no-cache
    
    # Start services
    log "Starting services..."
    docker-compose up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    timeout 300 bash -c 'until docker-compose ps | grep -q "healthy\|Up"; do sleep 5; done' || {
        error "Services failed to start properly"
        docker-compose logs
        exit 1
    }
    
    # Show running services
    docker-compose ps
    
    success "Docker deployment completed"
}

# Kubernetes deployment
deploy_kubernetes() {
    log "☸️ Deploying to Kubernetes..."
    
    # Check cluster connection
    kubectl cluster-info >/dev/null 2>&1 || {
        error "Cannot connect to Kubernetes cluster"
        exit 1
    }
    
    # Apply manifests in order
    log "Applying Kubernetes manifests..."
    kubectl apply -f kubernetes/namespace.yaml
    kubectl apply -f kubernetes/secrets.yaml
    kubectl apply -f kubernetes/postgres.yaml
    kubectl apply -f kubernetes/redis.yaml
    
    # Wait for database to be ready
    log "Waiting for database to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres -n ai-hiring --timeout=300s
    
    # Deploy services
    kubectl apply -f kubernetes/ml-service.yaml
    kubectl apply -f kubernetes/main-api.yaml
    kubectl apply -f kubernetes/ingress.yaml
    
    # Wait for deployments
    log "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available deployment --all -n ai-hiring --timeout=600s
    
    # Show deployment status
    kubectl get all -n ai-hiring
    
    success "Kubernetes deployment completed"
}

# Fly.io deployment
deploy_fly() {
    log "✈️ Deploying to Fly.io..."
    
    # Check if logged in
    flyctl auth whoami >/dev/null 2>&1 || {
        error "Not logged in to Fly.io. Run 'flyctl auth login' first."
        exit 1
    }
    
    # Deploy main API
    log "Deploying main API..."
    flyctl deploy --remote-only --app ai-hiring-api || {
        error "Failed to deploy main API"
        exit 1
    }
    
    # Deploy ML service
    if [ -d "microservices/ml-service" ]; then
        log "Deploying ML service..."
        cd microservices/ml-service
        flyctl deploy --remote-only --app ai-hiring-ml || {
            error "Failed to deploy ML service"
            exit 1
        }
        cd ../..
    fi
    
    # Deploy email service
    if [ -d "microservices/email-service" ]; then
        log "Deploying email service..."
        cd microservices/email-service
        flyctl deploy --remote-only --app ai-hiring-email || {
            error "Failed to deploy email service"
            exit 1
        }
        cd ../..
    fi
    
    # Show app status
    flyctl status --app ai-hiring-api
    
    success "Fly.io deployment completed"
}

# Health check
health_check() {
    local url="$1"
    local max_attempts=30
    local attempt=1
    
    log "Performing health check on $url"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url/health" >/dev/null 2>&1; then
            success "Health check passed"
            return 0
        fi
        
        log "Health check attempt $attempt/$max_attempts failed. Retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    error "Health check failed after $max_attempts attempts"
    return 1
}

# Rollback function
rollback() {
    warning "Rolling back deployment..."
    
    case "$DEPLOY_TARGET" in
        "docker")
            docker-compose down
            docker-compose up -d --scale main-api=0
            ;;
        "kubernetes")
            kubectl rollout undo deployment/main-api -n ai-hiring
            ;;
        "fly")
            flyctl releases --app ai-hiring-api | head -2 | tail -1 | awk '{print $1}' | xargs flyctl releases rollback --app ai-hiring-api
            ;;
    esac
    
    warning "Rollback completed"
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    # Add cleanup logic here
}

# Trap for cleanup on exit
trap cleanup EXIT

# Main deployment logic
main() {
    log "🚀 Starting deployment of AI Hiring Platform..."
    
    # Check environment
    DEPLOY_ENV="${DEPLOY_ENV:-development}"
    DEPLOY_TARGET="$1"
    
    log "📦 Deployment environment: $DEPLOY_ENV"
    log "🎯 Deployment target: $DEPLOY_TARGET"
    
    # Validate deployment target
    if [ -z "$DEPLOY_TARGET" ]; then
        error "Deployment target not specified"
        echo "Usage: ./deploy.sh [docker|kubernetes|fly] [options]"
        echo ""
        echo "Options:"
        echo "  --skip-tests    Skip running tests before deployment"
        echo "  --no-health-check    Skip health check after deployment"
        exit 1
    fi
    
    # Parse options
    while [[ $# -gt 1 ]]; do
        case $2 in
            --skip-tests)
                export SKIP_TESTS=true
                shift
                ;;
            --no-health-check)
                export SKIP_HEALTH_CHECK=true
                shift
                ;;
            *)
                warning "Unknown option: $2"
                shift
                ;;
        esac
    done
    
    # Load environment and run checks
    load_env
    check_dependencies "$DEPLOY_TARGET"
    pre_deploy_checks
    
    # Deploy based on target
    case "$DEPLOY_TARGET" in
        "docker")
            deploy_docker
            [ "$SKIP_HEALTH_CHECK" != "true" ] && health_check "http://localhost:3000"
            ;;
        "kubernetes")
            deploy_kubernetes
            [ "$SKIP_HEALTH_CHECK" != "true" ] && health_check "http://localhost:3000"
            ;;
        "fly")
            deploy_fly
            [ "$SKIP_HEALTH_CHECK" != "true" ] && health_check "https://ai-hiring-api.fly.dev"
            ;;
        *)
            error "Unknown deployment target: $DEPLOY_TARGET"
            echo "Usage: ./deploy.sh [docker|kubernetes|fly]"
            exit 1
            ;;
    esac
    
    success "✅ Deployment completed successfully!"
    log "🌐 Application is now available"
}

# Run main function with all arguments
main "$@"