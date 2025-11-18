// 网站审查结果可视化生成器
const fs = require('fs');

// 读取审查报告数据
const auditData = JSON.parse(fs.readFileSync('/home/saken/project/Xorigo-UI/dingjipower-audit-report.json', 'utf8'));

function generateASCIICharts() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    洛阳鼎基电力技术有限公司网站审查结果             ║
╚══════════════════════════════════════════════════════════════╝

📊 性能指标
═══════════════════════════════════════════════════════════════
页面加载时间: ${auditData.performance.loadTime}ms ${auditData.performance.loadTime < 1000 ? '✅ 良好' : '⚠️ 需优化'}
页面大小: ${(auditData.performance.totalSize / 1024).toFixed(2)} KB
资源数量: ${auditData.performance.resourceCount}个

${generateBarChart('资源分布', [
  { name: 'CSS', value: auditData.resources.filter(r => r.type === 'css').length, color: '🔵' },
  { name: 'JavaScript', value: auditData.resources.filter(r => r.type === 'javascript').length, color: '🟡' },
  { name: '图片', value: auditData.resources.filter(r => r.type === 'image').length, color: '🟢' }
])}

🏗️ 页面结构分析
═══════════════════════════════════════════════════════════════
${generateStructureChart(auditData.structure)}

🔍 SEO评分
═══════════════════════════════════════════════════════════════
${generateSEOChart(auditData.seo)}

🔒 安全性检查
═══════════════════════════════════════════════════════════════
HTTPS启用: ${auditData.security.https ? '✅ 是' : '❌ 否'}
混合内容: ${auditData.security.mixedContent ? '❌ 存在' : '✅ 无'}
表单安全: ${auditData.security.formsSecure ? '✅ 安全' : '⚠️ 需改进'}

📱 响应式设计
═══════════════════════════════════════════════════════════════
视口配置: ${auditData.basicInfo.viewport ? '✅ 已配置' : '❌ 未配置'}
移动端适配: ${auditData.basicInfo.viewport ? '✅ 支持' : '❌ 不支持'}

💡 改进建议优先级
═══════════════════════════════════════════════════════════════
${generateRecommendationsChart(auditData.recommendations)}

🌐 技术栈信息
═══════════════════════════════════════════════════════════════
CMS: ${auditData.basicInfo.technology.cms}
框架: ${auditData.basicInfo.technology.framework.join(', ') || '无'}
库: ${auditData.basicInfo.technology.libraries.join(', ') || '无'}
服务器: ${auditData.basicInfo.server}
字符编码: ${auditData.basicInfo.charset}
`);
}

function generateBarChart(title, data) {
  let chart = `\n${title}:\n`;
  const maxValue = Math.max(...data.map(d => d.value));

  data.forEach(item => {
    const barLength = Math.round((item.value / maxValue) * 20);
    const bar = item.color.repeat(barLength) + '░'.repeat(20 - barLength);
    chart += `${item.name.padEnd(12)} ${bar} ${item.value}\n`;
  });

  return chart;
}

function generateStructureChart(structure) {
  return `
HTML5语义标签:
${generateBarChart('', [
  { name: 'header', value: structure.html5Semantic.header, color: '✅' },
  { name: 'nav', value: structure.html5Semantic.nav, color: '✅' },
  { name: 'main', value: structure.html5Semantic.main, color: structure.html5Semantic.main > 0 ? '✅' : '❌' },
  { name: 'section', value: structure.html5Semantic.section, color: structure.html5Semantic.section > 0 ? '✅' : '❌' },
  { name: 'footer', value: structure.html5Semantic.footer, color: '✅' }
])}

内容统计:
├── 图片: ${structure.images.total} (${structure.images.withoutAlt}个缺少alt)
├── 链接: ${structure.links.total} (${structure.links.internal}内部/${structure.links.external}外部)
├── 表单: ${structure.forms}
├── 脚本: ${structure.scripts}
└── 样式表: ${structure.stylesheets}

标题层级:
${generateBarChart('', [
  { name: 'H1', value: structure.headings.h1, color: structure.headings.h1 === 1 ? '✅' : '❌' },
  { name: 'H2', value: structure.headings.h2, color: '✅' },
  { name: 'H3', value: structure.headings.h3, color: '✅' },
  { name: 'H4', value: structure.headings.h4, color: '✅' }
])}
`;
}

function generateSEOChart(seo) {
  const titleStatus = seo.title.length >= 30 && seo.title.length <= 60 ? '✅' : seo.title.length > 60 ? '⚠️' : '❌';
  const descStatus = seo.metaDescription.length >= 120 && seo.metaDescription.length <= 160 ? '✅' : seo.metaDescription.length > 160 ? '⚠️' : '❌';

  return `
页面标题: ${titleStatus} ${seo.title.present ? '存在' : '缺失'} (${seo.title.length}字符)
Meta描述: ${descStatus} ${seo.metaDescription.present ? '存在' : '缺失'} (${seo.metaDescription.length}字符)
H1标签: ${seo.headings.hasH1 ? '✅' : '❌'} (${seo.headings.h1Count}个)
语言声明: ${seo.language !== 'Not declared' ? '✅' : '❌'} (${seo.language})
规范链接: ${seo.canonical ? '✅' : '❌'}
Open Graph: ${seo.openGraph.title ? '✅' : '❌'}
Twitter Card: ${seo.twitterCard.card ? '✅' : '❌'}
结构化数据: ${seo.structuredData ? '✅' : '❌'}
`;
}

function generateRecommendationsChart(recommendations) {
  const highPriority = recommendations.filter(r => r.priority === 'High').length;
  const mediumPriority = recommendations.filter(r => r.priority === 'Medium').length;
  const lowPriority = recommendations.filter(r => r.priority === 'Low').length;

  let chart = `\n优先级分布:\n`;
  chart += `🔴 高优先级: ${highPriority}项\n`;
  chart += `🟡 中优先级: ${mediumPriority}项\n`;
  chart += `🟢 低优先级: ${lowPriority}项\n\n`;

  chart += `具体建议:\n`;
  recommendations.forEach((rec, index) => {
    const icon = rec.priority === 'High' ? '🔴' : rec.priority === 'Medium' ? '🟡' : '🟢';
    chart += `${icon} ${index + 1}. [${rec.category}] ${rec.issue}\n`;
  });

  return chart;
}

// 执行生成可视化
console.log('正在生成网站审查结果可视化图表...\n');
generateASCIICharts();

// 保存到文件
const output = `
网站审查结果可视化报告
========================

生成时间: ${new Date().toISOString()}

${generateASCIICharts.toString()}
`;

fs.writeFileSync('/home/saken/project/Xorigo-UI/audit-visualization.txt', output);
console.log('\n可视化报告已保存到: /home/saken/project/Xorigo-UI/audit-visualization.txt');