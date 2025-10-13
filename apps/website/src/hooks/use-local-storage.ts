'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * 本地存储 Hook - 封装 localStorage 操作
 * 提供类型安全的本地存储操作
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [mounted, setMounted] = useState(false)

  // 初始化时从 localStorage 读取
  useEffect(() => {
    setMounted(true)

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  // 设置值的函数
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    if (!mounted) return

    try {
      // 允许传入函数来更新值
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      // 保存到 localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue, mounted])

  // 删除值的函数
  const removeValue = useCallback(() => {
    if (!mounted) return

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue, mounted])

  return [storedValue, setValue, removeValue]
}

/**
 * 简化的字符串存储 Hook
 */
export function useLocalStorageString(
  key: string,
  initialValue: string = ''
): [string, (value: string) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue)
  return [value, setValue as (value: string) => void, removeValue]
}

/**
 * 布尔值存储 Hook
 */
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false
): [boolean, (value: boolean) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue)
  return [value, setValue as (value: boolean) => void, removeValue]
}

/**
 * 数字存储 Hook
 */
export function useLocalStorageNumber(
  key: string,
  initialValue: number = 0
): [number, (value: number) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue)
  return [value, setValue as (value: number) => void, removeValue]
}