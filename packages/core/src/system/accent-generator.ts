// 强调色策略生成（示意实现）
export function generateAccent(strategy: 'mono'|'analog'|'duo', hue: string) {
  const base = hue
  switch (strategy) {
    case 'mono': return { primary: base, secondary: base }
    case 'analog': return { primary: base, secondary: 'cyan' }
    case 'duo': return { primary: base, secondary: 'orange' }
  }
}
