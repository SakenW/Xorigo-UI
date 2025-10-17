'use client'

import React from 'react'
import { motion } from 'framer-motion'

/**
 * NavbarOriginLogo - 专门为导航条设计的原点Logo组件
 *
 * 特性：
 * - 持续循环的原点动画
 * - 适合小尺寸显示
 * - 体现"原点"的设计理念
 */
export const NavbarOriginLogo = ({
  className = '',
  size = 48
}: {
  className?: string
  size?: number
}) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 中圈波纹动画 */}
      <motion.div
        className="absolute inset-2 rounded-full border border-cyan-500/30"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.3,
        }}
      />

      {/* 内圈波纹 */}
      <motion.div
        className="absolute inset-3 rounded-full border border-purple-500/20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.15, 0.3],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.6,
        }}
      />

      {/* 内圈核心 */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* 中心原点 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              "0 0 4px rgba(255,255,255,0.8)",
              "0 0 12px rgba(255,255,255,1)",
              "0 0 4px rgba(255,255,255,0.8)"
            ],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>

      {/* 外圈渐变环 */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #d946ef, #f472b6, #22d3ee, #d946ef)',
            opacity: 0.9,
          }}
        />
        <div className="absolute inset-2 rounded-full bg-black" />
      </div>

      {/* 环上旋转的原点 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div
          className="absolute w-2 h-2 bg-white rounded-full shadow-lg"
          style={{
            left: `${size * 0.42}px`,
            top: '50%',
            marginTop: '-4px',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(168, 85, 247, 0.6)',
          }}
        />
      </motion.div>
    </div>
  )
}

export default NavbarOriginLogo