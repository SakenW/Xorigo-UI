#!/usr/bin/env node

/**
 * 开发服务器管理器
 * 解决多个开发服务器进程同时运行的问题
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DevServerManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.pidFile = path.join(this.projectRoot, '.dev-server.pid');
    this.lockFile = path.join(this.projectRoot, '.dev-server.lock');
    this.port = 3100; // 默认端口
  }

  /**
   * 检查端口是否被占用
   */
  isPortInUse(port) {
    try {
      const result = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
      return result.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * 查找所有相关的开发服务器进程
   */
  findDevServerProcesses() {
    try {
      const result = execSync('ps aux | grep -E "(next|pnpm).*dev" | grep -v grep', { encoding: 'utf8' });
      return result.trim().split('\n').filter(line => line.trim()).map(line => {
        const parts = line.trim().split(/\s+/);
        return {
          pid: parseInt(parts[1]),
          command: parts.slice(10).join(' '),
          user: parts[0]
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * 清理所有开发服务器进程
   */
  cleanupDevServers() {
    console.log('🧹 正在清理开发服务器进程...');

    const processes = this.findDevServerProcesses();
    let cleanedCount = 0;

    processes.forEach(process => {
      try {
        // 先尝试优雅终止
        process.kill(process.pid, 'SIGTERM');
        console.log(`✓ 优雅终止进程 ${process.pid}: ${process.command.substring(0, 50)}...`);
        cleanedCount++;
      } catch (error) {
        try {
          // 如果优雅终止失败，强制终止
          process.kill(process.pid, 'SIGKILL');
          console.log(`✓ 强制终止进程 ${process.pid}`);
          cleanedCount++;
        } catch (killError) {
          console.log(`⚠️ 无法终止进程 ${process.pid}: ${killError.message}`);
        }
      }
    });

    // 等待进程完全退出
    setTimeout(() => {
      console.log(`🎉 清理完成，共处理 ${cleanedCount} 个进程`);
    }, 2000);

    return cleanedCount;
  }

  /**
   * 创建锁文件
   */
  createLock() {
    if (fs.existsSync(this.lockFile)) {
      const lockContent = fs.readFileSync(this.lockFile, 'utf8');
      const lockData = JSON.parse(lockContent);

      // 检查锁文件是否过期（超过10分钟）
      if (Date.now() - lockData.timestamp > 10 * 60 * 1000) {
        console.log('⚠️ 发现过期的锁文件，正在清理...');
        this.removeLock();
      } else {
        console.log('❌ 开发服务器已在运行中');
        console.log(`📍 进程ID: ${lockData.pid}`);
        console.log(`🕐 启动时间: ${new Date(lockData.timestamp).toLocaleString()}`);
        return false;
      }
    }

    const lockData = {
      pid: process.pid,
      timestamp: Date.now(),
      port: this.port
    };

    fs.writeFileSync(this.lockFile, JSON.stringify(lockData, null, 2));
    return true;
  }

  /**
   * 移除锁文件
   */
  removeLock() {
    try {
      if (fs.existsSync(this.lockFile)) {
        fs.unlinkSync(this.lockFile);
      }
      if (fs.existsSync(this.pidFile)) {
        fs.unlinkSync(this.pidFile);
      }
    } catch (error) {
      console.log(`⚠️ 清理锁文件失败: ${error.message}`);
    }
  }

  /**
   * 启动开发服务器
   */
  startDevServer(options = {}) {
    console.log('🚀 启动开发服务器...');

    // 检查并清理现有进程
    const processes = this.findDevServerProcesses();
    if (processes.length > 0) {
      console.log(`⚠️ 发现 ${processes.length} 个运行中的开发服务器进程`);
      this.cleanupDevServers();

      // 等待清理完成
      setTimeout(() => {
        this._startServer(options);
      }, 3000);
    } else {
      this._startServer(options);
    }
  }

  /**
   * 内部启动服务器方法
   */
  _startServer(options) {
    // 创建锁文件
    if (!this.createLock()) {
      return;
    }

    // 设置环境变量
    const env = {
      ...process.env,
      PORT: options.port || this.port,
      NODE_ENV: 'development'
    };

    // 启动开发服务器
    const serverProcess = spawn('pnpm', ['dev:website'], {
      stdio: 'inherit',
      env: env,
      cwd: this.projectRoot
    });

    // 保存进程ID
    fs.writeFileSync(this.pidFile, serverProcess.pid.toString());

    console.log(`✅ 开发服务器启动成功`);
    console.log(`📍 进程ID: ${serverProcess.pid}`);
    console.log(`🌐 服务地址: http://localhost:${options.port || this.port}`);
    console.log(`🕐 启动时间: ${new Date().toLocaleString()}`);

    // 处理进程退出
    serverProcess.on('exit', (code, signal) => {
      console.log(`\n📋 开发服务器已退出`);
      console.log(`📍 退出代码: ${code}`);
      console.log(`🚦 退出信号: ${signal}`);
      this.removeLock();
    });

    // 处理中断信号
    process.on('SIGINT', () => {
      console.log('\n🛑 收到中断信号，正在关闭开发服务器...');
      serverProcess.kill('SIGTERM');
      this.removeLock();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 收到终止信号，正在关闭开发服务器...');
      serverProcess.kill('SIGTERM');
      this.removeLock();
      process.exit(0);
    });

    return serverProcess;
  }

  /**
   * 停止开发服务器
   */
  stopDevServer() {
    console.log('🛑 正在停止开发服务器...');

    let stoppedCount = 0;

    // 读取PID文件并终止对应进程
    if (fs.existsSync(this.pidFile)) {
      try {
        const pid = parseInt(fs.readFileSync(this.pidFile, 'utf8'));
        process.kill(pid, 'SIGTERM');
        console.log(`✓ 通过PID文件终止进程 ${pid}`);
        stoppedCount++;
      } catch (error) {
        console.log(`⚠️ 无法终止PID文件中的进程: ${error.message}`);
      }
    }

    // 清理所有相关进程
    const cleanedCount = this.cleanupDevServers();
    stoppedCount += cleanedCount;

    // 移除锁文件
    this.removeLock();

    console.log(`🎉 停止完成，共处理 ${stoppedCount} 个进程`);
  }

  /**
   * 检查开发服务器状态
   */
  checkStatus() {
    console.log('📊 检查开发服务器状态...\n');

    // 检查锁文件
    if (fs.existsSync(this.lockFile)) {
      try {
        const lockData = JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
        console.log('🔒 锁文件状态:');
        console.log(`   进程ID: ${lockData.pid}`);
        console.log(`   端口: ${lockData.port}`);
        console.log(`   启动时间: ${new Date(lockData.timestamp).toLocaleString()}`);

        // 检查进程是否还在运行
        try {
          process.kill(lockData.pid, 0); // 发送信号0检查进程是否存在
          console.log('   状态: ✅ 运行中');
        } catch {
          console.log('   状态: ❌ 进程已退出（需要清理锁文件）');
          this.removeLock();
        }
      } catch (error) {
        console.log('❌ 锁文件损坏，正在清理...');
        this.removeLock();
      }
    } else {
      console.log('🔓 没有活动的锁文件');
    }

    // 检查端口占用
    const port = this.port;
    const portInUse = this.isPortInUse(port);
    console.log(`\n🌐 端口 ${port} 状态: ${portInUse ? '✅ 被占用' : '❌ 空闲'}`);

    // 检查所有相关进程
    const processes = this.findDevServerProcesses();
    console.log(`\n📋 开发服务器进程: ${processes.length} 个`);

    if (processes.length > 0) {
      processes.forEach((process, index) => {
        console.log(`   ${index + 1}. PID: ${process.pid} | 用户: ${process.user}`);
        console.log(`      命令: ${process.command.substring(0, 80)}...`);
      });
    } else {
      console.log('   没有发现开发服务器进程');
    }

    console.log('\n✅ 状态检查完成');
  }
}

// 命令行接口
function main() {
  const command = process.argv[2];
  const manager = new DevServerManager();

  switch (command) {
    case 'start':
      const port = process.argv[3] ? parseInt(process.argv[3]) : undefined;
      manager.startDevServer({ port });
      break;

    case 'stop':
      manager.stopDevServer();
      break;

    case 'restart':
      manager.stopDevServer();
      setTimeout(() => {
        const port = process.argv[3] ? parseInt(process.argv[3]) : undefined;
        manager.startDevServer({ port });
      }, 3000);
      break;

    case 'status':
      manager.checkStatus();
      break;

    case 'cleanup':
      manager.cleanupDevServers();
      break;

    default:
      console.log('📖 开发服务器管理器使用说明:\n');
      console.log('  启动服务器: node scripts/dev-server-manager.js start [port]');
      console.log('  停止服务器: node scripts/dev-server-manager.js stop');
      console.log('  重启服务器: node scripts/dev-server-manager.js restart [port]');
      console.log('  检查状态:   node scripts/dev-server-manager.js status');
      console.log('  清理进程:   node scripts/dev-server-manager.js cleanup');
      console.log('\n示例:');
      console.log('  node scripts/dev-server-manager.js start 3100');
      console.log('  node scripts/dev-server-manager.js status');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = DevServerManager;