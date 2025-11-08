#!/usr/bin/env node

/**
 * 获取当前日期时间，用于版本号
 */

function getCurrentDateTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${year}${month}${day}${hours}${minutes}`
}

function getCurrentDate() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}${month}${day}`
}

function formatDateTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const command = process.argv[2]

if (command === 'date') {
  console.log(getCurrentDate())
} else if (command === 'datetime') {
  console.log(getCurrentDateTime())
} else if (command === 'formatted') {
  console.log(formatDateTime())
} else {
  // 默认输出日期
  console.log('📅 当前日期:', getCurrentDate())
  console.log('🕐 当前时间:', getCurrentDateTime())
  console.log('📋 格式化:', formatDateTime())
}