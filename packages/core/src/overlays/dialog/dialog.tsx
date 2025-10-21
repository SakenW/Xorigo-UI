// Dialog 占位
import React from 'react'
export const Dialog: React.FC<{open?:boolean; onOpenChange?:(v:boolean)=>void; children?:React.ReactNode}> = (p) => <div hidden={!p.open}>{p.children}</div>
