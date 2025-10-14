#!/usr/bin/env node

/**
 * 检查 Gallery 页面的详细错误信息
 */

const https = require('https')
const http = require('http')

function checkPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    client.get(url, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        })
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

async function main() {
  console.log('🔍 检查 Gallery 页面状态...\n')

  try {
    const response = await checkPage('http://localhost:3100/gallery')

    console.log(`📊 状态码: ${response.statusCode}`)
    console.log(`📦 内容长度: ${response.body.length} bytes\n`)

    // 检查错误模式
    const errorPatterns = [
      { name: 'ReferenceError', pattern: /ReferenceError:\s*(\w+)\s+is\s+not\s+defined/g },
      { name: 'TypeError', pattern: /TypeError:\s*(.+?)(?=\n|$)/g },
      { name: 'Import Error', pattern: /Attempted import error:\s*(.+?)(?=\n|$)/g },
      { name: 'Module Error', pattern: /Module not found:\s*(.+?)(?=\n|$)/g },
      { name: 'React Error', pattern: /Error:\s*(.+?)(?=\n|\s{2}at)/g }
    ]

    let foundErrors = false

    errorPatterns.forEach(({ name, pattern }) => {
      const matches = response.body.match(pattern)
      if (matches) {
        console.log(`❌ ${name} 发现:`)
        matches.forEach(match => {
          console.log(`   ${match.trim()}`)
        })
        console.log()
        foundErrors = true
      }
    })

    // 检查特定的组件错误
    const componentPatterns = [
      'Dialog is not defined',
      'CardTitle is not exported',
      'DataErrorCode is not defined',
      'Cannot read propert',
      'Failed to load module'
    ]

    componentPatterns.forEach(pattern => {
      if (response.body.includes(pattern)) {
        console.log(`❌ 组件错误: ${pattern}`)
        foundErrors = true
      }
    })

    // 检查页面是否正常加载
    const hasGalleryContent = response.body.includes('Gallery') || response.body.includes('gallery')
    const hasComponentCards = response.body.includes('component-card') || response.body.includes('Card')
    const hasErrorMessages = response.body.includes('error') || response.body.includes('Error')

    console.log('📋 页面内容分析:')
    console.log(`   Gallery 内容: ${hasGalleryContent ? '✅' : '❌'}`)
    console.log(`   组件卡片: ${hasComponentCards ? '✅' : '❌'}`)
    console.log(`   错误消息: ${hasErrorMessages ? '❌' : '✅'}`)

    if (!foundErrors && !hasErrorMessages) {
      console.log('\n🎉 页面看起来正常！')
    } else {
      console.log('\n⚠️  发现错误，需要进一步调查')
    }

    // 检查控制台错误（如果有的话）
    if (response.body.includes('console.error')) {
      console.log('\n🔍 发现控制台错误:')
      const consoleErrors = response.body.match(/console\.error\(['"]([^'"]+)['"]/g)
      if (consoleErrors) {
        consoleErrors.forEach(error => {
          console.log(`   ${error}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ 无法访问页面:', error.message)
  }
}

main()