// ============================================
// Xorigo UI - Error Tracking and Reporting System
// Stage 3: Modern Deployment & Monitoring System
// ============================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ErrorTracker {
  constructor() {
    this.config = {
      port: process.env.ERROR_TRACKER_PORT || 9092,
      maxErrors: 1000,
      maxStackTrace: 5000,
      notificationWebhook: process.env.ERROR_WEBHOOK_URL,
      criticalErrorThreshold: 5, // errors per minute
      aggregationWindow: 300000, // 5 minutes
      retentionPeriod: 86400000 // 24 hours
    };

    this.errors = [];
    this.errorGroups = new Map(); // Group similar errors
    this.errorStats = {
      total: 0,
      critical: 0,
      warnings: 0,
      resolved: 0,
      byType: {},
      byService: {},
      timeline: []
    };

    this.criticalErrorsBuffer = [];
    this.startTime = Date.now();
  }

  start() {
    console.log('🚨 Starting Error Tracker...');

    // Start HTTP server
    this.createErrorServer();

    // Start error processing
    this.startErrorProcessing();

    // Start cleanup
    this.startCleanup();

    console.log('✅ Error Tracker started successfully');
  }

  createErrorServer() {
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      this.handleRequest(req, res);
    });

    server.listen(this.config.port, () => {
      console.log(`🚨 Error Tracker server running on port ${this.config.port}`);
      console.log(`📊 Error reporting: http://localhost:${this.config.port}/errors`);
      console.log(`📋 Error dashboard: http://localhost:${this.config.port}/dashboard`);
    });

    return server;
  }

  async handleRequest(req, res) {
    try {
      const url = new URL(req.url, `http://localhost:${this.config.port}`);

      switch (req.method) {
        case 'GET':
          this.handleGetRequest(req, res, url);
          break;
        case 'POST':
          this.handlePostRequest(req, res, url);
          break;
        default:
          res.writeHead(405);
          res.end('Method Not Allowed');
      }
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }

  async handleGetRequest(req, res, url) {
    switch (url.pathname) {
      case '/errors':
        this.handleErrorsEndpoint(req, res, url);
        break;
      case '/dashboard':
        this.handleDashboardEndpoint(req, res);
        break;
      case '/stats':
        this.handleStatsEndpoint(req, res);
        break;
      case '/health':
        this.handleHealthEndpoint(req, res);
        break;
      case '/groups':
        this.handleGroupsEndpoint(req, res);
        break;
      default:
        res.writeHead(404);
        res.end('Not Found');
    }
  }

  async handlePostRequest(req, res, url) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const errorData = JSON.parse(body);

        switch (url.pathname) {
          case '/report':
            this.reportError(errorData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, errorId: errorData.id }));
            break;
          case '/resolve':
            this.resolveError(errorData.errorId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            break;
          default:
            res.writeHead(404);
            res.end('Not Found');
        }
      } catch (error) {
        console.error('Error parsing request body:', error);
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  }

  reportError(errorData) {
    // Generate error ID if not provided
    if (!errorData.id) {
      errorData.id = this.generateErrorId();
    }

    // Add metadata
    errorData.timestamp = errorData.timestamp || new Date().toISOString();
    errorData.receivedAt = new Date().toISOString();
    errorData.stackTrace = this.truncateStackTrace(errorData.stackTrace || '');
    errorData.severity = this.determineSeverity(errorData);
    errorData.groupId = this.generateGroupId(errorData);
    errorData.count = 1;
    errorData.firstSeen = errorData.timestamp;
    errorData.lastSeen = errorData.timestamp;

    // Check if this error already exists (same group)
    const existingError = this.findExistingError(errorData.groupId);
    if (existingError) {
      this.updateExistingError(existingError, errorData);
    } else {
      this.addNewError(errorData);
    }

    // Update statistics
    this.updateStatistics(errorData);

    // Check for critical error threshold
    this.checkCriticalThreshold(errorData);

    // Send notification if critical
    if (errorData.severity === 'critical') {
      this.sendCriticalNotification(errorData);
    }

    console.log(`🚨 Error reported: ${errorData.type} - ${errorData.message}`);
  }

  generateErrorId() {
    return crypto.randomBytes(16).toString('hex');
  }

  generateGroupId(errorData) {
    // Group errors by type, message, and stack trace pattern
    const groupData = {
      type: errorData.type,
      message: errorData.message,
      service: errorData.service || 'unknown',
      // Use first few lines of stack trace for grouping
      stackPattern: this.extractStackPattern(errorData.stackTrace)
    };

    return crypto.createHash('md5').update(JSON.stringify(groupData)).digest('hex');
  }

  extractStackPattern(stackTrace) {
    if (!stackTrace) return '';

    const lines = stackTrace.split('\n');
    // Take first 5 lines of stack trace for grouping
    return lines.slice(0, 5).join('\n');
  }

  determineSeverity(errorData) {
    // Determine severity based on error type and message
    const criticalPatterns = [
      /out of memory/i,
      /cannot read property/i,
      /undefined is not/i,
      /network error/i,
      /database connection/i,
      /authentication failed/i
    ];

    const warningPatterns = [
      /deprecated/i,
      /warning/i,
      /timeout/i,
      /retry/i
    ];

    const message = (errorData.message || '').toLowerCase();

    if (criticalPatterns.some(pattern => pattern.test(message))) {
      return 'critical';
    } else if (warningPatterns.some(pattern => pattern.test(message))) {
      return 'warning';
    } else {
      return 'error';
    }
  }

  findExistingError(groupId) {
    return this.errors.find(error => error.groupId === groupId && !error.resolved);
  }

  updateExistingError(existingError, newError) {
    existingError.count++;
    existingError.lastSeen = newError.timestamp;
    existingError.severity = Math.max(
      this.getSeverityLevel(existingError.severity),
      this.getSeverityLevel(newError.severity)
    );
  }

  getSeverityLevel(severity) {
    const levels = { info: 1, warning: 2, error: 3, critical: 4 };
    return levels[severity] || 2;
  }

  addNewError(errorData) {
    this.errors.unshift(errorData);

    // Keep only recent errors
    if (this.errors.length > this.config.maxErrors) {
      this.errors = this.errors.slice(0, this.config.maxErrors);
    }
  }

  updateStatistics(errorData) {
    this.errorStats.total++;

    // Update by type
    this.errorStats.byType[errorData.type] = (this.errorStats.byType[errorData.type] || 0) + 1;

    // Update by service
    const service = errorData.service || 'unknown';
    this.errorStats.byService[service] = (this.errorStats.byService[service] || 0) + 1;

    // Update severity counters
    switch (errorData.severity) {
      case 'critical':
        this.errorStats.critical++;
        break;
      case 'warning':
        this.errorStats.warnings++;
        break;
    }

    // Update timeline
    this.errorStats.timeline.push({
      timestamp: errorData.timestamp,
      severity: errorData.severity,
      type: errorData.type,
      service: service
    });

    // Keep only recent timeline entries
    if (this.errorStats.timeline.length > 100) {
      this.errorStats.timeline = this.errorStats.timeline.slice(-100);
    }
  }

  checkCriticalThreshold(errorData) {
    if (errorData.severity !== 'critical') return;

    const now = Date.now();
    const windowStart = now - this.config.aggregationWindow;

    // Add to critical errors buffer
    this.criticalErrorsBuffer.push({ timestamp: now, errorId: errorData.id });

    // Clean old entries
    this.criticalErrorsBuffer = this.criticalErrorsBuffer.filter(
      entry => entry.timestamp > windowStart
    );

    // Check threshold
    if (this.criticalErrorsBuffer.length >= this.config.criticalErrorThreshold) {
      this.handleCriticalErrorThreshold();
    }
  }

  handleCriticalErrorThreshold() {
    console.log('🚨 CRITICAL: High error rate detected!');

    const alert = {
      type: 'critical_error_threshold',
      message: `Critical error threshold exceeded: ${this.config.criticalErrorThreshold} errors in ${this.config.aggregationWindow / 1000} seconds`,
      count: this.criticalErrorsBuffer.length,
      threshold: this.config.criticalErrorThreshold,
      window: this.config.aggregationWindow / 1000,
      timestamp: new Date().toISOString()
    };

    this.sendAlert(alert);
  }

  sendCriticalNotification(errorData) {
    if (!this.config.notificationWebhook) return;

    const notification = {
      type: 'critical_error',
      error: {
        id: errorData.id,
        type: errorData.type,
        message: errorData.message,
        service: errorData.service,
        timestamp: errorData.timestamp
      },
      timestamp: new Date().toISOString()
    };

    this.sendWebhookNotification(notification);
  }

  sendAlert(alert) {
    if (!this.config.notificationWebhook) return;

    this.sendWebhookNotification(alert);
  }

  sendWebhookNotification(data) {
    // This would send to Slack, Teams, Discord, etc.
    console.log('📤 Sending webhook notification:', JSON.stringify(data, null, 2));
  }

  resolveError(errorId) {
    const error = this.errors.find(e => e.id === errorId || e.groupId === errorId);
    if (error) {
      error.resolved = true;
      error.resolvedAt = new Date().toISOString();
      this.errorStats.resolved++;
      console.log(`✅ Error resolved: ${errorId}`);
    }
  }

  truncateStackTrace(stackTrace) {
    if (!stackTrace) return '';
    return stackTrace.length > this.config.maxStackTrace
      ? stackTrace.substring(0, this.config.maxStackTrace) + '...[truncated]'
      : stackTrace;
  }

  startErrorProcessing() {
    // Periodic processing and aggregation
    setInterval(() => {
      this.aggregateErrors();
      this.generateErrorReport();
    }, 60000); // Every minute
  }

  startCleanup() {
    // Clean up old errors
    setInterval(() => {
      this.cleanupOldErrors();
    }, 3600000); // Every hour
  }

  aggregateErrors() {
    // Group errors by type and time
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const recentErrors = this.errors.filter(error =>
      new Date(error.timestamp).getTime() > oneHourAgo
    );

    // Create error groups for dashboard
    const groups = {};
    recentErrors.forEach(error => {
      const key = `${error.type}:${error.service}`;
      if (!groups[key]) {
        groups[key] = {
          type: error.type,
          service: error.service,
          count: 0,
          severity: 'info',
          lastSeen: error.timestamp,
          examples: []
        };
      }
      groups[key].count++;
      groups[key].lastSeen = error.lastSeen;
      groups[key].severity = Math.max(
        this.getSeverityLevel(groups[key].severity),
        this.getSeverityLevel(error.severity)
      );

      if (groups[key].examples.length < 3) {
        groups[key].examples.push({
          id: error.id,
          message: error.message,
          timestamp: error.timestamp
        });
      }
    });

    this.errorGroups = new Map(Object.entries(groups));
  }

  generateErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      period: '1 hour',
      summary: {
        total: this.errorStats.total,
        critical: this.errorStats.critical,
        warnings: this.errorStats.warnings,
        resolved: this.errorStats.resolved
      },
      topErrors: this.getTopErrors(),
      services: this.getTopServices(),
      trends: this.getErrorTrends()
    };

    console.log('📊 Error Report Generated:', JSON.stringify(report, null, 2));
    return report;
  }

  getTopErrors() {
    const errorsByType = Object.entries(this.errorStats.byType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));

    return errorsByType;
  }

  getTopServices() {
    const servicesByCount = Object.entries(this.errorStats.byService)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([service, count]) => ({ service, count }));

    return servicesByCount;
  }

  getErrorTrends() {
    const now = Date.now();
    const oneDayAgo = now - 86400000;
    const hourlyBuckets = {};

    // Initialize hourly buckets
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now - (i * 3600000)).getHours();
      hourlyBuckets[hour] = 0;
    }

    // Count errors by hour
    this.errorStats.timeline.forEach(entry => {
      const entryTime = new Date(entry.timestamp).getTime();
      if (entryTime > oneDayAgo) {
        const hour = new Date(entryTime).getHours();
        hourlyBuckets[hour] = (hourlyBuckets[hour] || 0) + 1;
      }
    });

    return Object.entries(hourlyBuckets)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour);
  }

  cleanupOldErrors() {
    const cutoffTime = Date.now() - this.config.retentionPeriod;

    const beforeCount = this.errors.length;
    this.errors = this.errors.filter(error =>
      new Date(error.timestamp).getTime() > cutoffTime
    );

    const cleanedCount = beforeCount - this.errors.length;
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} old errors`);
    }
  }

  // API Endpoint Handlers
  handleErrorsEndpoint(req, res, url) {
    const searchParams = url.searchParams;
    const severity = searchParams.get('severity');
    const service = searchParams.get('service');
    const limit = parseInt(searchParams.get('limit')) || 50;

    let filteredErrors = [...this.errors];

    if (severity) {
      filteredErrors = filteredErrors.filter(error => error.severity === severity);
    }

    if (service) {
      filteredErrors = filteredErrors.filter(error => error.service === service);
    }

    const paginatedErrors = filteredErrors.slice(0, limit);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      errors: paginatedErrors,
      total: filteredErrors.length,
      limit
    }, null, 2));
  }

  handleDashboardEndpoint(req, res) {
    const dashboard = {
      timestamp: new Date().toISOString(),
      summary: this.errorStats,
      recentErrors: this.errors.slice(0, 20),
      errorGroups: Array.from(this.errorGroups.values()),
      criticalThreshold: {
        current: this.criticalErrorsBuffer.length,
        threshold: this.config.criticalErrorThreshold,
        window: this.config.aggregationWindow / 1000
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dashboard, null, 2));
  }

  handleStatsEndpoint(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(this.errorStats, null, 2));
  }

  handleHealthEndpoint(req, res) {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      totalErrors: this.errorStats.total,
      criticalErrors: this.errorStats.critical,
      recentActivity: this.criticalErrorsBuffer.length
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health, null, 2));
  }

  handleGroupsEndpoint(req, res) {
    const groups = Array.from(this.errorGroups.values());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      groups,
      total: groups.length
    }, null, 2));
  }
}

// Start error tracker if this is the main module
if (require.main === module) {
  const tracker = new ErrorTracker();
  tracker.start();

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}, shutting down Error Tracker gracefully...`);
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = ErrorTracker;