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
      {/* 外圈呼吸效果 - 颜色变化版本 */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.1, 0.3, 0.1],
          background: [
            'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
            'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%)',
            'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(245, 158, 11, 0.12) 100%)',
            'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)'
          ],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* 中圈波纹动画 - 颜色渐变版本 */}
      <motion.div
        className="absolute inset-1 rounded-full border-2"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.1, 0.6],
          borderColor: [
            'rgba(6, 182, 212, 0.6)', // cyan
            'rgba(236, 72, 153, 0.5)', // pink
            'rgba(16, 185, 129, 0.55)', // emerald
            'rgba(245, 158, 11, 0.5)', // amber
            'rgba(139, 92, 246, 0.6)', // violet
            'rgba(6, 182, 212, 0.6)'  // back to cyan
          ],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.3,
        }}
      />

      {/* 内圈波纹 - 颜色流动版本 */}
      <motion.div
        className="absolute inset-2 rounded-full border-2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
          borderColor: [
            'rgba(168, 85, 247, 0.5)', // purple
            'rgba(59, 130, 246, 0.45)', // blue
            'rgba(236, 72, 153, 0.5)', // pink
            'rgba(6, 182, 212, 0.4)', // cyan
            'rgba(168, 85, 247, 0.5)'  // back to purple
          ],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.6,
        }}
      />

      {/* 内圈核心 - 颜色呼吸版本 */}
      <motion.div
        className="absolute inset-3 rounded-full shadow-lg"
        animate={{
          scale: [1, 1.15, 1],
          background: [
            'linear-gradient(45deg, #a855f7, #06b6d4)', // purple to cyan
            'linear-gradient(45deg, #ec4899, #3b82f6)', // pink to blue
            'linear-gradient(45deg, #10b981, #f59e0b)', // emerald to amber
            'linear-gradient(45deg, #8b5cf6, #ec4899)', // violet to pink
            'linear-gradient(45deg, #06b6d4, #a855f7)', // cyan to purple
          ],
          boxShadow: [
            "0 0 20px rgba(168, 85, 247, 0.4)",
            "0 0 40px rgba(236, 72, 153, 0.6)",
            "0 0 30px rgba(16, 185, 129, 0.5)",
            "0 0 35px rgba(245, 158, 11, 0.4)",
            "0 0 25px rgba(139, 92, 246, 0.5)",
            "0 0 20px rgba(168, 85, 247, 0.4)"
          ],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* 中心原点 - 彩色呼吸效果 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-2 h-2 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            backgroundColor: [
              '#ffffff',  // white
              '#fbbf24',  // amber
              '#34d399',  // emerald
              '#60a5fa',  // blue
              '#f472b6',  // pink
              '#ffffff'   // back to white
            ],
            boxShadow: [
              "0 0 8px rgba(255,255,255,0.8)",
              "0 0 20px rgba(251, 191, 36, 0.9)",
              "0 0 16px rgba(52, 211, 153, 0.9)",
              "0 0 18px rgba(96, 165, 250, 0.9)",
              "0 0 22px rgba(244, 114, 182, 0.9)",
              "0 0 8px rgba(255,255,255,0.8)"
            ],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>

      {/* 外圈渐变环 - 颜色呼吸版本 */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        animate={{
          background: [
            'conic-gradient(from 0deg, #d946ef, #f472b6, #22d3ee, #d946ef)',
            'conic-gradient(from 90deg, #22d3ee, #d946ef, #f472b6, #22d3ee)',
            'conic-gradient(from 180deg, #f472b6, #22d3ee, #d946ef, #f472b6)',
            'conic-gradient(from 270deg, #d946ef, #f472b6, #22d3ee, #d946ef)',
            'conic-gradient(from 360deg, #d946ef, #f472b6, #22d3ee, #d946ef)'
          ],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            opacity: 0.9,
          }}
        />
      </motion.div>
      <div className="absolute inset-2 rounded-full bg-black" />

      {/* 环上旋转的原点 - 彩色呼吸版本 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 6,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <motion.div
          className="absolute w-2 h-2 rounded-full shadow-lg"
          animate={{
            backgroundColor: [
              '#ffffff',  // white
              '#fbbf24',  // amber
              '#34d399',  // emerald
              '#60a5fa',  // blue
              '#f472b6',  // pink
              '#ffffff'   // back to white
            ],
            boxShadow: [
              '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(168, 85, 247, 0.6)',
              '0 0 12px rgba(251, 191, 36, 0.9), 0 0 20px rgba(251, 191, 36, 0.7)',
              '0 0 10px rgba(52, 211, 153, 0.9), 0 0 18px rgba(52, 211, 153, 0.7)',
              '0 0 11px rgba(96, 165, 250, 0.9), 0 0 19px rgba(96, 165, 250, 0.7)',
              '0 0 13px rgba(244, 114, 182, 0.9), 0 0 21px rgba(244, 114, 182, 0.7)',
              '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(168, 85, 247, 0.6)'
            ],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            left: `${size * 0.42}px`,
            top: '50%',
            marginTop: '-4px',
          }}
        />
      </motion.div>
    </div>
  )
}

export default NavbarOriginLogo