// SSR 友好 AnimatePresence 占位
import React from 'react'
export const SSRAnimatePresence: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>
