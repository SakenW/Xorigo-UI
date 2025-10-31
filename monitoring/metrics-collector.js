// ============================================
// Xorigo UI - Metrics Collector
// Stage 3: Modern Deployment & Monitoring System
// ============================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

class MetricsCollector {
  constructor() {
    this.metrics = {
      system: {
        cpu: 0,
        memory: {
          total: 0,
          used: 0,
          free: 0,
          percentage: 0
        },
        uptime: 0,
        loadAverage: []
      },
      application: {
        httpRequests: 0,
        responseTime: 0,
        errorRate: 0,
        activeConnections: 0
      },
      services: {
        core: {
          status: 'unknown',
          lastCheck: null,
          responseTime: 0
        },
        website: {
          status: 'unknown',
          lastCheck: null,
          responseTime: 0
        }
      }
    };

    this.startTime = Date.now();
    this.port = process.env.PORT || 9090;
    this.metricsInterval = parseInt(process.env.METRICS_INTERVAL) || 30000;
  }

  collectSystemMetrics() {
    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // CPU usage calculation (simplified)
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const cpuUsage = 100 - (idle / total * 100);

    this.metrics.system = {
      cpu: Math.round(cpuUsage * 100) / 100,
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        percentage: Math.round((usedMem / totalMem) * 10000) / 100
      },
      uptime: os.uptime(),
      loadAverage: loadAvg
    };

    return this.metrics.system;
  }

  async collectServiceMetrics() {
    const services = ['core', 'website'];

    for (const serviceName of services) {
      const serviceUrl = process.env[`${serviceName.toUpperCase()}_SERVICE_URL`] ||
        `http://localhost:${serviceName === 'core' ? '3001' : '3100'}`;

      try {
        const startTime = Date.now();
        const response = await this.makeHttpRequest(serviceUrl);
        const responseTime = Date.now() - startTime;

        this.metrics.services[serviceName] = {
          status: response.statusCode >= 200 && response.statusCode < 400 ? 'healthy' : 'unhealthy',
          lastCheck: new Date().toISOString(),
          responseTime: responseTime
        };
      } catch (error) {
        this.metrics.services[serviceName] = {
          status: 'unhealthy',
          lastCheck: new Date().toISOString(),
          responseTime: 0,
          error: error.message
        };
      }
    }

    return this.metrics.services;
  }

  makeHttpRequest(url) {
    return new Promise((resolve, reject) => {
      const request = http.get(url, (response) => {
        resolve(response);
      });

      request.on('error', reject);
      request.setTimeout(5000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  incrementHttpRequests() {
    this.metrics.application.httpRequests++;
  }

  recordResponseTime(time) {
    // Simple exponential moving average
    if (this.metrics.application.responseTime === 0) {
      this.metrics.application.responseTime = time;
    } else {
      this.metrics.application.responseTime =
        0.7 * this.metrics.application.responseTime + 0.3 * time;
    }
  }

  incrementErrors() {
    const totalRequests = this.metrics.application.httpRequests;
    this.metrics.application.errorRate =
      Math.round((this.metrics.application.errorRate * (totalRequests - 1) + 1) / totalRequests * 10000) / 100;
  }

  setActiveConnections(count) {
    this.metrics.application.activeConnections = count;
  }

  formatPrometheusMetrics() {
    const timestamp = Date.now();
    const metrics = [];

    // System metrics
    metrics.push(`# HELP xorigo_ui_system_cpu_usage CPU usage percentage`);
    metrics.push(`# TYPE xorigo_ui_system_cpu_usage gauge`);
    metrics.push(`xorigo_ui_system_cpu_usage ${this.metrics.system.cpu} ${timestamp}`);

    metrics.push(`# HELP xorigo_ui_system_memory_usage Memory usage percentage`);
    metrics.push(`# TYPE xorigo_ui_system_memory_usage gauge`);
    metrics.push(`xorigo_ui_system_memory_usage ${this.metrics.system.memory.percentage} ${timestamp}`);

    metrics.push(`# HELP xorigo_ui_system_uptime System uptime in seconds`);
    metrics.push(`# TYPE xorigo_ui_system_uptime counter`);
    metrics.push(`xorigo_ui_system_uptime ${this.metrics.system.uptime} ${timestamp}`);

    // Application metrics
    metrics.push(`# HELP xorigo_ui_http_requests_total Total HTTP requests`);
    metrics.push(`# TYPE xorigo_ui_http_requests_total counter`);
    metrics.push(`xorigo_ui_http_requests_total ${this.metrics.application.httpRequests} ${timestamp}`);

    metrics.push(`# HELP xorigo_ui_response_time_average Average response time in milliseconds`);
    metrics.push(`# TYPE xorigo_ui_response_time_average gauge`);
    metrics.push(`xorigo_ui_response_time_average ${Math.round(this.metrics.application.responseTime)} ${timestamp}`);

    metrics.push(`# HELP xorigo_ui_error_rate Error rate percentage`);
    metrics.push(`# TYPE xorigo_ui_error_rate gauge`);
    metrics.push(`xorigo_ui_error_rate ${this.metrics.application.errorRate} ${timestamp}`);

    metrics.push(`# HELP xorigo_ui_active_connections Active connections`);
    metrics.push(`# TYPE xorigo_ui_active_connections gauge`);
    metrics.push(`xorigo_ui_active_connections ${this.metrics.application.activeConnections} ${timestamp}`);

    // Service health metrics
    for (const [serviceName, service] of Object.entries(this.metrics.services)) {
      const isHealthy = service.status === 'healthy' ? 1 : 0;

      metrics.push(`# HELP xorigo_ui_service_health Service health status`);
      metrics.push(`# TYPE xorigo_ui_service_health gauge`);
      metrics.push(`xorigo_ui_service_health{service="${serviceName}"} ${isHealthy} ${timestamp}`);

      metrics.push(`# HELP xorigo_ui_service_response_time Service response time`);
      metrics.push(`# TYPE xorigo_ui_service_response_time gauge`);
      metrics.push(`xorigo_ui_service_response_time{service="${serviceName}"} ${service.responseTime} ${timestamp}`);
    }

    // Load average metrics
    this.metrics.system.loadAverage.forEach((load, index) => {
      const periods = ['1m', '5m', '15m'];
      metrics.push(`# HELP xorigo_ui_system_load_average System load average`);
      metrics.push(`# TYPE xorigo_ui_system_load_average gauge`);
      metrics.push(`xorigo_ui_system_load_average{period="${periods[index]}"} ${load} ${timestamp}`);
    });

    return metrics.join('\n') + '\n';
  }

  getAllMetrics() {
    return {
      ...this.metrics,
      collector: {
        uptime: Date.now() - this.startTime,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  }

  startMetricsCollection() {
    console.log('🔍 Starting metrics collection...');

    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, this.metricsInterval);

    // Collect service metrics every 30 seconds
    setInterval(() => {
      this.collectServiceMetrics();
    }, this.metricsInterval);

    console.log(`✅ Metrics collection started (interval: ${this.metricsInterval}ms)`);
  }

  createMetricsServer() {
    const server = http.createServer((req, res) => {
      const startTime = Date.now();

      this.incrementHttpRequests();

      res.setHeader('Content-Type', 'text/plain');

      try {
        if (req.url === '/metrics') {
          // Update metrics before serving
          this.collectSystemMetrics();
          this.collectServiceMetrics();

          const prometheusMetrics = this.formatPrometheusMetrics();

          res.writeHead(200);
          res.end(prometheusMetrics);
        } else if (req.url === '/health') {
          res.writeHead(200);
          res.end('OK');
        } else if (req.url === '/metrics/json') {
          const allMetrics = this.getAllMetrics();

          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(JSON.stringify(allMetrics, null, 2));
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      } catch (error) {
        console.error('Error serving metrics:', error);
        this.incrementErrors();

        res.writeHead(500);
        res.end('Internal Server Error');
      } finally {
        this.recordResponseTime(Date.now() - startTime);
      }
    });

    server.listen(this.port, () => {
      console.log(`📊 Metrics server running on port ${this.port}`);
      console.log(`📈 Prometheus metrics: http://localhost:${this.port}/metrics`);
      console.log(`📋 JSON metrics: http://localhost:${this.port}/metrics/json`);
    });

    return server;
  }
}

// Start the metrics collector if this is the main module
if (require.main === module) {
  const collector = new MetricsCollector();

  // Start metrics collection
  collector.startMetricsCollection();

  // Start HTTP server
  const server = collector.createMetricsServer();

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`Received ${signal}, shutting down gracefully...`);

    server.close(() => {
      console.log('Metrics server stopped');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = MetricsCollector;