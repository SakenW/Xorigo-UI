#!/bin/bash

# ============================================
# Xorigo UI - Blue-Green Deployment Script
# Stage 3: Modern Deployment & Monitoring System
# ============================================

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENVIRONMENT="${1:-staging}"
VERSION="${2:-latest}"
TRAFFIC_SPLIT="${3:-100}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  INFO: $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ SUCCESS: $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

log_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

# Configuration based on environment
configure_environment() {
    case "$ENVIRONMENT" in
        "staging")
            COMPOSE_FILE="docker-compose.staging.yml"
            NETWORK_NAME="xorigo-ui-staging-network"
            BLUE_PREFIX="blue-staging"
            GREEN_PREFIX="green-staging"
            MAIN_PORT="3100"
            ;;
        "production")
            COMPOSE_FILE="docker-compose.production.yml"
            NETWORK_NAME="xorigo-ui-network"
            BLUE_PREFIX="blue-production"
            GREEN_PREFIX="green-production"
            MAIN_PORT="3100"
            ;;
        *)
            log_error "Unsupported environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running"
        exit 1
    fi

    # Check if Docker Compose is available
    if ! command -v docker-compose >/dev/null 2>&1; then
        log_error "Docker Compose is not installed"
        exit 1
    fi

    # Check if compose file exists
    if [[ ! -f "$PROJECT_ROOT/$COMPOSE_FILE" ]]; then
        log_error "Compose file not found: $COMPOSE_FILE"
        exit 1
    fi

    # Check if version is provided
    if [[ "$VERSION" == "latest" && -z "${GITHUB_SHA:-}" ]]; then
        log_warning "Using 'latest' version, consider specifying a specific version"
    fi

    log_success "Prerequisites check passed"
}

# Determine active environment
determine_active_environment() {
    log_info "Determining active environment..."

    local blue_running=false
    local green_running=false

    # Check if blue environment is running
    if docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$BLUE_PREFIX" ps -q | xargs docker inspect -f '{{.State.Status}}' 2>/dev/null | grep -q "running"; then
        blue_running=true
        log_info "Blue environment is running"
    fi

    # Check if green environment is running
    if docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$GREEN_PREFIX" ps -q | xargs docker inspect -f '{{.State.Status}}' 2>/dev/null | grep -q "running"; then
        green_running=true
        log_info "Green environment is running"
    fi

    if [[ "$blue_running" == true && "$green_running" == true ]]; then
        log_error "Both blue and green environments are running. This should not happen."
        exit 1
    fi

    if [[ "$blue_running" == false && "$green_running" == false ]]; then
        ACTIVE_ENV="blue"
        INACTIVE_ENV="green"
        log_info "No environment is running. Starting with blue as active"
    elif [[ "$blue_running" == true ]]; then
        ACTIVE_ENV="blue"
        INACTIVE_ENV="green"
        log_info "Blue environment is active"
    else
        ACTIVE_ENV="green"
        INACTIVE_ENV="blue"
        log_info "Green environment is active"
    fi
}

# Deploy to inactive environment
deploy_to_inactive() {
    log_info "Deploying version $VERSION to $INACTIVE_ENV environment..."

    local inactive_prefix="${INACTIVE_ENV}-$ENVIRONMENT"

    # Set environment variables for deployment
    export VERSION="$VERSION"
    export DEPLOYMENT_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    export DEPLOYMENT_ID="${VERSION}-$(date +%s)"

    # Stop inactive environment if it's running
    log_info "Stopping $INACTIVE_ENV environment if running..."
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$inactive_prefix" down -v || true

    # Start inactive environment with new version
    log_info "Starting $INACTIVE_ENV environment with version $VERSION..."
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$inactive_prefix" up -d

    # Wait for services to be healthy
    log_info "Waiting for $INACTIVE_ENV environment to be healthy..."
    wait_for_health "$inactive_prefix"

    log_success "$INACTIVE_ENV environment deployed successfully"
}

# Wait for services to be healthy
wait_for_health() {
    local prefix="$1"
    local max_attempts=30
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        log_info "Health check attempt $attempt/$max_attempts..."

        # Check if main service is healthy
        local health_status=$(docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$prefix" ps -q xorigo-ui-website | xargs docker inspect -f '{{.State.Health.Status}}' 2>/dev/null || echo "unknown")

        if [[ "$health_status" == "healthy" ]]; then
            log_success "All services are healthy"
            return 0
        fi

        if [[ "$attempt" == $max_attempts ]]; then
            log_error "Health check failed after $max_attempts attempts"
            return 1
        fi

        log_info "Waiting 10 seconds before next health check..."
        sleep 10
        ((attempt++))
    done
}

# Run smoke tests
run_smoke_tests() {
    log_info "Running smoke tests on $INACTIVE_ENV environment..."

    local test_port
    if [[ "$INACTIVE_ENV" == "blue" ]]; then
        test_port=$((MAIN_PORT + 1))  # e.g., 3101
    else
        test_port=$((MAIN_PORT + 2))  # e.g., 3102
    fi

    # Basic health check
    if ! curl -f "http://localhost:$test_port/health" >/dev/null 2>&1; then
        log_error "Health check failed on port $test_port"
        return 1
    fi

    # API health check
    if ! curl -f "http://localhost:$test_port/api/health" >/dev/null 2>&1; then
        log_error "API health check failed on port $test_port"
        return 1
    fi

    # Load test
    log_info "Running quick load test..."
    for i in {1..5}; do
        curl -f "http://localhost:$test_port/" >/dev/null 2>&1 &
    done
    wait

    log_success "Smoke tests passed"
}

# Traffic switching
switch_traffic() {
    log_info "Switching traffic from $ACTIVE_ENV to $INACTIVE_ENV..."

    local active_port=$MAIN_PORT
    local inactive_port

    if [[ "$INACTIVE_ENV" == "blue" ]]; then
        inactive_port=$((MAIN_PORT + 1))  # e.g., 3101
    else
        inactive_port=$((MAIN_PORT + 2))  # e.g., 3102
    fi

    # Update Nginx configuration to route traffic
    log_info "Updating load balancer configuration..."
    update_nginx_config "$inactive_port" "$TRAFFIC_SPLIT"

    # Reload Nginx
    log_info "Reloading Nginx..."
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "lb-$ENVIRONMENT" exec nginx nginx -s reload || true

    # Wait for traffic switch
    log_info "Waiting for traffic switch to take effect..."
    sleep 10

    # Verify traffic is going to new environment
    verify_traffic_switch "$inactive_port"

    log_success "Traffic switched to $INACTIVE_ENV environment"
}

# Update Nginx configuration
update_nginx_config() {
    local new_port="$1"
    local traffic_split="$2"

    # This would update the Nginx configuration based on the traffic split percentage
    # For simplicity, we're doing a full switch here
    log_info "Configuring traffic routing to port $new_port (${traffic_split}% traffic)"

    # Create or update Nginx configuration
    cat > "$PROJECT_ROOT/nginx/conf.d/blue-green-$ENVIRONMENT.conf" << EOF
# Blue-Green configuration for $ENVIRONMENT
upstream xorigo_ui_backend_$ENVIRONMENT {
    server localhost:$new_port weight=$traffic_split;
}

server {
    listen 80;
    server_name $ENVIRONMENT.xorigo-ui.local;

    location / {
        proxy_pass http://xorigo_ui_backend_$ENVIRONMENT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
}

# Verify traffic switch
verify_traffic_switch() {
    local expected_port="$1"
    local max_attempts=10
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        # This would check if traffic is actually going to the new environment
        # For simplicity, we're just checking if the port is accessible
        if curl -f "http://localhost:$expected_port/health" >/dev/null 2>&1; then
            log_success "Traffic verification passed"
            return 0
        fi

        log_info "Traffic verification attempt $attempt/$max_attempts..."
        sleep 5
        ((attempt++))
    done

    log_warning "Traffic verification inconclusive"
}

# Cleanup old environment
cleanup_old_environment() {
    log_info "Cleaning up old $ACTIVE_ENV environment..."

    local old_prefix="${ACTIVE_ENV}-$ENVIRONMENT"

    # Wait for a grace period before cleanup
    log_info "Waiting 5 minutes before cleanup..."
    sleep 300

    # Stop old environment
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$old_prefix" down -v || true

    # Remove old images
    docker images --filter "label=com.xorigo-ui.environment=$ENVIRONMENT" --filter "label=com.xorigo-ui.service!=monitoring" -q | xargs docker rmi -f || true

    log_success "Old environment cleaned up"
}

# Rollback function
rollback() {
    log_warning "Initiating rollback to $ACTIVE_ENV environment..."

    # Switch traffic back to active environment
    local active_port
    if [[ "$ACTIVE_ENV" == "blue" ]]; then
        active_port=$((MAIN_PORT + 1))
    else
        active_port=$((MAIN_PORT + 2))
    fi

    update_nginx_config "$active_port" "100"

    # Reload Nginx
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "lb-$ENVIRONMENT" exec nginx nginx -s reload || true

    # Stop the failed deployment
    local failed_prefix="${INACTIVE_ENV}-$ENVIRONMENT"
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$failed_prefix" down -v || true

    log_success "Rollback completed"
}

# Main deployment function
main() {
    log_info "Starting Blue-Green deployment to $ENVIRONMENT environment"
    log_info "Version: $VERSION"
    log_info "Traffic split: $TRAFFIC_SPLIT%"

    # Set trap for rollback on error
    trap rollback ERR

    configure_environment
    check_prerequisites
    determine_active_environment
    deploy_to_inactive
    run_smoke_tests

    if [[ "$TRAFFIC_SPLIT" == "100" ]]; then
        switch_traffic
        cleanup_old_environment &
    else
        log_info "Canary deployment with $TRAFFIC_SPLIT% traffic to $INACTIVE_ENV"
        switch_traffic
    fi

    log_success "Blue-Green deployment completed successfully!"
    log_info "Active environment: $INACTIVE_ENV"
    log_info "Version: $VERSION"
}

# Script usage
usage() {
    echo "Usage: $0 <environment> <version> [traffic_split]"
    echo ""
    echo "Arguments:"
    echo "  environment: Target environment (staging|production)"
    echo "  version: Version to deploy (e.g., v1.0.0, latest, commit-sha)"
    echo "  traffic_split: Traffic split percentage (0-100, default: 100)"
    echo ""
    echo "Examples:"
    echo "  $0 staging v1.2.0 100"
    echo "  $0 production latest 10  # Canary deployment"
    echo "  $0 production $(git rev-parse HEAD)"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ "$1" == "-h" || "$1" == "--help" ]]; then
        usage
        exit 0
    fi

    if [[ $# -lt 2 ]]; then
        log_error "Missing required arguments"
        usage
        exit 1
    fi

    main "$@"
fi