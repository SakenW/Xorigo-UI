// ============================================
// Xorigo UI - Health Check Script
// Stage 3: Modern Deployment & Monitoring System
// ============================================

const http = require('http');
const https = require('https');
const { URL } = require('url');

class HealthChecker {
  constructor() {
    this.services = {
      core: {
        url: process.env.CORE_SERVICE_URL || 'http://localhost:3001/health',
        timeout: 5000,
        retries: 3,
        interval: 30000
      },
      website: {
        url: process.env.WEBSITE_SERVICE_URL || 'http://localhost:3100/',
        timeout: 10000,
        retries: 3,
        interval: 30000
      }
    };

    this.metrics = {
      totalChecks: 0,
      successfulChecks: 0,
      failedChecks: 0,
      services: {
        core: { up: 0, down: 0, lastCheck: null },
        website: { up: 0, down: 0, lastCheck: null }
      }
    };

    this.isRunning = false;
  }

  async checkHealth(serviceName, config) {
    const startTime = Date.now();

    try {
      const response = await this.makeRequest(config.url, config.timeout);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.statusCode >= 200 && response.statusCode < 400) {
        this.metrics.services[serviceName].up++;
        this.metrics.services[serviceName].lastCheck = new Date().toISOString();

        console.log(`✅ ${serviceName}: UP (${response.statusCode}) - ${responseTime}ms`);

        // Log successful health check metrics
        this.logMetrics(serviceName, 'success', responseTime, response.statusCode);

        return {
          status: 'healthy',
          responseTime,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(`HTTP ${response.statusCode}`);
      }
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      this.metrics.services[serviceName].down++;
      this.metrics.services[serviceName].lastCheck = new Date().toISOString();

      console.error(`❌ ${serviceName}: DOWN - ${error.message} (${responseTime}ms)`);

      // Log failed health check metrics
      this.logMetrics(serviceName, 'failure', responseTime, error.code || 'UNKNOWN');

      return {
        status: 'unhealthy',
        error: error.message,
        responseTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  makeRequest(url, timeout) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;

      const req = client.request(url, {
        timeout,
        headers: {
          'User-Agent': 'Xorigo-UI-HealthChecker/1.0'
        }
      }, (res) => {
        resolve(res);
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  logMetrics(serviceName, status, responseTime, statusCode) {
    const timestamp = Date.now();
    const labels = `service="${serviceName}",status="${status}"`;

    // Prometheus metrics format
    console.log(`# HELP xorigo_ui_health_check_response_time Response time for health checks`);
    console.log(`# TYPE xorigo_ui_health_check_response_time gauge`);
    console.log(`xorigo_ui_health_check_response_time{${labels}} ${responseTime} ${timestamp}`);

    console.log(`# HELP xorigo_ui_health_check_status Health check status (1 for success, 0 for failure)`);
    console.log(`# TYPE xorigo_ui_health_check_status gauge`);
    console.log(`xorigo_ui_health_check_status{${labels}} ${status === 'success' ? 1 : 0} ${timestamp}`);

    console.log(`# HELP xorigo_ui_health_check_total Total number of health checks`);
    console.log(`# TYPE xorigo_ui_health_check_total counter`);
    console.log(`xorigo_ui_health_check_total{${labels}} 1 ${timestamp}`);
  }

  async checkAllServices() {
    const results = {};

    for (const [serviceName, config] of Object.entries(this.services)) {
      let retries = config.retries;
      let lastResult = null;

      while (retries > 0) {
        try {
          lastResult = await this.checkHealth(serviceName, config);
          if (lastResult.status === 'healthy') {
            break;
          }
        } catch (error) {
          console.error(`Health check failed for ${serviceName}:`, error.message);
        }

        retries--;
        if (retries > 0) {
          await this.sleep(2000); // Wait 2 seconds before retry
        }
      }

      results[serviceName] = lastResult;
      this.metrics.totalChecks++;
      this.metrics.successfulChecks += lastResult.status === 'healthy' ? 1 : 0;
      this.metrics.failedChecks += lastResult.status === 'unhealthy' ? 1 : 0;
    }

    return results;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async startMonitoring() {
    if (this.isRunning) {
      console.log('Health monitoring is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting health monitoring...');
    console.log('=====================================');

    // Initial health check
    await this.checkAllServices();

    // Start periodic monitoring
    for (const [serviceName, config] of Object.entries(this.services)) {
      setInterval(async () => {
        if (this.isRunning) {
          await this.checkHealth(serviceName, config);
        }
      }, config.interval);
    }

    // Periodic comprehensive health report
    setInterval(() => {
      this.generateHealthReport();
    }, 60000); // Every minute

    console.log('✅ Health monitoring started successfully');
  }

  generateHealthReport() {
    const uptime = this.metrics.totalChecks > 0
      ? ((this.metrics.successfulChecks / this.metrics.totalChecks) * 100).toFixed(2)
      : 0;

    console.log('\n📊 Health Report - ' + new Date().toISOString());
    console.log('=====================================');
    console.log(`Total Checks: ${this.metrics.totalChecks}`);
    console.log(`Successful: ${this.metrics.successfulChecks}`);
    console.log(`Failed: ${this.metrics.failedChecks}`);
    console.log(`Overall Uptime: ${uptime}%`);

    for (const [serviceName, stats] of Object.entries(this.metrics.services)) {
      const serviceUptime = (stats.up + stats.down) > 0
        ? ((stats.up / (stats.up + stats.down)) * 100).toFixed(2)
        : 0;

      console.log(`\n${serviceName.toUpperCase()}:`);
      console.log(`  Up: ${stats.up}, Down: ${stats.down}`);
      console.log(`  Service Uptime: ${serviceUptime}%`);
      console.log(`  Last Check: ${stats.lastCheck}`);
    }
    console.log('=====================================\n');
  }

  stopMonitoring() {
    this.isRunning = false;
    console.log('Health monitoring stopped');
  }

  getMetrics() {
    return {
      ...this.metrics,
      uptime: this.metrics.totalChecks > 0
        ? ((this.metrics.successfulChecks / this.metrics.totalChecks) * 100).toFixed(2)
        : 0,
      timestamp: new Date().toISOString()
    };
  }
}

// Express server for metrics endpoint
if (require.main === module) {
  const http = require('http');
  const healthChecker = new HealthChecker();

  // Start health monitoring
  healthChecker.startMonitoring();

  // Create HTTP server for metrics endpoint
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    if (req.url === '/metrics') {
      const metrics = healthChecker.getMetrics();

      // Output Prometheus-formatted metrics
      res.writeHead(200);
      res.end(`# HELP xorigo_ui_health_overall_uptime Overall system uptime percentage
# TYPE xorigo_ui_health_overall_uptime gauge
xorigo_ui_health_overall_uptime ${metrics.uptime}

# HELP xorigo_ui_health_total_checks Total number of health checks performed
# TYPE xorigo_ui_health_total_checks counter
xorigo_ui_health_total_checks ${metrics.totalChecks}

# HELP xorigo_ui_health_successful_checks Number of successful health checks
# TYPE xorigo_ui_health_successful_checks counter
xorigo_ui_health_successful_checks ${metrics.successfulChecks}

# HELP xorigo_ui_health_failed_checks Number of failed health checks
# TYPE xorigo_ui_health_failed_checks counter
xorigo_ui_health_failed_checks ${metrics.failed_checks}
`);
    } else if (req.url === '/health') {
      res.writeHead(200);
      res.end('OK');
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  const PORT = process.env.PORT || 9090;
  server.listen(PORT, () => {
    console.log(`📈 Health monitoring server running on port ${PORT}`);
    console.log(`Metrics available at: http://localhost:${PORT}/metrics`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    healthChecker.stopMonitoring();
    server.close(() => {
      console.log('Health monitoring server stopped');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    healthChecker.stopMonitoring();
    server.close(() => {
      console.log('Health monitoring server stopped');
      process.exit(0);
    });
  });
}

module.exports = HealthChecker;