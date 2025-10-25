# WSL性能优化建议

## 1. 优化WSL配置
在Windows上创建或编辑 `%USERPROFILE%\.wslconfig` 文件：

```ini
[wsl2]
# 分配更多内存给WSL
memory=8GB
# 增加交换空间
swap=4GB
# 限制CPU核心数（可选）
processors=4
# 启用nested virtualization（可选）
nestedVirtualization=true
```

## 2. 优化WSL内部配置
编辑 `/etc/wsl.conf` 文件（在WSL内）：

```ini
[boot]
# 启动时自动执行命令
systemd=true

[interop]
# 禁用Windows路径附加（可选）
appendWindowsPath=false

[user]
# 默认用户
default=saken

[network]
# 禁用自动生成resolv.conf
generateResolvConf = false

[automount]
# 优化文件系统性能
options="metadata,umask=22,fmask=11"
```

## 3. 优化内存管理
在WSL中执行以下命令调整swappiness值：

```bash
# 临时降低swappiness值
sudo sysctl vm.swappiness=10

# 永久设置
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
```

## 4. 优化DNS配置
编辑 `/etc/resolv.conf` 文件，使用更快的DNS服务器：

```
nameserver 223.5.5.5
nameserver 114.114.114.114
nameserver 1.1.1.1
options timeout:2 attempts:3 rotate
```

## 5. 优化SSH连接
创建 `~/.ssh/config` 文件：

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    ConnectTimeout 10
    Compression no
    ControlMaster auto
    ControlPath ~/.ssh/master-%r@%h:%p
    ControlPersist 600
```

## 6. 其他优化建议

### 清理系统
```bash
# 清理包缓存
sudo apt-get clean

# 清理旧的日志
sudo journalctl --vacuum-time=7d

# 清理不需要的包
sudo apt autoremove
```

### 监控系统资源
```bash
# 安装htop和iotop
sudo apt-get install htop iotop

# 监控进程和I/O
htop
sudo iotop
```

## 7. 重启WSL应用更改
在Windows PowerShell中执行：

```powershell
wsl --shutdown
wsl
```

## 注意事项
- 修改`.wslconfig`后需要完全关闭WSL再重启
- 内存和交换空间的设置应根据您的物理内存大小调整
- 如果问题仍然存在，考虑使用有线网络连接而非WiFi