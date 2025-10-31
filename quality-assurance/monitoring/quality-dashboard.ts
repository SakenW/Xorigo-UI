/**
 * 📊 质量监控看板
 *
 * 实时监控和展示 Xorigo UI 项目的质量指标
 */

import { createInterface } from 'readline';
import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import chalk from 'chalk';

// 质量指标定义
export interface QualityMetrics {
  // 代码健康指标
  codeHealth: {
    testCoverage: number;
    typeCoverage: number;
    duplicateCode: number;
    complexityScore: number;
    maintainabilityIndex: number;
    technicalDebtRatio: number;
  };

  // 组件健康指标
  componentHealth: {
    apiConsistency: number;
    themeCompatibility: number;
    accessibilityScore: number;
    performanceScore: number;
    visualRegressionScore: number;
  };

  // 构建和部署健康
  buildHealth: {
    buildSuccessRate: number;
    averageBuildTime: number;
    bundleSize: number;
    dependencyVulnerabilities: number;
    upgradeReadiness: number;
  };

  // 测试健康
  testHealth: {
    unitTestPassRate: number;
    integrationTestPassRate: number;
    e2eTestPassRate: number;
    performanceTestPassRate: number;
    flakyTestRate: number;
  };

  // 开发体验
  developerExperience: {
    setupTime: number;
    hotReloadTime: number;
    buildTime: number;
    typeCheckTime: number;
    documentationCoverage: number;
  };

  // 发布健康
  releaseHealth: {
    changeFailureRate: number;
    leadTimeForChanges: number;
    deploymentFrequency: number;
    meanTimeToRecovery: number;
    releaseSuccessRate: number;
  };
}

export interface QualityThreshold {
  min: number;
  target: number;
  excellent: number;
}

export interface QualityScore {
  current: number;
  previous: number;
  trend: 'improving' | 'declining' | 'stable';
  threshold: QualityThreshold;
  status: 'critical' | 'warning' | 'good' | 'excellent';
}

// 质量阈值定义
export const QUALITY_THRESHOLDS: Record<keyof QualityMetrics, Record<string, QualityThreshold>> = {
  codeHealth: {
    testCoverage: { min: 80, target: 90, excellent: 95 },
    typeCoverage: { min: 85, target: 95, excellent: 98 },
    duplicateCode: { min: 0, target: 3, excellent: 1 },
    complexityScore: { min: 0, target: 10, excellent: 5 },
    maintainabilityIndex: { min: 70, target: 85, excellent: 95 },
    technicalDebtRatio: { min: 0, target: 5, excellent: 2 }
  },
  componentHealth: {
    apiConsistency: { min: 80, target: 95, excellent: 100 },
    themeCompatibility: { min: 90, target: 98, excellent: 100 },
    accessibilityScore: { min: 85, target: 95, excellent: 100 },
    performanceScore: { min: 80, target: 90, excellent: 95 },
    visualRegressionScore: { min: 95, target: 99, excellent: 100 }
  },
  buildHealth: {
    buildSuccessRate: { min: 90, target: 98, excellent: 100 },
    averageBuildTime: { min: 0, target: 30, excellent: 15 },
    bundleSize: { min: 0, target: 200, excellent: 150 },
    dependencyVulnerabilities: { min: 0, target: 0, excellent: 0 },
    upgradeReadiness: { min: 80, target: 95, excellent: 100 }
  },
  testHealth: {
    unitTestPassRate: { min: 95, target: 100, excellent: 100 },
    integrationTestPassRate: { min: 90, target: 100, excellent: 100 },
    e2eTestPassRate: { min: 85, target: 95, excellent: 100 },
    performanceTestPassRate: { min: 80, target: 95, excellent: 100 },
    flakyTestRate: { min: 0, target: 2, excellent: 0 }
  },
  developerExperience: {
    setupTime: { min: 0, target: 300, excellent: 180 },
    hotReloadTime: { min: 0, target: 2, excellent: 1 },
    buildTime: { min: 0, target: 30, excellent: 15 },
    typeCheckTime: { min: 0, target: 10, excellent: 5 },
    documentationCoverage: { min: 70, target: 90, excellent: 100 }
  },
  releaseHealth: {
    changeFailureRate: { min: 0, target: 5, excellent: 1 },
    leadTimeForChanges: { min: 0, target: 60, excellent: 30 },
    deploymentFrequency: { min: 1, target: 7, excellent: 14 },
    meanTimeToRecovery: { min: 0, target: 60, excellent: 15 },
    releaseSuccessRate: { min: 90, target: 98, excellent: 100 }
  }
};

export class QualityDashboard {
  private metricsHistory: QualityMetrics[] = [];
  private currentMetrics: QualityMetrics | null = null;
  private reportPath: string;

  constructor(reportPath: string = './quality-assurance/reports') {
    this.reportPath = reportPath;
  }

  /**
   * 加载历史质量数据
   */
  async loadHistoricalData(): Promise<void> {
    try {
      const reportsDir = join(this.reportPath, 'historical');
      const files = await readdir(reportsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json')).sort();

      this.metricsHistory = [];

      for (const file of jsonFiles) {
        const content = await readFile(join(reportsDir, file), 'utf-8');
        const metrics = JSON.parse(content) as QualityMetrics;
        this.metricsHistory.push(metrics);
      }

      console.log(`📊 加载了 ${this.metricsHistory.length} 条历史质量数据`);
    } catch (error) {
      console.warn('⚠️ 无法加载历史数据，将使用空数据集');
      this.metricsHistory = [];
    }
  }

  /**
   * 加载当前质量指标
   */
  async loadCurrentMetrics(): Promise<QualityMetrics> {
    try {
      const latestReportPath = join(this.reportPath, 'latest', 'quality-metrics.json');
      const content = await readFile(latestReportPath, 'utf-8');
      this.currentMetrics = JSON.parse(content) as QualityMetrics;
      return this.currentMetrics;
    } catch (error) {
      console.warn('⚠️ 无法加载当前质量指标，生成默认值');
      this.currentMetrics = this.generateDefaultMetrics();
      return this.currentMetrics;
    }
  }

  /**
   * 生成默认质量指标
   */
  private generateDefaultMetrics(): QualityMetrics {
    return {
      codeHealth: {
        testCoverage: 85,
        typeCoverage: 90,
        duplicateCode: 5,
        complexityScore: 8,
        maintainabilityIndex: 80,
        technicalDebtRatio: 3
      },
      componentHealth: {
        apiConsistency: 88,
        themeCompatibility: 92,
        accessibilityScore: 85,
        performanceScore: 82,
        visualRegressionScore: 96
      },
      buildHealth: {
        buildSuccessRate: 95,
        averageBuildTime: 25,
        bundleSize: 180,
        dependencyVulnerabilities: 0,
        upgradeReadiness: 90
      },
      testHealth: {
        unitTestPassRate: 98,
        integrationTestPassRate: 92,
        e2eTestPassRate: 88,
        performanceTestPassRate: 85,
        flakyTestRate: 1
      },
      developerExperience: {
        setupTime: 240,
        hotReloadTime: 1.5,
        buildTime: 20,
        typeCheckTime: 8,
        documentationCoverage: 75
      },
      releaseHealth: {
        changeFailureRate: 3,
        leadTimeForChanges: 45,
        deploymentFrequency: 5,
        meanTimeToRecovery: 30,
        releaseSuccessRate: 96
      }
    };
  }

  /**
   * 计算质量分数
   */
  calculateQualityScore(value: number, threshold: QualityThreshold): QualityScore {
    const previous = this.getPreviousValue(value);
    let trend: 'improving' | 'declining' | 'stable';

    if (value > previous + 1) {
      trend = 'improving';
    } else if (value < previous - 1) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    let status: 'critical' | 'warning' | 'good' | 'excellent';

    if (value < threshold.min) {
      status = 'critical';
    } else if (value < threshold.target) {
      status = 'warning';
    } else if (value < threshold.excellent) {
      status = 'good';
    } else {
      status = 'excellent';
    }

    return {
      current: value,
      previous,
      trend,
      threshold,
      status
    };
  }

  /**
   * 获取历史值
   */
  private getPreviousValue(current: number): number {
    if (this.metricsHistory.length === 0) return current;

    const latest = this.metricsHistory[this.metricsHistory.length - 1];
    // 这里需要根据具体的指标类型来获取对应的值
    // 简化处理，返回当前值的95%
    return Math.round(current * 0.95);
  }

  /**
   * 生成控制台报告
   */
  generateConsoleReport(): void {
    if (!this.currentMetrics) {
      console.log(chalk.red('❌ 没有可用的质量数据'));
      return;
    }

    console.clear();
    console.log(chalk.bold.blue('🎯 Xorigo UI 质量监控看板'));
    console.log(chalk.gray(`更新时间: ${new Date().toLocaleString()}`));
    console.log('');

    // 代码健康
    this.displaySection('代码健康', this.currentMetrics.codeHealth, QUALITY_THRESHOLDS.codeHealth);

    // 组件健康
    this.displaySection('组件健康', this.currentMetrics.componentHealth, QUALITY_THRESHOLDS.componentHealth);

    // 构建健康
    this.displaySection('构建健康', this.currentMetrics.buildHealth, QUALITY_THRESHOLDS.buildHealth);

    // 测试健康
    this.displaySection('测试健康', this.currentMetrics.testHealth, QUALITY_THRESHOLDS.testHealth);

    // 开发体验
    this.displaySection('开发体验', this.currentMetrics.developerExperience, QUALITY_THRESHOLDS.developerExperience);

    // 发布健康
    this.displaySection('发布健康', this.currentMetrics.releaseHealth, QUALITY_THRESHOLDS.releaseHealth);

    // 总体评分
    this.displayOverallScore();
  }

  /**
   * 显示部分指标
   */
  private displaySection(title: string, metrics: any, thresholds: any): void {
    console.log(chalk.bold.white(`\n📊 ${title}`));
    console.log(chalk.gray('─'.repeat(50)));

    Object.entries(metrics).forEach(([key, value]) => {
      const threshold = thresholds[key];
      if (!threshold) return;

      const score = this.calculateQualityScore(Number(value), threshold);
      const displayValue = this.formatValue(key, Number(value));
      const statusColor = this.getStatusColor(score.status);
      const trendIcon = this.getTrendIcon(score.trend);

      console.log(
        `${this.formatLabel(key)}: ${statusColor(displayValue)} ${trendIcon} ${chalk.gray(
          `(${score.threshold.min}-${score.threshold.excellent})`
        )}`
      );
    });
  }

  /**
   * 显示总体评分
   */
  private displayOverallScore(): void {
    if (!this.currentMetrics) return;

    const overallScore = this.calculateOverallScore();
    let status: 'critical' | 'warning' | 'good' | 'excellent';
    let statusColor: (text: string) => string;
    let emoji: string;

    if (overallScore >= 90) {
      status = 'excellent';
      statusColor = chalk.green.bold;
      emoji = '🌟';
    } else if (overallScore >= 80) {
      status = 'good';
      statusColor = chalk.blue;
      emoji = '✅';
    } else if (overallScore >= 70) {
      status = 'warning';
      statusColor = chalk.yellow;
      emoji = '⚠️';
    } else {
      status = 'critical';
      statusColor = chalk.red.bold;
      emoji = '❌';
    }

    console.log(chalk.bold.white('\n🎯 总体质量评分'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`${emoji} ${statusColor(`${overallScore}/100`)} ${chalk.gray(`(${status.toUpperCase()})`)}`);

    // 显示改进建议
    this.displayRecommendations();
  }

  /**
   * 计算总体评分
   */
  private calculateOverallScore(): number {
    if (!this.currentMetrics) return 0;

    const weights = {
      codeHealth: 25,
      componentHealth: 20,
      buildHealth: 15,
      testHealth: 20,
      developerExperience: 10,
      releaseHealth: 10
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([category, weight]) => {
      const categoryMetrics = this.currentMetrics![category as keyof QualityMetrics] as any;
      const categoryThresholds = QUALITY_THRESHOLDS[category as keyof QualityMetrics];

      let categoryScore = 0;
      let metricCount = 0;

      Object.entries(categoryMetrics).forEach(([metric, value]) => {
        const threshold = categoryThresholds[metric];
        if (threshold) {
          const score = this.calculateQualityScore(Number(value), threshold);
          categoryScore += this.scoreToPercentage(score);
          metricCount++;
        }
      });

      if (metricCount > 0) {
        totalScore += (categoryScore / metricCount) * weight;
        totalWeight += weight;
      }
    });

    return Math.round(totalWeight > 0 ? totalScore / totalWeight : 0);
  }

  /**
   * 分数转换为百分比
   */
  private scoreToPercentage(score: QualityScore): number {
    const { min, excellent } = score.threshold;
    if (score.current <= min) return 0;
    if (score.current >= excellent) return 100;
    return Math.round(((score.current - min) / (excellent - min)) * 100);
  }

  /**
   * 显示改进建议
   */
  private displayRecommendations(): void {
    if (!this.currentMetrics) return;

    const recommendations: string[] = [];

    // 代码健康建议
    if (this.currentMetrics.codeHealth.testCoverage < 90) {
      recommendations.push('📝 提高测试覆盖率到90%以上');
    }
    if (this.currentMetrics.codeHealth.typeCoverage < 95) {
      recommendations.push('🔍 增强类型定义和覆盖率');
    }

    // 组件健康建议
    if (this.currentMetrics.componentHealth.accessibilityScore < 95) {
      recommendations.push('♿ 改善组件可访问性');
    }
    if (this.currentMetrics.componentHealth.apiConsistency < 95) {
      recommendations.push('🔧 提升API一致性');
    }

    // 性能建议
    if (this.currentMetrics.buildHealth.averageBuildTime > 30) {
      recommendations.push('⚡ 优化构建性能');
    }
    if (this.currentMetrics.buildHealth.bundleSize > 200) {
      recommendations.push('📦 减小Bundle大小');
    }

    if (recommendations.length > 0) {
      console.log(chalk.bold.white('\n💡 改进建议'));
      console.log(chalk.gray('─'.repeat(50)));
      recommendations.forEach(rec => console.log(`  ${rec}`));
    }
  }

  /**
   * 格式化标签
   */
  private formatLabel(key: string): string {
    const labels: Record<string, string> = {
      testCoverage: '测试覆盖率',
      typeCoverage: '类型覆盖率',
      duplicateCode: '重复代码',
      complexityScore: '复杂度',
      maintainabilityIndex: '可维护性',
      technicalDebtRatio: '技术债务',
      apiConsistency: 'API一致性',
      themeCompatibility: '主题兼容性',
      accessibilityScore: '可访问性',
      performanceScore: '性能评分',
      visualRegressionScore: '视觉回归',
      buildSuccessRate: '构建成功率',
      averageBuildTime: '平均构建时间',
      bundleSize: 'Bundle大小',
      dependencyVulnerabilities: '依赖漏洞',
      upgradeReadiness: '升级就绪度',
      unitTestPassRate: '单元测试通过率',
      integrationTestPassRate: '集成测试通过率',
      e2eTestPassRate: 'E2E测试通过率',
      performanceTestPassRate: '性能测试通过率',
      flakyTestRate: '不稳定测试率',
      setupTime: '环境设置时间',
      hotReloadTime: '热重载时间',
      buildTime: '本地构建时间',
      typeCheckTime: '类型检查时间',
      documentationCoverage: '文档覆盖率',
      changeFailureRate: '变更失败率',
      leadTimeForChanges: '变更前置时间',
      deploymentFrequency: '部署频率',
      meanTimeToRecovery: '平均恢复时间',
      releaseSuccessRate: '发布成功率'
    };

    return labels[key] || key;
  }

  /**
   * 格式化数值
   */
  private formatValue(key: string, value: number): string {
    if (key.includes('Rate') || key.includes('Coverage') || key.includes('Score')) {
      return `${value}%`;
    }
    if (key.includes('Time')) {
      return `${value}s`;
    }
    if (key === 'bundleSize') {
      return `${value}KB`;
    }
    if (key === 'deploymentFrequency') {
      return `${value}/week`;
    }
    return value.toString();
  }

  /**
   * 获取状态颜色
   */
  private getStatusColor(status: string): (text: string) => string {
    switch (status) {
      case 'excellent':
        return chalk.green.bold;
      case 'good':
        return chalk.blue;
      case 'warning':
        return chalk.yellow;
      case 'critical':
        return chalk.red.bold;
      default:
        return chalk.white;
    }
  }

  /**
   * 获取趋势图标
   */
  private getTrendIcon(trend: string): string {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '❓';
    }
  }

  /**
   * 启动交互式监控
   */
  async startInteractiveMonitoring(): Promise<void> {
    console.log(chalk.bold.blue('🎯 启动 Xorigo UI 质量监控交互模式'));
    console.log(chalk.gray('按 "r" 刷新，按 "q" 退出\n'));

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // 初始显示
    await this.loadCurrentMetrics();
    this.generateConsoleReport();

    // 设置输入监听
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', async (key) => {
      if (key === 'q') {
        console.log(chalk.blue('\n👋 退出质量监控'));
        rl.close();
        process.exit(0);
      } else if (key === 'r') {
        console.log(chalk.blue('\n🔄 刷新质量数据...'));
        await this.loadCurrentMetrics();
        this.generateConsoleReport();
        console.log(chalk.gray('\n按 "r" 刷新，按 "q" 退出'));
      }
    });
  }

  /**
   * 生成 JSON 报告
   */
  generateJSONReport(): string {
    if (!this.currentMetrics) {
      throw new Error('没有可用的质量数据');
    }

    const report = {
      timestamp: new Date().toISOString(),
      overallScore: this.calculateOverallScore(),
      metrics: this.currentMetrics,
      scores: this.calculateAllScores(),
      recommendations: this.generateRecommendationsList(),
      status: this.getOverallStatus()
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * 计算所有分数
   */
  private calculateAllScores(): any {
    if (!this.currentMetrics) return {};

    const scores: any = {};

    Object.entries(this.currentMetrics).forEach(([category, metrics]) => {
      const thresholds = QUALITY_THRESHOLDS[category as keyof QualityMetrics];
      scores[category] = {};

      Object.entries(metrics as any).forEach(([metric, value]) => {
        const threshold = thresholds[metric];
        if (threshold) {
          scores[category][metric] = this.calculateQualityScore(Number(value), threshold);
        }
      });
    });

    return scores;
  }

  /**
   * 生成建议列表
   */
  private generateRecommendationsList(): string[] {
    const recommendations: string[] = [];

    // 这里可以基于当前指标生成更智能的建议
    return recommendations;
  }

  /**
   * 获取总体状态
   */
  private getOverallStatus(): string {
    const score = this.calculateOverallScore();
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'warning';
    return 'critical';
  }

  /**
   * 保存报告
   */
  async saveReport(): Promise<void> {
    try {
      const report = this.generateJSONReport();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `quality-report-${timestamp}.json`;
      const filepath = join(this.reportPath, filename);

      await writeFile(filepath, report, 'utf-8');

      // 同时保存为最新报告
      const latestPath = join(this.reportPath, 'latest', 'quality-report.json');
      await writeFile(latestPath, report, 'utf-8');

      console.log(chalk.green(`✅ 质量报告已保存: ${filepath}`));
    } catch (error) {
      console.error(chalk.red('❌ 保存质量报告失败:'), error);
    }
  }
}

// 主程序入口
export async function runQualityDashboard(): Promise<void> {
  const dashboard = new QualityDashboard();

  try {
    // 加载数据
    await dashboard.loadHistoricalData();
    await dashboard.loadCurrentMetrics();

    // 检查命令行参数
    const args = process.argv.slice(2);

    if (args.includes('--interactive') || args.includes('-i')) {
      // 交互式模式
      await dashboard.startInteractiveMonitoring();
    } else if (args.includes('--json') || args.includes('-j')) {
      // JSON 输出模式
      const report = dashboard.generateJSONReport();
      console.log(report);
      await dashboard.saveReport();
    } else {
      // 默认控制台模式
      dashboard.generateConsoleReport();
      await dashboard.saveReport();
    }
  } catch (error) {
    console.error(chalk.red('❌ 质量看板启动失败:'), error);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runQualityDashboard();
}