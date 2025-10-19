// 临时文件：优化后的萤火虫系统代码段

// ✨ 萤火虫粒子系统 - 优化版：鼠标吸引环绕 + 随机飞走
const SuperParticleSystemOptimized = () => {
  const [mounted, setMounted] = useState(false)
  const [fireflies, setFireflies] = useState<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    baseOpacity: number
    currentOpacity: number
    glowPhase: number
    orbitAngle: number // 环绕角度
    orbitRadius: number // 环绕半径
    orbitSpeed: number // 环绕速度
    state: 'wandering' | 'attracted' | 'orbiting' | 'escaping' // 状态机
    stateTimer: number // 状态计时器
    escapeAngle: number // 逃离角度
    wanderAngle: number
    wanderSpeed: number
    attractionStrength: number
    lastMouseDistance: number // 上次与鼠标距离
  }>>([])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const lastMouseTime = useRef(Date.now())
  const isMouseMoving = useRef(false)

  // 获取鼠标当前位置
  const getCurrentMousePos = () => ({
    x: mouseX.get(),
    y: mouseY.get()
  })

  useEffect(() => {
    setMounted(true)

    // 🦋 初始化萤火虫粒子 - 增加数量以获得更好效果
    const initFireflies = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 2.5 + 1,
      baseOpacity: Math.random() * 0.4 + 0.3,
      currentOpacity: Math.random() * 0.4 + 0.3,
      glowPhase: Math.random() * Math.PI * 2,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitRadius: 80 + Math.random() * 40, // 80-120px 环绕半径
      orbitSpeed: 0.02 + Math.random() * 0.03, // 环绕速度
      state: 'wandering' as const,
      stateTimer: 0,
      escapeAngle: 0,
      wanderAngle: Math.random() * Math.PI * 2,
      wanderSpeed: Math.random() * 0.03 + 0.02,
      attractionStrength: 0,
      lastMouseDistance: Infinity
    }))
    setFireflies(initFireflies)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      lastMouseTime.current = Date.now()
      isMouseMoving.current = true
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 持续检测鼠标是否停止移动
    const mouseStopChecker = setInterval(() => {
      const timeSinceLastMove = Date.now() - lastMouseTime.current
      if (timeSinceLastMove > 1500) { // 1.5秒后标记停止
        isMouseMoving.current = false
      }
    }, 200)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(mouseStopChecker)
    }
  }, [mouseX, mouseY])

  // ✨ 萤火虫飞舞动画 - 优化状态机版本
  useEffect(() => {
    let animationId: number
    let lastTime = 0
    const targetFPS = 60 // 提高帧率以获得更流畅的动画
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        const mousePos = getCurrentMousePos()

        setFireflies(prev => prev.map(firefly => {
          let {
            x, y, vx, vy, size, glowPhase, orbitAngle, orbitRadius, orbitSpeed,
            state, stateTimer, escapeAngle, wanderAngle, wanderSpeed,
            attractionStrength, lastMouseDistance
          } = firefly

          // 🌟 更新闪烁相位
          glowPhase += 0.06

          // 🎯 计算与鼠标的距离
          const dx = mousePos.x - x
          const dy = mousePos.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // 📊 状态机逻辑
          stateTimer++

          switch (state) {
            case 'wandering': {
              // 漫游状态：随机飞行
              if (isMouseMoving.current && distance < 250) {
                // 检测到鼠标，切换到吸引状态
                state = 'attracted'
                stateTimer = 0
                attractionStrength = 0
              }

              // 随机漫游逻辑
              if (Math.random() < 0.03) {
                wanderAngle += (Math.random() - 0.5) * 0.4
              }

              vx += Math.cos(wanderAngle) * wanderSpeed
              vy += Math.sin(wanderAngle) * wanderSpeed

              // 添加随机扰动
              vx += (Math.random() - 0.5) * 0.1
              vy += (Math.random() - 0.5) * 0.1
              break
            }

            case 'attracted': {
              // 吸引状态：快速飞向鼠标
              attractionStrength = Math.min(attractionStrength + 0.02, 1)

              if (distance < 150) {
                // 接近鼠标，切换到环绕状态
                state = 'orbiting'
                stateTimer = 0
                orbitAngle = Math.atan2(dy, dx)
                // 根据萤火虫ID设置不同的环绕半径
                orbitRadius = 60 + (firefly.id % 3) * 30 + Math.random() * 20
                orbitSpeed = 0.03 + Math.random() * 0.02
              } else if (!isMouseMoving.current || distance > 300) {
                // 鼠标停止或距离太远，返回漫游
                state = 'wandering'
                stateTimer = 0
                attractionStrength = 0
              }

              // 向鼠标吸引
              const attractForce = attractionStrength * 0.15
              vx += (dx / distance) * attractForce
              vy += (dy / distance) * attractForce
              break
            }

            case 'orbiting': {
              // 环绕状态：围绕鼠标旋转
              orbitAngle += orbitSpeed

              // 计算目标环绕位置
              const targetX = mousePos.x + Math.cos(orbitAngle) * orbitRadius
              const targetY = mousePos.y + Math.sin(orbitAngle) * orbitRadius

              // 添加轻微的径向摆动
              const radiusWobble = Math.sin(currentTime * 0.003 + firefly.id) * 10
              const finalRadius = orbitRadius + radiusWobble
              const finalX = mousePos.x + Math.cos(orbitAngle) * finalRadius
              const finalY = mousePos.y + Math.sin(orbitAngle) * finalRadius

              // 平滑移动到环绕位置
              const orbitDx = finalX - x
              const orbitDy = finalY - y
              const orbitDistance = Math.sqrt(orbitDx * orbitDx + orbitDy * orbitDy)

              if (orbitDistance > 2) {
                vx += (orbitDx / orbitDistance) * 0.08
                vy += (orbitDy / orbitDistance) * 0.08
              }

              // 检查是否应该停止环绕
              if (!isMouseMoving.current || distance > 250) {
                if (stateTimer > 60) { // 至少环绕1秒
                  state = 'escaping'
                  stateTimer = 0
                  // 设置随机逃离方向
                  escapeAngle = Math.atan2(y - mousePos.y, x - mousePos.x) + (Math.random() - 0.5) * Math.PI
                }
              }
              break
            }

            case 'escaping': {
              // 逃离状态：快速飞离鼠标
              if (stateTimer > 30) { // 逃离0.5秒后返回漫游
                state = 'wandering'
                stateTimer = 0
                attractionStrength = 0
                // 设置新的漫游方向
                wanderAngle = escapeAngle + (Math.random() - 0.5) * Math.PI / 2
              }

              // 快速逃离
              const escapeForce = 0.2
              vx += Math.cos(escapeAngle) * escapeForce
              vy += Math.sin(escapeAngle) * escapeForce

              // 添加一些随机性
              vx += (Math.random() - 0.5) * 0.15
              vy += (Math.random() - 0.5) * 0.15
              break
            }
          }

          // 💫 应用阻力和速度限制
          vx *= 0.92
          vy *= 0.92

          // 限制最大速度
          const maxSpeed = state === 'escaping' ? 8 : 4
          const currentSpeed = Math.sqrt(vx * vx + vy * vy)
          if (currentSpeed > maxSpeed) {
            vx = (vx / currentSpeed) * maxSpeed
            vy = (vy / currentSpeed) * maxSpeed
          }

          // 更新位置
          x += vx
          y += vy

          // 🌍 边界处理 - 严格约束在视窗内
          const margin = 15
          if (x < margin) {
            x = margin
            vx = Math.abs(vx) * 0.8
            if (state === 'wandering') wanderAngle = -wanderAngle
          } else if (x > window.innerWidth - margin) {
            x = window.innerWidth - margin
            vx = -Math.abs(vx) * 0.8
            if (state === 'wandering') wanderAngle = Math.PI - wanderAngle
          }

          if (y < margin) {
            y = margin
            vy = Math.abs(vy) * 0.8
            if (state === 'wandering') wanderAngle = -wanderAngle
          } else if (y > window.innerHeight - margin) {
            y = window.innerHeight - margin
            vy = -Math.abs(vy) * 0.8
            if (state === 'wandering') wanderAngle = Math.PI - wanderAngle
          }

          // ✨ 计算当前透明度（根据状态调整亮度）
          let glowIntensity = Math.sin(glowPhase) * 0.3 + 0.7
          if (state === 'orbiting' || state === 'attracted') {
            glowIntensity *= 1.3 // 吸引和环绕时更亮
          }
          const currentOpacity = firefly.baseOpacity * glowIntensity

          return {
            ...firefly,
            x, y, vx, vy, glowPhase, orbitAngle, orbitRadius, orbitSpeed,
            state, stateTimer, escapeAngle, wanderAngle, wanderSpeed,
            attractionStrength, lastMouseDistance: distance,
            currentOpacity
          }
        }))
      }

      animationId = requestAnimationFrame(animate)
    }

    if (mounted) {
      animationId = requestAnimationFrame(animate)
    }

    return () => cancelAnimationFrame(animationId)
  }, [mounted, getCurrentMousePos])

  if (!mounted) return null

  // ✨ 渲染萤火虫粒子
  const renderFirefly = (firefly: typeof fireflies[0]) => {
    // 根据状态调整光晕效果
    let glowSize = firefly.size * 8
    let coreBrightness = firefly.currentOpacity

    if (firefly.state === 'orbiting' || firefly.state === 'attracted') {
      glowSize *= 1.5 // 吸引和环绕时更大的光晕
      coreBrightness *= 1.2
    }

    return (
      <div
        key={firefly.id}
        style={{
          position: 'absolute',
          left: firefly.x,
          top: firefly.y,
          width: firefly.size * 2,
          height: firefly.size * 2,
          backgroundColor: '#ffeb3b',
          borderRadius: '50%',
          opacity: coreBrightness,
          transform: 'translate(-50%, -50%)',
          boxShadow: `
            0 0 ${glowSize}px rgba(255, 235, 59, ${coreBrightness}),
            0 0 ${glowSize * 0.5}px rgba(255, 235, 59, ${coreBrightness * 0.6}),
            0 0 ${glowSize * 0.25}px rgba(255, 235, 59, ${coreBrightness * 0.3})
          `,
          filter: 'blur(0.5px)',
          willChange: 'transform, opacity',
          mixBlendMode: 'screen'
        }}
      />
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* ✨ 渲染萤火虫 */}
      {fireflies.map(firefly => renderFirefly(firefly))}
    </div>
  )
}

export default SuperParticleSystemOptimized