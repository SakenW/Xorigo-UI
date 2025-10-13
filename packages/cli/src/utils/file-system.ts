/**
 * 文件系统工具函数
 */

import fs from 'fs/promises'
import path from 'path'

/**
 * 递归创建目录
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true })
}

/**
 * 检查文件是否存在
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * 递归删除目录
 */
export async function removeDir(dirPath: string): Promise<void> {
  try {
    await fs.rm(dirPath, { recursive: true, force: true })
  } catch (error) {
    // 忽略不存在的目录
  }
}

/**
 * 复制文件
 */
export async function copyFile(source: string, destination: string): Promise<void> {
  await ensureDir(path.dirname(destination))
  await fs.copyFile(source, destination)
}

/**
 * 递归复制目录
 */
export async function copyDir(source: string, destination: string): Promise<void> {
  await ensureDir(destination)
  const items = await fs.readdir(source, { withFileTypes: true })

  for (const item of items) {
    const sourcePath = path.join(source, item.name)
    const destPath = path.join(destination, item.name)

    if (item.isDirectory()) {
      await copyDir(sourcePath, destPath)
    } else {
      await copyFile(sourcePath, destPath)
    }
  }
}

/**
 * 读取 JSON 文件
 */
export async function readJsonFile<T = unknown>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * 写入 JSON 文件
 */
export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * 获取所有文件（递归）
 */
export async function getAllFiles(
  dirPath: string,
  pattern?: RegExp,
  ignorePatterns: string[] = ['node_modules', 'dist', '.git']
): Promise<string[]> {
  const files: string[] = []

  async function scan(currentPath: string) {
    const items = await fs.readdir(currentPath, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name)

      if (item.isDirectory()) {
        if (!ignorePatterns.includes(item.name)) {
          await scan(fullPath)
        }
      } else if (item.isFile()) {
        if (!pattern || pattern.test(item.name)) {
          files.push(fullPath)
        }
      }
    }
  }

  await scan(dirPath)
  return files
}
