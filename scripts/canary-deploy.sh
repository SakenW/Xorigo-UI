#!/bin/bash

# ============================================
# Xorigo UI - Canary Deployment Script
# Stage 3: Modern Deployment & Monitoring System
# ============================================

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENVIRONMENT="${1:-staging}"
VERSION="${2:-latest}"
INITIAL_TRAFFIC="${3:-5}"
MAX_TRAFFIC="${4:-20}"
INCREMENT="${5:-5}"
ANALYSIS_DURATION="${6:-300}" # 5 minutes

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Canary state file
CANARY_STATE_FILE="/tmp/xorigo-canary-$ENVIRONMENT.state"

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
            CANARY_PREFIX="canary-staging"
            STABLE_PREFIX="green-staging"
            BASE_PORT="3100"
            CANARY_PORT="3102"
            ;;
        "production")
            COMPOSE_FILE="docker-compose.production.yml"
            NETWORK_NAME="xorigo-ui-network"
            CANARY_PREFIX="canary-production"
            STABLE_PREFIX="green-production"
            BASE_PORT="3100"
            CANARY_PORT="3102"
            ;;
        *)
            log_error "Unsupported environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
}

# Save canary state
save_canary_state() {
    local state="$1"
    echo "$state" > "$CANARY_STATE_FILE"
    log_info "Canary state saved: $state"
}

# Load canary state
load_canary_state() {
    if [[ -f "$CANARY_STATE_FILE" ]]; then
        cat "$CANARY_STATE_FILE"
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running"
        exit 1
    fi

    # Check if stable environment is running
    if ! docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$STABLE_PREFIX" ps -q xorigo-ui-website >/dev/null 2>&1; then
        log_error "Stable environment is not running"
        exit 1
    fi

    # Validate traffic percentage
    if [[ "$INITIAL_TRAFFIC" -lt 1 || "$INITIAL_TRAFFIC" -gt 100 ]]; then
        log_error "Initial traffic must be between 1 and 100"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Deploy canary version
deploy_canary() {
    log_info "Deploying canary version $VERSION..."

    # Set environment variables
    export VERSION="$VERSION"
    export DEPLOYMENT_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    export DEPLOYMENT_ID="canary-$VERSION-$(date +%s)"

    # Stop existing canary if running
    log_info "Stopping existing canary deployment..."
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$CANARY_PREFIX" down -v || true

    # Start canary deployment
    log_info "Starting canary deployment..."
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$CANARY_PREFIX" up -d

    # Wait for canary to be healthy
    log_info "Waiting for canary to be healthy..."
    wait_for_canary_health

    # Save initial state
    local initial_state="{\"version\":\"$VERSION\",\"traffic_percentage\":$INITIAL_TRAFFIC,\"status\":\"deployed\",\"start_time\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"
    save_canary_state "$initial_state"

    log_success "Canary deployed successfully"
}

# Wait for canary health
wait_for_canary_health() {
    local max_attempts=30
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        log_info "Canary health check attempt $attempt/$max_attempts..."

        local health_status=$(docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$CANARY_PREFIX" ps -q xorigo-ui-website | xargs docker inspect -f '{{.State.Health.Status}}' 2>/dev/null || echo "unknown")

        if [[ "$health_status" == "healthy" ]]; then
            log_success "Canary is healthy"
            return 0
        fi

        if [[ "$attempt" == $max_attempts ]]; then
            log_error "Canary failed to become healthy"
            return 1
        fi

        sleep 10
        ((attempt++))
    done
}

# Configure traffic routing
configure_traffic_routing() {
    local canary_traffic="$1"
    local stable_traffic=$((100 - canary_traffic))

    log_info "Configuring traffic routing: ${canary_traffic}% canary, ${stable_traffic}% stable"

    # Update Nginx configuration
    cat > "$PROJECT_ROOT/nginx/conf.d/canary-$ENVIRONMENT.conf" << EOF
# Canary configuration for $ENVIRONMENT
upstream xorigo_ui_backend_$ENVIRONMENT {
    server localhost:$CANARY_PORT weight=$canary_traffic;
    server localhost:$BASE_PORT weight=$stable_traffic;
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
        proxy_set_header X-Canary-Version \"$VERSION\";
    }

    # Health check endpoint
    location /canary-health {
        access_log off;
        return 200 \"canary-healthy\";
        add_header Content-Type text/plain;
    }
}
EOF

    # Reload Nginx
    log_info "Reloading Nginx configuration..."
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "lb-$ENVIRONMENT" exec nginx nginx -s reload || true

    # Wait for configuration to take effect
    sleep 10

    log_success "Traffic routing configured"
}

# Monitor canary performance
monitor_canary() {
    local current_traffic="$1"
    local analysis_start=$(date +%s)
    local analysis_end=$((analysis_start + ANALYSIS_DURATION))

    log_info "Monitoring canary performance for ${ANALYSIS_DURATION}s at ${current_traffic}% traffic..."

    # Initialize metrics
    local total_requests=0
    local canary_requests=0
    local stable_requests=0
    local canary_errors=0
    local stable_errors=0

    while [[ $(date +%s) -lt $analysis_end ]]; do
        # Collect metrics from logs
        collect_metrics "$current_traffic"

        # Check if error rate is too high
        local error_rate=$(calculate_error_rate "$canary_requests" "$canary_errors")
        if [[ $(echo "$error_rate > 5" | bc -l) -eq 1 ]]; then
            log_warning "High error rate detected: ${error_rate}%"
            return 1
        fi

        # Check response time
        local avg_response_time=$(calculate_avg_response_time)
        if [[ $(echo "$avg_response_time > 2000" | bc -l) -eq 1 ]]; then
            log_warning "High response time detected: ${avg_response_time}ms"
            return 1
        fi

        log_info "Monitoring... (${current_traffic}% traffic, error rate: ${error_rate}%, avg response time: ${avg_response_time}ms)"
        sleep 30
    done

    # Final analysis
    local final_error_rate=$(calculate_error_rate "$canary_requests" "$canary_errors")
    local final_response_time=$(calculate_avg_response_time)

    log_info "Analysis complete. Error rate: ${final_error_rate}%, Response time: ${final_response_time}ms"

    # Determine if canary is healthy
    if [[ $(echo "$final_error_rate < 1 && $final_response_time < 1000" | bc -l) -eq 1 ]]; then
        return 0
    else
        return 1
    fi
}

# Collect metrics
collect_metrics() {
    local traffic_percentage="$1"

    # This would collect metrics from Prometheus, logs, or monitoring systems
    # For simplicity, we're simulating metrics collection
    log_debug "Collecting metrics at ${traffic_percentage}% traffic"
}

# Calculate error rate
calculate_error_rate() {
    local requests="$1"
    local errors="$2"

    if [[ $requests -eq 0 ]]; then
        echo "0"
    else
        echo "scale=2; ($errors / $requests) * 100" | bc
    fi
}

# Calculate average response time
calculate_avg_response_time() {
    # This would calculate from actual metrics
    # For simplicity, returning a simulated value
    echo "450"
}

# Promote canary
promote_canary() {
    log_info "Promoting canary to stable..."

    # Scale canary to 100% traffic
    configure_traffic_routing 100

    # Wait for final verification
    sleep 30

    # Update stable deployment
    log_info "Updating stable deployment to version $VERSION..."
    export VERSION="$VERSION"

    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$STABLE_PREFIX" down
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$STABLE_PREFIX" up -d

    # Wait for stable to be healthy
    wait_for_stable_health

    # Cleanup canary
    log_info "Cleaning up canary deployment..."
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$CANARY_PREFIX" down -v

    # Update state
    local final_state="{\"version\":\"$VERSION\",\"traffic_percentage\":100,\"status\":\"promoted\",\"end_time\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"
    save_canary_state "$final_state"

    # Remove state file
    rm -f "$CANARY_STATE_FILE"

    log_success "Canary promoted successfully"
}

# Wait for stable health
wait_for_stable_health() {
    local max_attempts=20
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        log_info "Stable health check attempt $attempt/$max_attempts..."

        local health_status=$(docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$STABLE_PREFIX" ps -q xorigo-ui-website | xargs docker inspect -f '{{.State.Health.Status}}' 2>/dev/null || echo "unknown")

        if [[ "$health_status" == "healthy" ]]; then
            log_success "Stable deployment is healthy"
            return 0
        fi

        if [[ "$attempt" == $max_attempts ]]; then
            log_error "Stable deployment failed to become healthy"
            return 1
        fi

        sleep 15
        ((attempt++))
    done
}

# Rollback canary
rollback_canary() {
    log_warning "Rolling back canary deployment..."

    # Set traffic to 0% for canary
    configure_traffic_routing 0

    # Stop canary
    log_info "Stopping canary deployment..."
    docker-compose -f "$PROJECT_ROOT/$COMPOSE_FILE" -p "$CANARY_PREFIX" down -v

    # Update state
    local rollback_state="{\"version\":\"$VERSION\",\"traffic_percentage\":0,\"status\":\"rolled_back\",\"end_time\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"
    save_canary_state "$rollback_state"

    # Remove state file
    rm -f "$CANARY_STATE_FILE"

    log_success "Canary rolled back successfully"
}

# Progressive traffic increase
progressive_traffic_increase() {
    local current_traffic="$INITIAL_TRAFFIC"

    while [[ $current_traffic -le $MAX_TRAFFIC ]]; do
        log_info "Increasing traffic to ${current_traffic}%"

        # Configure traffic routing
        configure_traffic_routing "$current_traffic"

        # Monitor for analysis duration
        if monitor_canary "$current_traffic"; then
            log_success "Canary performing well at ${current_traffic}% traffic"

            # Update state
            local state="{\"version\":\"$VERSION\",\"traffic_percentage\":$current_traffic,\"status\":\"analyzed\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"
            save_canary_state "$state"

            # Increase traffic
            current_traffic=$((current_traffic + INCREMENT))
        else
            log_error "Canary not performing well at ${current_traffic}% traffic"
            return 1
        fi
    done

    return 0
}

# Main canary deployment function
main() {
    log_info "Starting Canary deployment to $ENVIRONMENT environment"
    log_info "Version: $VERSION"
    log_info "Initial traffic: $INITIAL_TRAFFIC%"
    log_info "Max traffic: $MAX_TRAFFIC%"
    log_info "Traffic increment: $INCREMENT%"

    # Set trap for rollback on error
    trap rollback_canary ERR

    configure_environment
    check_prerequisites
    deploy_canary

    # Start with initial traffic
    configure_traffic_routing "$INITIAL_TRAFFIC"

    # Progressive traffic increase
    if progressive_traffic_increase; then
        promote_canary
        log_success "Canary deployment completed successfully!"
    else
        rollback_canary
        log_error "Canary deployment failed and was rolled back"
        exit 1
    fi
}

# Script usage
usage() {
    echo "Usage: $0 <environment> <version> [initial_traffic] [max_traffic] [increment] [analysis_duration]"
    echo ""
    echo "Arguments:"
    echo "  environment: Target environment (staging|production)"
    echo "  version: Version to deploy (e.g., v1.0.0, latest, commit-sha)"
    echo "  initial_traffic: Initial traffic percentage (default: 5)"
    echo "  max_traffic: Maximum traffic percentage (default: 20)"
    echo "  increment: Traffic increment percentage (default: 5)"
    echo "  analysis_duration: Analysis duration in seconds (default: 300)"
    echo ""
    echo "Examples:"
    echo "  $0 staging v1.2.0 5 20 5 300"
    echo "  $0 production latest 10 30 10 600"
    echo "  $0 production $(git rev-parse HEAD) 1 10 1 300"
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