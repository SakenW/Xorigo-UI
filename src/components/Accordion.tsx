import React, * as AccordionPrimitive from '@radix-ui/react-accordion'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../utils/cn'
import { forwardRef } from 'react'

const Accordion = AccordionPrimitive.Root

const AccordionItem = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-gray-200 dark:border-gray-700', className)}
      {...props}
    />
  </motion.div>
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all',
        'hover:text-gray-900 dark:hover:text-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm"
    {...props}
  >
    <AnimatePresence initial={false}>
      <motion.div
        key="content"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: 'auto',
          opacity: 1,
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
        exit={{
          height: 0,
          opacity: 0,
          transition: { duration: 0.2, ease: 'easeIn' }
        }}
      >
        <div className={cn('pb-4 pt-0', className)}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// 复合组件接口
interface AccordionComponent extends React.FC<React.ComponentPropsWithoutRef<typeof Accordion>> {
  Item: typeof AccordionItem
  Trigger: typeof AccordionTrigger
  Content: typeof AccordionContent
}

const AccordionComponent = Accordion as AccordionComponent
AccordionComponent.Item = AccordionItem
AccordionComponent.Trigger = AccordionTrigger
AccordionComponent.Content = AccordionContent

export { AccordionComponent as Accordion }
export default Accordion