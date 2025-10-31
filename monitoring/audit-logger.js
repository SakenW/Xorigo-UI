// ============================================
// Xorigo UI - Security Audit Logger and Compliance Checker
// Stage 3: Modern Deployment & Monitoring System
// ============================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createHash } = crypto;

class AuditLogger {
  constructor() {
    this.config = {
      port: process.env.AUDIT_PORT || 9093,
      logLevel: process.env.AUDIT_LOG_LEVEL || 'info',
      logRetention: parseInt(process.env.LOG_RETENTION) || 90, // days
      maxLogSize: parseInt(process.env.MAX_LOG_SIZE) || 100, // MB
      enableCompliance: process.env.ENABLE_COMPLIANCE === 'true',
      complianceStandards: (process.env.COMPLIANCE_STANDARDS || 'SOX,PCI-DSS,GDPR').split(','),
      alertThresholds: {
        failedLogins: 5,
        suspiciousActivity: 3,
        dataAccess: 100
      }
    };

    this.logDirectory = path.join(process.cwd(), 'logs', 'audit');
    this.complianceDirectory = path.join(process.cwd(), 'logs', 'compliance');
    this.ensureLogDirectories();

    this.auditEvents = [];
    this.complianceReports = [];
    this.securityIncidents = [];
    this.sessionTracker = new Map();
  }

  ensureLogDirectories() {
    [this.logDirectory, this.complianceDirectory].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  start() {
    console.log('🔒 Starting Security Audit Logger...');

    // Start HTTP server for audit endpoints
    this.createAuditServer();

    // Start log rotation
    this.startLogRotation();

    // Start compliance monitoring
    if (this.config.enableCompliance) {
      this.startComplianceMonitoring();
    }

    // Start security monitoring
    this.startSecurityMonitoring();

    console.log('✅ Security Audit Logger started successfully');
  }

  createAuditServer() {
    const http = require('http');
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      this.handleAuditRequest(req, res);
    });

    server.listen(this.config.port, () => {
      console.log(`🔒 Audit server running on port ${this.config.port}`);
      console.log(`📋 Audit endpoints:`);
      console.log(`  - Audit logs: http://localhost:${this.config.port}/audit/logs`);
      console.log(`  - Compliance reports: http://localhost:${this.config.port}/audit/compliance`);
      console.log(`  - Security incidents: http://localhost:${this.config.port}/audit/incidents`);
    });

    return server;
  }

  async handleAuditRequest(req, res) {
    try {
      const url = new URL(req.url, `http://localhost:${this.config.port}`);

      // Log access to audit system
      this.logAuditEvent({
        type: 'audit_access',
        timestamp: new Date().toISOString(),
        user: this.extractUserFromRequest(req),
        ip: req.socket.remoteAddress,
        method: req.method,
        path: url.pathname,
        userAgent: req.headers['user-agent']
      });

      switch (req.method) {
        case 'GET':
          await this.handleGetRequest(req, res, url);
          break;
        case 'POST':
          await this.handlePostRequest(req, res, url);
          break;
        default:
          res.writeHead(405);
          res.end('Method Not Allowed');
      }
    } catch (error) {
      console.error('Error handling audit request:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }

  async handleGetRequest(req, res, url) {
    switch (url.pathname) {
      case '/audit/logs':
        this.handleAuditLogs(req, res, url);
        break;
      case '/audit/compliance':
        this.handleComplianceReports(req, res);
        break;
      case '/audit/incidents':
        this.handleSecurityIncidents(req, res);
        break;
      case '/audit/health':
        this.handleHealthCheck(req, res);
        break;
      case '/audit/summary':
        this.handleAuditSummary(req, res);
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
        const eventData = JSON.parse(body);

        switch (url.pathname) {
          case '/audit/log':
            this.logAuditEvent(eventData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            break;
          case '/audit/incident':
            this.reportSecurityIncident(eventData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            break;
          default:
            res.writeHead(404);
            res.end('Not Found');
        }
      } catch (error) {
        console.error('Error parsing audit event:', error);
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  }

  logAuditEvent(event) {
    // Add required fields
    const auditEvent = {
      id: this.generateEventId(),
      timestamp: event.timestamp || new Date().toISOString(),
      type: event.type || 'unknown',
      user: event.user || 'anonymous',
      ip: event.ip || 'unknown',
      session: event.session || 'none',
      action: event.action || 'unknown',
      resource: event.resource || 'unknown',
      outcome: event.outcome || 'unknown',
      details: event.details || {},
      severity: event.severity || 'info',
      category: this.categorizeEvent(event.type),
      ...event
    };

    // Calculate event hash for integrity
    auditEvent.hash = this.calculateEventHash(auditEvent);

    // Store in memory
    this.auditEvents.unshift(auditEvent);

    // Keep only recent events in memory
    if (this.auditEvents.length > 10000) {
      this.auditEvents = this.auditEvents.slice(0, 10000);
    }

    // Write to file
    this.writeAuditEventToFile(auditEvent);

    // Check for security violations
    this.checkSecurityViolations(auditEvent);

    // Update compliance metrics
    if (this.config.enableCompliance) {
      this.updateComplianceMetrics(auditEvent);
    }

    console.log(`🔒 Audit Event: ${auditEvent.type} - ${auditEvent.user} - ${auditEvent.action}`);
  }

  categorizeEvent(type) {
    const categories = {
      'login': 'authentication',
      'logout': 'authentication',
      'password_change': 'authentication',
      'user_create': 'user_management',
      'user_update': 'user_management',
      'user_delete': 'user_management',
      'role_change': 'authorization',
      'permission_change': 'authorization',
      'data_access': 'data_access',
      'data_modify': 'data_access',
      'data_export': 'data_access',
      'data_delete': 'data_access',
      'config_change': 'configuration',
      'system_start': 'system',
      'system_stop': 'system',
      'security_incident': 'security',
      'audit_access': 'audit',
      'api_access': 'api_access',
      'file_access': 'file_access'
    };

    return categories[type] || 'general';
  }

  calculateEventHash(event) {
    const eventString = JSON.stringify(event, Object.keys(event).sort());
    return createHash('sha256').update(eventString).digest('hex');
  }

  writeAuditEventToFile(event) {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDirectory, `audit-${today}.log`);

    const logEntry = JSON.stringify(event) + '\n';

    try {
      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      console.error('Error writing audit event to file:', error);
    }
  }

  checkSecurityViolations(event) {
    const violations = [];

    // Check for multiple failed logins
    if (event.type === 'login' && event.outcome === 'failure') {
      const key = `${event.ip}:${event.user}`;
      const attempts = (this.sessionTracker.get(key) || 0) + 1;
      this.sessionTracker.set(key, attempts);

      if (attempts >= this.config.alertThresholds.failedLogins) {
        violations.push({
          type: 'brute_force_attempt',
          severity: 'high',
          description: `Multiple failed login attempts from ${event.ip}`,
          user: event.user,
          ip: event.ip,
          count: attempts
        });
      }
    }

    // Check for suspicious activity
    if (event.category === 'data_access' && event.outcome === 'denied') {
      violations.push({
        type: 'unauthorized_access_attempt',
        severity: 'medium',
        description: `Unauthorized access attempt to ${event.resource}`,
        user: event.user,
        ip: event.ip,
        resource: event.resource
      });
    }

    // Check for privilege escalation
    if (event.type === 'role_change' && !this.isValidRoleChange(event)) {
      violations.push({
        type: 'suspicious_role_change',
        severity: 'high',
        description: `Suspicious role change detected`,
        user: event.user,
        details: event.details
      });
    }

    // Report violations
    violations.forEach(violation => {
      this.reportSecurityIncident({
        ...violation,
        source: 'audit_system',
        timestamp: event.timestamp,
        eventId: event.id
      });
    });
  }

  isValidRoleChange(event) {
    // Implement business logic for valid role changes
    // This is a placeholder implementation
    return event.details && event.details.approved && event.details.approver;
  }

  reportSecurityIncident(incident) {
    const securityIncident = {
      id: this.generateEventId(),
      timestamp: incident.timestamp || new Date().toISOString(),
      type: incident.type || 'unknown',
      severity: incident.severity || 'medium',
      description: incident.description || 'Security incident',
      user: incident.user || 'unknown',
      ip: incident.ip || 'unknown',
      source: incident.source || 'manual',
      status: 'open',
      details: incident.details || {},
      mitigations: [],
      timeline: [{
        timestamp: new Date().toISOString(),
        action: 'incident_reported',
        details: incident
      }]
    };

    this.securityIncidents.unshift(securityIncident);

    // Keep only recent incidents
    if (this.securityIncidents.length > 1000) {
      this.securityIncidents = this.securityIncidents.slice(0, 1000);
    }

    // Write incident to file
    this.writeSecurityIncidentToFile(securityIncident);

    // Alert on high severity incidents
    if (incident.severity === 'high' || incident.severity === 'critical') {
      this.sendSecurityAlert(securityIncident);
    }

    console.log(`🚨 Security Incident: ${incident.type} - ${incident.severity} - ${incident.description}`);
  }

  writeSecurityIncidentToFile(incident) {
    const today = new Date().toISOString().split('T')[0];
    const incidentFile = path.join(this.logDirectory, `incidents-${today}.json`);

    try {
      let incidents = [];
      if (fs.existsSync(incidentFile)) {
        const content = fs.readFileSync(incidentFile, 'utf8');
        incidents = JSON.parse(content);
      }

      incidents.push(incident);
      fs.writeFileSync(incidentFile, JSON.stringify(incidents, null, 2));
    } catch (error) {
      console.error('Error writing security incident to file:', error);
    }
  }

  sendSecurityAlert(incident) {
    // This would integrate with alerting systems
    console.log(`🚨 SECURITY ALERT: ${incident.description}`);

    // Log the alert
    this.logAuditEvent({
      type: 'security_alert',
      timestamp: incident.timestamp,
      user: 'system',
      action: 'security_incident_alert',
      resource: incident.id,
      details: {
        incidentId: incident.id,
        severity: incident.severity,
        description: incident.description
      },
      severity: 'critical'
    });
  }

  startComplianceMonitoring() {
    console.log('📋 Starting compliance monitoring...');

    // Generate compliance reports daily
    setInterval(() => {
      this.generateComplianceReport();
    }, 24 * 60 * 60 * 1000); // Daily

    // Generate initial report
    this.generateComplianceReport();
  }

  generateComplianceReport() {
    const report = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      period: '24h',
      standards: this.config.complianceStandards,
      metrics: {},
      findings: [],
      recommendations: [],
      status: 'compliant'
    };

    // Calculate metrics for each standard
    this.config.complianceStandards.forEach(standard => {
      report.metrics[standard] = this.calculateComplianceMetrics(standard);
    });

    // Generate findings
    report.findings = this.generateComplianceFindings(report.metrics);

    // Generate recommendations
    report.recommendations = this.generateComplianceRecommendations(report.findings);

    // Determine overall status
    report.status = this.determineComplianceStatus(report.findings);

    // Store report
    this.complianceReports.unshift(report);

    // Keep only recent reports
    if (this.complianceReports.length > 30) {
      this.complianceReports = this.complianceReports.slice(0, 30);
    }

    // Write report to file
    this.writeComplianceReportToFile(report);

    console.log(`📋 Compliance Report Generated: ${report.status}`);
  }

  calculateComplianceMetrics(standard) {
    const now = Date.now();
    const yesterday = now - (24 * 60 * 60 * 1000);

    const recentEvents = this.auditEvents.filter(event =>
      new Date(event.timestamp).getTime() > yesterday
    );

    switch (standard) {
      case 'SOX':
        return this.calculateSOXMetrics(recentEvents);
      case 'PCI-DSS':
        return this.calculatePCIDSSMetrics(recentEvents);
      case 'GDPR':
        return this.calculateGDPRMetrics(recentEvents);
      default:
        return { status: 'not_applicable', score: 100 };
    }
  }

  calculateSOXMetrics(events) {
    const accessEvents = events.filter(e => e.category === 'data_access');
    const modificationEvents = events.filter(e => e.category === 'data_access' && e.action.includes('modify'));
    const auditEvents = events.filter(e => e.category === 'audit');

    return {
      accessLogging: {
        required: true,
        implemented: accessEvents.length > 0,
        coverage: (accessEvents.length / Math.max(events.length, 1)) * 100
      },
      changeManagement: {
        required: true,
        implemented: modificationEvents.length > 0,
        tracked: modificationEvents.filter(e => e.details.approved).length
      },
      auditTrail: {
        required: true,
        implemented: auditEvents.length > 0,
        integrity: auditEvents.filter(e => e.hash).length / Math.max(auditEvents.length, 1) * 100
      },
      score: 85 // Placeholder calculation
    };
  }

  calculatePCIDSSMetrics(events) {
    const authEvents = events.filter(e => e.category === 'authentication');
    const dataAccessEvents = events.filter(e => e.category === 'data_access' && e.resource.includes('card'));
    const encryptionEvents = events.filter(e => e.action.includes('encrypt'));

    return {
      accessControl: {
        required: true,
        implemented: authEvents.length > 0,
        mfaEnabled: authEvents.filter(e => e.details.mfa).length
      },
      dataProtection: {
        required: true,
        implemented: encryptionEvents.length > 0,
        encryptedAccess: dataAccessEvents.filter(e => e.details.encrypted).length
      },
      monitoring: {
        required: true,
        implemented: events.filter(e => e.severity === 'high').length > 0
      },
      score: 90 // Placeholder calculation
    };
  }

  calculateGDPRMetrics(events) {
    const dataAccessEvents = events.filter(e => e.category === 'data_access');
    const consentEvents = events.filter(e => e.action.includes('consent'));
    const dataDeletionEvents = events.filter(e => e.action.includes('delete'));

    return {
      lawfulProcessing: {
        required: true,
        implemented: consentEvents.length > 0,
        consentRecorded: consentEvents.filter(e => e.details.consentId).length
      },
      dataMinimization: {
        required: true,
        implemented: dataAccessEvents.filter(e => e.details.purpose).length > 0
      },
      rightToErasure: {
        required: true,
        implemented: dataDeletionEvents.length > 0,
        deletionConfirmed: dataDeletionEvents.filter(e => e.outcome === 'success').length
      },
      score: 88 // Placeholder calculation
    };
  }

  generateComplianceFindings(metrics) {
    const findings = [];

    Object.entries(metrics).forEach(([standard, standardMetrics]) => {
      Object.entries(standardMetrics).forEach(([control, metric]) => {
        if (metric.required && !metric.implemented) {
          findings.push({
            standard,
            control,
            severity: 'high',
            description: `Required control not implemented: ${control}`,
            recommendation: `Implement ${control} controls for ${standard} compliance`
          });
        } else if (metric.score < 80) {
          findings.push({
            standard,
            control,
            severity: 'medium',
            description: `Control implementation needs improvement: ${control}`,
            recommendation: `Enhance ${control} controls to meet ${standard} requirements`
          });
        }
      });
    });

    return findings;
  }

  generateComplianceRecommendations(findings) {
    const recommendations = [];

    findings.forEach(finding => {
      recommendations.push({
        category: finding.severity === 'high' ? 'required' : 'recommended',
        standard: finding.standard,
        description: finding.recommendation,
        priority: finding.severity === 'high' ? 'immediate' : '30_days',
        effort: this.estimateImplementationEffort(finding.control)
      });
    });

    return recommendations;
  }

  estimateImplementationEffort(control) {
    const efforts = {
      'accessLogging': 'low',
      'changeManagement': 'medium',
      'auditTrail': 'low',
      'accessControl': 'high',
      'dataProtection': 'high',
      'monitoring': 'medium',
      'lawfulProcessing': 'medium',
      'dataMinimization': 'low',
      'rightToErasure': 'medium'
    };

    return efforts[control] || 'medium';
  }

  determineComplianceStatus(findings) {
    const highSeverityFindings = findings.filter(f => f.severity === 'high');
    const mediumSeverityFindings = findings.filter(f => f.severity === 'medium');

    if (highSeverityFindings.length > 0) {
      return 'non_compliant';
    } else if (mediumSeverityFindings.length > 3) {
      return 'partially_compliant';
    } else {
      return 'compliant';
    }
  }

  writeComplianceReportToFile(report) {
    const today = new Date().toISOString().split('T')[0];
    const reportFile = path.join(this.complianceDirectory, `compliance-${today}.json`);

    try {
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    } catch (error) {
      console.error('Error writing compliance report to file:', error);
    }
  }

  updateComplianceMetrics(event) {
    // Update real-time compliance metrics based on events
    // This would track specific compliance requirements
  }

  startSecurityMonitoring() {
    console.log('🔒 Starting security monitoring...');

    // Monitor for security patterns
    setInterval(() => {
      this.analyzeSecurityPatterns();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  analyzeSecurityPatterns() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    const recentEvents = this.auditEvents.filter(event =>
      new Date(event.timestamp).getTime() > oneHourAgo
    );

    // Analyze patterns
    this.anomalousLoginPatterns(recentEvents);
    this.anomalousAccessPatterns(recentEvents);
    this.anomalousTimePatterns(recentEvents);
  }

  anomalousLoginPatterns(events) {
    const loginEvents = events.filter(e => e.type === 'login');
    const failedLogins = loginEvents.filter(e => e.outcome === 'failure');

    // Check for distributed brute force attempts
    const ipCounts = {};
    failedLogins.forEach(event => {
      ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1;
    });

    Object.entries(ipCounts).forEach(([ip, count]) => {
      if (count >= 10) {
        this.reportSecurityIncident({
          type: 'distributed_brute_force',
          severity: 'high',
          description: `High number of failed logins from IP: ${ip}`,
          ip: ip,
          count: count,
          timeWindow: '1h'
        });
      }
    });
  }

  anomalousAccessPatterns(events) {
    const accessEvents = events.filter(e => e.category === 'data_access');

    // Check for unusual access patterns
    const userAccessCounts = {};
    accessEvents.forEach(event => {
      const key = event.user;
      userAccessCounts[key] = (userAccessCounts[key] || 0) + 1;
    });

    const avgAccess = Object.values(userAccessCounts).reduce((a, b) => a + b, 0) / Object.keys(userAccessCounts).length;
    const threshold = avgAccess * 3; // 3x average access

    Object.entries(userAccessCounts).forEach(([user, count]) => {
      if (count > threshold) {
        this.reportSecurityIncident({
          type: 'unusual_access_pattern',
          severity: 'medium',
          description: `Unusual access pattern detected for user: ${user}`,
          user: user,
          accessCount: count,
          threshold: threshold
        });
      }
    });
  }

  anomalousTimePatterns(events) {
    // Check for off-hours access
    const offHoursEvents = events.filter(event => {
      const hour = new Date(event.timestamp).getHours();
      return hour < 6 || hour > 22; // 10 PM to 6 AM
    });

    if (offHoursEvents.length > 20) {
      this.reportSecurityIncident({
        type: 'off_hours_activity',
        severity: 'medium',
        description: 'High volume of off-hours activity detected',
        count: offHoursEvents.length,
        timeWindow: '1h'
      });
    }
  }

  // API Handlers
  handleAuditLogs(req, res, url) {
    const searchParams = url.searchParams;
    const limit = parseInt(searchParams.get('limit')) || 100;
    const severity = searchParams.get('severity');
    const category = searchParams.get('category');
    const user = searchParams.get('user');

    let filteredEvents = [...this.auditEvents];

    if (severity) {
      filteredEvents = filteredEvents.filter(event => event.severity === severity);
    }

    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }

    if (user) {
      filteredEvents = filteredEvents.filter(event => event.user === user);
    }

    const paginatedEvents = filteredEvents.slice(0, limit);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      events: paginatedEvents,
      total: filteredEvents.length,
      limit
    }, null, 2));
  }

  handleComplianceReports(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      reports: this.complianceReports.slice(0, 10),
      latest: this.complianceReports[0] || null,
      standards: this.config.complianceStandards
    }, null, 2));
  }

  handleSecurityIncidents(req, res) {
    const searchParams = req.url ? new URL(req.url, `http://localhost:${this.config.port}`).searchParams : new URLSearchParams();
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');

    let filteredIncidents = [...this.securityIncidents];

    if (severity) {
      filteredIncidents = filteredIncidents.filter(incident => incident.severity === severity);
    }

    if (status) {
      filteredIncidents = filteredIncidents.filter(incident => incident.status === status);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      incidents: filteredIncidents,
      total: filteredIncidents.length
    }, null, 2));
  }

  handleHealthCheck(req, res) {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      events: this.auditEvents.length,
      incidents: this.securityIncidents.length,
      compliance: this.config.enableCompliance,
      standards: this.config.complianceStandards
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health, null, 2));
  }

  handleAuditSummary(req, res) {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const recentEvents = this.auditEvents.filter(event =>
      new Date(event.timestamp).getTime() > oneDayAgo
    );

    const summary = {
      period: '24h',
      timestamp: new Date().toISOString(),
      totalEvents: recentEvents.length,
      eventsByCategory: {},
      eventsBySeverity: {},
      topUsers: [],
      topResources: [],
      incidents: this.securityIncidents.filter(i => new Date(i.timestamp).getTime() > oneDayAgo),
      compliance: this.complianceReports[0] || null
    };

    // Calculate statistics
    recentEvents.forEach(event => {
      summary.eventsByCategory[event.category] = (summary.eventsByCategory[event.category] || 0) + 1;
      summary.eventsBySeverity[event.severity] = (summary.eventsBySeverity[event.severity] || 0) + 1;
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(summary, null, 2));
  }

  startLogRotation() {
    // Rotate logs daily
    setInterval(() => {
      this.rotateLogs();
    }, 24 * 60 * 60 * 1000);

    // Initial rotation check
    this.rotateLogs();
  }

  rotateLogs() {
    const files = fs.readdirSync(this.logDirectory);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.logRetention);

    files.forEach(file => {
      const filePath = path.join(this.logDirectory, file);
      const stats = fs.statSync(filePath);

      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        console.log(`🗄️ Rotated old audit log: ${file}`);
      }
    });
  }

  extractUserFromRequest(req) {
    // Extract user from request headers or token
    return req.headers['x-user'] || req.headers['authorization']?.split(' ')[0] || 'anonymous';
  }

  generateEventId() {
    return crypto.randomBytes(16).toString('hex');
  }
}

// Start audit logger if this is the main module
if (require.main === module) {
  const auditLogger = new AuditLogger();
  auditLogger.start();

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}, shutting down Audit Logger gracefully...`);
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = AuditLogger;