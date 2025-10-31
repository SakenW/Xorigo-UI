// ============================================
// Xorigo UI - APM (Application Performance Monitoring) Collector
// Stage 3: Modern Deployment & Monitoring System
// ============================================

const http = require('http');
const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

class APMCollector {
  constructor() {
    this.config = {
      port: process.env.APM_PORT || 9091,
      metricsInterval: parseInt(process.env.METRICS_INTERVAL) || 30000,
      traceSampleRate: parseFloat(process.env.TRACE_SAMPLE_RATE) || 0.1,
      alertThresholds: {
        errorRate: 0.05, // 5%
        responseTime: 2000, // 2 seconds
        throughput: 100 // requests per minute
      }
    };

    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        error: 0,
        timeouts: 0
      },
      responseTime: {
        min: Infinity,
        max: 0,
        avg: 0,
        p50: 0,
        p95: 0,
        p99: 0
      },
      throughput: {
        current: 0,
        lastMinute: 0,
        peak: 0
      },
      errors: {
        rate: 0,
        types: {},
        recent: []
      },
      traces: [],
      spans: [],
      alerts: {
        active: [],
        history: []
      }
    };

    this.responseTimes = [];
    this.requestBuffer = [];
    this.startTime = Date.now();
  }

  start() {
    console.log('🚀 Starting APM Collector...');

    // Start metrics collection
    this.startMetricsCollection();

    // Start HTTP server
    this.createAPMServer();

    // Start alert monitoring
    this.startAlertMonitoring();

    console.log('✅ APM Collector started successfully');
  }

  startMetricsCollection() {
    setInterval(() => {
      this.calculateMetrics();
      this.cleanupOldData();
    }, this.config.metricsInterval);

    console.log(`📊 Metrics collection started (interval: ${this.config.metricsInterval}ms)`);
  }

  startAlertMonitoring() {
    setInterval(() => {
      this.checkAlerts();
    }, 60000); // Check alerts every minute

    console.log('🚨 Alert monitoring started');
  }

  recordRequest(req, res, startTime, endTime, error = null) {
    const responseTime = endTime - startTime;
    const traceId = this.generateTraceId();
    const spanId = this.generateSpanId();

    // Update request metrics
    this.metrics.requests.total++;

    if (error) {
      this.metrics.requests.error++;
      this.recordError(error, req, responseTime);
    } else {
      this.metrics.requests.success++;
    }

    // Update response time metrics
    this.responseTimes.push(responseTime);
    this.metrics.responseTime.min = Math.min(this.metrics.responseTime.min, responseTime);
    this.metrics.responseTime.max = Math.max(this.metrics.responseTime.max, responseTime);

    // Create trace
    const trace = {
      traceId,
      spanId,
      parentSpanId: null,
      operationName: `${req.method} ${req.url}`,
      startTime: startTime,
      duration: responseTime,
      tags: {
        'http.method': req.method,
        'http.url': req.url,
        'http.status_code': res.statusCode,
        'service.name': process.env.SERVICE_NAME || 'xorigo-ui',
        'service.version': process.env.VERSION || 'unknown'
      },
      error: error ? {
        type: error.name,
        message: error.message,
        stack: error.stack
      } : null
    };

    this.metrics.traces.push(trace);

    // Sample traces for storage (keep only recent ones)
    if (Math.random() < this.config.traceSampleRate) {
      this.metrics.spans.push(trace);
    }

    // Log trace
    this.logTrace(trace);
  }

  recordError(error, req, responseTime) {
    const errorType = error.name || 'UnknownError';

    // Update error metrics
    this.metrics.errors.types[errorType] = (this.metrics.errors.types[errorType] || 0) + 1;

    // Add to recent errors
    this.metrics.errors.recent.push({
      type: errorType,
      message: error.message,
      url: req.url,
      method: req.method,
      responseTime,
      timestamp: new Date().toISOString(),
      traceId: this.generateTraceId()
    });

    // Keep only recent errors (last 100)
    if (this.metrics.errors.recent.length > 100) {
      this.metrics.errors.recent = this.metrics.errors.recent.slice(-100);
    }
  }

  calculateMetrics() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Calculate response time metrics
    if (this.responseTimes.length > 0) {
      this.responseTimes.sort((a, b) => a - b);

      this.metrics.responseTime.avg = this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
      this.metrics.responseTime.p50 = this.responseTimes[Math.floor(this.responseTimes.length * 0.5)];
      this.metrics.responseTime.p95 = this.responseTimes[Math.floor(this.responseTimes.length * 0.95)];
      this.metrics.responseTime.p99 = this.responseTimes[Math.floor(this.responseTimes.length * 0.99)];

      // Keep only recent response times
      this.responseTimes = this.responseTimes.slice(-1000);
    }

    // Calculate error rate
    const totalRequests = this.metrics.requests.total;
    const errorRequests = this.metrics.requests.error;
    this.metrics.errors.rate = totalRequests > 0 ? (errorRequests / totalRequests) : 0;

    // Calculate throughput (requests per minute)
    const recentRequests = this.metrics.traces.filter(trace => trace.startTime > oneMinuteAgo);
    this.metrics.throughput.current = recentRequests.length;
    this.metrics.throughput.lastMinute = recentRequests.length;
    this.metrics.throughput.peak = Math.max(this.metrics.throughput.peak, this.metrics.throughput.current);

    // Clean old traces (keep last 1000)
    if (this.metrics.traces.length > 1000) {
      this.metrics.traces = this.metrics.traces.slice(-1000);
    }

    if (this.metrics.spans.length > 100) {
      this.metrics.spans = this.metrics.spans.slice(-100);
    }
  }

  checkAlerts() {
    const alerts = [];

    // Check error rate
    if (this.metrics.errors.rate > this.config.alertThresholds.errorRate) {
      alerts.push({
        type: 'error_rate',
        severity: 'warning',
        message: `High error rate: ${(this.metrics.errors.rate * 100).toFixed(2)}%`,
        threshold: this.config.alertThresholds.errorRate,
        current: this.metrics.errors.rate,
        timestamp: new Date().toISOString()
      });
    }

    // Check response time
    if (this.metrics.responseTime.p95 > this.config.alertThresholds.responseTime) {
      alerts.push({
        type: 'response_time',
        severity: 'warning',
        message: `High response time: ${this.metrics.responseTime.p95}ms (P95)`,
        threshold: this.config.alertThresholds.responseTime,
        current: this.metrics.responseTime.p95,
        timestamp: new Date().toISOString()
      });
    }

    // Check throughput
    if (this.metrics.throughput.current < this.config.alertThresholds.throughput) {
      alerts.push({
        type: 'low_throughput',
        severity: 'info',
        message: `Low throughput: ${this.metrics.throughput.current} req/min`,
        threshold: this.config.alertThresholds.throughput,
        current: this.metrics.throughput.current,
        timestamp: new Date().toISOString()
      });
    }

    // Update alerts
    this.metrics.alerts.active = alerts;
    this.metrics.alerts.history.push(...alerts);

    // Keep only recent alerts (last 50)
    if (this.metrics.alerts.history.length > 50) {
      this.metrics.alerts.history = this.metrics.alerts.history.slice(-50);
    }

    // Log active alerts
    if (alerts.length > 0) {
      alerts.forEach(alert => {
        console.log(`🚨 [${alert.severity.toUpperCase()}] ${alert.message}`);
      });
    }
  }

  cleanupOldData() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    // Clean old error records
    this.metrics.errors.recent = this.metrics.errors.recent.filter(error =>
      new Date(error.timestamp).getTime() > oneHourAgo
    );

    // Clean old alert history
    this.metrics.alerts.history = this.metrics.alerts.history.filter(alert =>
      new Date(alert.timestamp).getTime() > oneHourAgo
    );
  }

  generateTraceId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  generateSpanId() {
    return Math.random().toString(36).substring(2, 10);
  }

  logTrace(trace) {
    const logLevel = trace.error ? 'ERROR' : 'INFO';
    const message = `[${trace.traceId}] ${trace.operationName} - ${trace.duration}ms`;

    if (trace.error) {
      console.error(`🔴 ${logLevel}: ${message}`);
      console.error(`   Error: ${trace.error.message}`);
    } else {
      console.log(`🟢 ${logLevel}: ${message}`);
    }
  }

  createAPMServer() {
    const server = http.createServer((req, res) => {
      const startTime = Date.now();

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      // Handle requests
      this.handleRequest(req, res, startTime);
    });

    server.listen(this.config.port, () => {
      console.log(`📈 APM server running on port ${this.config.port}`);
      console.log(`📊 Metrics endpoint: http://localhost:${this.config.port}/metrics`);
      console.log(`🔍 Traces endpoint: http://localhost:${this.config.port}/traces`);
      console.log(`📋 Health endpoint: http://localhost:${this.config.port}/health`);
    });

    return server;
  }

  async handleRequest(req, res, startTime) {
    const endTime = Date.now();
    let error = null;

    try {
      const url = new URL(req.url, `http://localhost:${this.config.port}`);

      switch (url.pathname) {
        case '/metrics':
          this.handleMetricsEndpoint(req, res);
          break;
        case '/traces':
          this.handleTracesEndpoint(req, res);
          break;
        case '/health':
          this.handleHealthEndpoint(req, res);
          break;
        case '/alerts':
          this.handleAlertsEndpoint(req, res);
          break;
        case '/performance':
          this.handlePerformanceEndpoint(req, res);
          break;
        default:
          res.writeHead(404);
          res.end('Not Found');
      }
    } catch (err) {
      error = err;
      res.writeHead(500);
      res.end('Internal Server Error');
    } finally {
      // Record the request for APM
      this.recordRequest(req, res, startTime, endTime, error);
    }
  }

  handleMetricsEndpoint(req, res) {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      requests: this.metrics.requests,
      responseTime: this.metrics.responseTime,
      throughput: this.metrics.throughput,
      errors: {
        rate: this.metrics.errors.rate,
        count: this.metrics.requests.error,
        types: this.metrics.errors.types
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics, null, 2));
  }

  handleTracesEndpoint(req, res) {
    const traces = {
      timestamp: new Date().toISOString(),
      total: this.metrics.traces.length,
      sampled: this.metrics.spans.length,
      traces: this.metrics.spans.slice(-20) // Return last 20 traces
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(traces, null, 2));
  }

  handleHealthEndpoint(req, res) {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: process.env.VERSION || '1.0.0',
      metrics: {
        totalRequests: this.metrics.requests.total,
        errorRate: this.metrics.errors.rate,
        avgResponseTime: this.metrics.responseTime.avg
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health, null, 2));
  }

  handleAlertsEndpoint(req, res) {
    const alerts = {
      timestamp: new Date().toISOString(),
      active: this.metrics.alerts.active,
      recent: this.metrics.alerts.history.slice(-10),
      thresholds: this.config.alertThresholds
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(alerts, null, 2));
  }

  handlePerformanceEndpoint(req, res) {
    const performance = {
      timestamp: new Date().toISOString(),
      responseTime: {
        avg: this.metrics.responseTime.avg,
        min: this.metrics.responseTime.min,
        max: this.metrics.responseTime.max,
        p50: this.metrics.responseTime.p50,
        p95: this.metrics.responseTime.p95,
        p99: this.metrics.responseTime.p99
      },
      throughput: this.metrics.throughput,
      errors: {
        rate: this.metrics.errors.rate,
        total: this.metrics.requests.error,
        recent: this.metrics.errors.recent.slice(-10)
      },
      alerts: {
        active: this.metrics.alerts.active.length,
        total: this.metrics.alerts.history.length
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(performance, null, 2));
  }
}

// Start APM collector if this is the main module
if (require.main === module) {
  const apm = new APMCollector();
  apm.start();

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}, shutting down APM collector gracefully...`);
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = APMCollector;