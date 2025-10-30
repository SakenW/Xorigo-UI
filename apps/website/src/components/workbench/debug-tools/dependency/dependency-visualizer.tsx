/**
 * 依赖关系可视化器
 * 提供组件依赖关系图、模块分析、循环依赖检测等功能
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  AlertTriangle,
  Package,
  Network,
  Search,
  RefreshCw,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { globalDependencyAnalyzer } from '../core/debug-engine';
import { DependencyGraph, DependencyNode, DependencyEdge } from '../types/debug';

interface DependencyVisualizerProps {
  className?: string;
}

// 简化的节点组件
const DependencyNodeComponent: React.FC<{
  node: DependencyNode;
  selected: boolean;
  onClick: () => void;
  x: number;
  y: number;
}> = ({ node, selected, onClick, x, y }) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'component': return 'bg-blue-500';
      case 'hook': return 'bg-green-500';
      case 'util': return 'bg-purple-500';
      case 'type': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute cursor-pointer transition-all duration-200 ${selected ? 'z-20' : 'z-10'}`}
      style={{ left: x - 40, top: y - 20, width: 80, height: 40 }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`w-full h-full ${getNodeColor(node.type)} rounded-lg flex items-center justify-center text-white text-xs font-medium shadow-lg ${
        selected ? 'ring-2 ring-blue-300 ring-offset-2' : ''
      }`}>
        <span className="truncate px-1">{node.label}</span>
      </div>
    </motion.div>
  );
};

// SVG 连接线组件
const DependencyEdgeComponent: React.FC<{
  edge: DependencyEdge;
  nodes: DependencyNode[];
  nodePositions: Map<string, { x: number; y: number }>;
}> = ({ edge, nodes, nodePositions }) => {
  const sourcePos = nodePositions.get(edge.source);
  const targetPos = nodePositions.get(edge.target);

  if (!sourcePos || !targetPos) return null;

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'imports': return '#3B82F6'; // blue
      case 'composition': return '#10B981'; // green
      case 'inheritance': return '#F59E0B'; // yellow
      case 'props': return '#8B5CF6'; // purple
      default: return '#6B7280'; // gray
    }
  };

  return (
    <g>
      <defs>
        <marker
          id={`arrow-${edge.source}-${edge.target}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="3"
          orient="auto"
          markerWidth="6"
          markerHeight="6"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill={getEdgeColor(edge.type)}
          />
        </marker>
      </defs>
      <line
        x1={sourcePos.x}
        y1={sourcePos.y}
        x2={targetPos.x}
        y2={targetPos.y}
        stroke={getEdgeColor(edge.type)}
        strokeWidth={edge.weight}
        markerEnd={`url(#arrow-${edge.source}-${edge.target})`}
        opacity={0.6}
      />
    </g>
  );
};

export const DependencyVisualizer: React.FC<DependencyVisualizerProps> = ({
  className = ''
}) => {
  const [dependencyGraph, setDependencyGraph] = useState<DependencyGraph>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [circularDependencies, setCircularDependencies] = useState<string[][]>([]);
  const [viewMode, setViewMode] = useState<'graph' | 'tree' | 'list'>('graph');
  const svgRef = useRef<SVGSVGElement>(null);

  // 生成模拟数据
  const generateMockData = useCallback(() => {
    const mockNodes: DependencyNode[] = [
      { id: 'App', label: 'App', type: 'component', metadata: {} },
      { id: 'Header', label: 'Header', type: 'component', metadata: {} },
      { id: 'Footer', label: 'Footer', type: 'component', metadata: {} },
      { id: 'MainContent', label: 'MainContent', type: 'component', metadata: {} },
      { id: 'Sidebar', label: 'Sidebar', type: 'component', metadata: {} },
      { id: 'Button', label: 'Button', type: 'component', metadata: {} },
      { id: 'Input', label: 'Input', type: 'component', metadata: {} },
      { id: 'useTheme', label: 'useTheme', type: 'hook', metadata: {} },
      { id: 'utils', label: 'utils', type: 'util', metadata: {} },
      { id: 'types', label: 'types', type: 'type', metadata: {} }
    ];

    const mockEdges: DependencyEdge[] = [
      { source: 'App', target: 'Header', type: 'composition', weight: 2 },
      { source: 'App', target: 'MainContent', type: 'composition', weight: 2 },
      { source: 'App', target: 'Footer', type: 'composition', weight: 2 },
      { source: 'MainContent', target: 'Sidebar', type: 'composition', weight: 1 },
      { source: 'Header', target: 'Button', type: 'composition', weight: 1 },
      { source: 'Footer', target: 'Button', type: 'composition', weight: 1 },
      { source: 'Sidebar', target: 'Input', type: 'composition', weight: 1 },
      { source: 'Button', target: 'useTheme', type: 'imports', weight: 1 },
      { source: 'Input', target: 'useTheme', type: 'imports', weight: 1 },
      { source: 'useTheme', target: 'types', type: 'imports', weight: 1 },
      { source: 'utils', target: 'types', type: 'imports', weight: 1 }
    ];

    return { nodes: mockNodes, edges: mockEdges };
  }, []);

  // 初始化数据
  useEffect(() => {
    const mockData = generateMockData();
    setDependencyGraph(mockData);
    setCircularDependencies(globalDependencyAnalyzer.detectCircularDependencies());
  }, [generateMockData]);

  // 计算节点位置（简单的力导向布局）
  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    const centerX = 400;
    const centerY = 300;
    const radius = 150;

    dependencyGraph.nodes.forEach((node, index) => {
      const angle = (index / dependencyGraph.nodes.length) * Math.PI * 2;
      positions.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    });

    return positions;
  }, [dependencyGraph]);

  // 过滤节点和边
  const filteredGraph = useMemo(() => {
    if (!searchQuery) return dependencyGraph;

    const filteredNodes = dependencyGraph.nodes.filter(node =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = dependencyGraph.edges.filter(edge =>
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [dependencyGraph, searchQuery]);

  // 获取节点统计
  const nodeStats = useMemo(() => {
    const stats = {
      total: dependencyGraph.nodes.length,
      byType: {} as Record<string, number>,
      connections: 0
    };

    dependencyGraph.nodes.forEach(node => {
      stats.byType[node.type] = (stats.byType[node.type] || 0) + 1;
    });

    stats.connections = dependencyGraph.edges.length;

    return stats;
  }, [dependencyGraph]);

  // 获取依赖树
  const getDependencyTree = (rootId: string) => {
    return globalDependencyAnalyzer.getDependencyTree(rootId);
  };

  // 处理SVG拖拽
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleSvgMouseUp = () => {
    setIsDragging(false);
  };

  // 缩放控制
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // 渲染统计卡片
  const renderStatsCard = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        依赖统计
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {nodeStats.total}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">总模块数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {nodeStats.connections}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">连接数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {circularDependencies.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">循环依赖</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Object.keys(nodeStats.byType).length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">模块类型</div>
        </div>
      </div>
    </motion.div>
  );

  // 渲染图形视图
  const renderGraphView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          依赖关系图
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="relative h-96 overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full cursor-move"
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onMouseLeave={handleSvgMouseUp}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 渲染边 */}
            {filteredGraph.edges.map((edge, index) => (
              <DependencyEdgeComponent
                key={index}
                edge={edge}
                nodes={dependencyGraph.nodes}
                nodePositions={nodePositions}
              />
            ))}

            {/* 渲染节点 */}
            {filteredGraph.nodes.map((node) => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;
              return (
                <DependencyNodeComponent
                  key={node.id}
                  node={node}
                  selected={selectedNode?.id === node.id}
                  onClick={() => setSelectedNode(node)}
                  x={pos.x}
                  y={pos.y}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </motion.div>
  );

  // 渲染列表视图
  const renderListView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          模块列表
        </h4>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredGraph.nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                selectedNode?.id === node.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => setSelectedNode(node)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    node.type === 'component' ? 'bg-blue-500' :
                    node.type === 'hook' ? 'bg-green-500' :
                    node.type === 'util' ? 'bg-purple-500' :
                    node.type === 'type' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {node.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {node.type}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {dependencyGraph.edges.filter(e => e.source === node.id).length} 输出
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {dependencyGraph.edges.filter(e => e.target === node.id).length} 输入
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // 渲染循环依赖警告
  const renderCircularDependencies = () => {
    if (circularDependencies.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800"
      >
        <h4 className="text-sm font-medium text-red-800 dark:text-red-200 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4" />
          检测到循环依赖
        </h4>
        <div className="space-y-2">
          {circularDependencies.map((cycle, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
              {cycle.map((node, nodeIndex) => (
                <React.Fragment key={node}>
                  <span className="font-medium">{node}</span>
                  {nodeIndex < cycle.length - 1 && (
                    <ArrowRight className="w-3 h-3" />
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染选中节点的详细信息
  const renderNodeDetails = () => {
    if (!selectedNode) return null;

    const incomingEdges = dependencyGraph.edges.filter(e => e.target === selectedNode.id);
    const outgoingEdges = dependencyGraph.edges.filter(e => e.source === selectedNode.id);
    const dependencyTree = getDependencyTree(selectedNode.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            模块详情
          </h3>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">模块名称</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {selectedNode.label}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">模块类型</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {selectedNode.type}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">依赖模块</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {incomingEdges.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">被依赖模块</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {outgoingEdges.length}
              </div>
            </div>
          </div>

          {incomingEdges.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">输入依赖</div>
              <div className="space-y-1">
                {incomingEdges.map((edge, index) => (
                  <div key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                      {edge.type}
                    </span>
                    {edge.source}
                  </div>
                ))}
              </div>
            </div>
          )}

          {outgoingEdges.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">输出依赖</div>
              <div className="space-y-1">
                {outgoingEdges.map((edge, index) => (
                  <div key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                      {edge.type}
                    </span>
                    {edge.target}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 控制栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-500" />
          依赖关系可视化
        </h2>

        <div className="flex items-center gap-2">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索模块..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 视图切换 */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'graph'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Network className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              const mockData = generateMockData();
              setDependencyGraph(mockData);
              setCircularDependencies(globalDependencyAnalyzer.detectCircularDependencies());
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            刷新数据
          </button>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      {renderStatsCard()}

      {/* 循环依赖警告 */}
      {renderCircularDependencies()}

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 视图区域 */}
        <div className="lg:col-span-2">
          {viewMode === 'graph' ? renderGraphView() : renderListView()}
        </div>

        {/* 侧边栏 - 节点详情 */}
        <div>
          {renderNodeDetails()}
        </div>
      </div>
    </div>
  );
};