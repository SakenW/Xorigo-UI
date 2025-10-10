import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from "lucide-react";

// 模态框接口
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  closable?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  footer?: React.ReactNode;
  className?: string;
  width?: string | number;
  zIndex?: number;
}

// 对话框接口
export interface DialogProps extends Omit<ModalProps, 'children' | 'title'> {
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  content: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  loading?: boolean;
}

// 模态框上下文
const ModalContext = React.createContext<{
  level: number;
  zIndex: number;
}>({ level: 0, zIndex: 1000 });

// 基础模态框组件
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  closable = true,
  maskClosable = true,
  centered = false,
  footer,
  className = '',
  width,
  zIndex = 1000
}) => {
  const [level, setLevel] = React.useState(0);

  // 处理ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // 处理滚动锁定
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setLevel(prev => prev + 1);
    } else {
      document.body.style.overflow = 'unset';
      setLevel(prev => Math.max(0, prev - 1));
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const variantIcons = {
    danger: <AlertTriangle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    default: null
  };

  const modalWidth = width || sizeClasses[size];

  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && maskClosable) {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {open && (
        <ModalContext.Provider value={{ level, zIndex }}>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-1001"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleMaskClick}
            style={{ zIndex: zIndex + level * 10 }}
          />

          {/* 模态框内容 */}
          <motion.div
            className={`
              fixed inset-0 flex items-center justify-center p-4 z-1002
              ${centered ? '' : 'items-start pt-20'}
            `}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: zIndex + level * 10 + 1 }}
          >
            <motion.div
              className={`
                relative w-full ${modalWidth} bg-white rounded-xl shadow-2xl
                ${className}
              `}
              layoutId={`modal-${level}`}
              style={{ maxHeight: '90vh', overflow: 'auto' }}
            >
              {/* 标题栏 */}
              {(title || closable) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    {variantIcons[variant]}
                    {title && (
                      <h2 className="text-xl font-semibold text-gray-900">
                        {title}
                      </h2>
                    )}
                  </div>
                  {closable && (
                    <motion.button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* 内容区域 */}
              <div className="p-6">
                {children}
              </div>

              {/* 底部区域 */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </ModalContext.Provider>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

// 对话框组件
export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  type,
  title,
  content,
  onOk,
  onCancel,
  okText = '确定',
  cancelText = '取消',
  okButtonProps,
  cancelButtonProps,
  loading = false,
  size = 'md',
  ...modalProps
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOk = async () => {
    if (loading || isLoading) return;

    setIsLoading(true);
    try {
      await onOk?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading || isLoading) return;
    onCancel?.();
    onClose();
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      {type !== 'alert' && (
        <motion.button
          onClick={handleCancel}
          disabled={loading || isLoading}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...cancelButtonProps}
        >
          {cancelText}
        </motion.button>
      )}
      <motion.button
        onClick={handleOk}
        disabled={loading || isLoading}
        className={`
          px-4 py-2 text-white rounded-lg disabled:opacity-50
          ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...okButtonProps}
      >
        {loading || isLoading ? '处理中...' : okText}
      </motion.button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={title}
      size={size}
      variant={type === 'alert' ? 'info' : type}
      footer={footer}
      {...modalProps}
    >
      <div className="flex items-start space-x-3">
        {type === 'alert' && <Info className="w-5 h-5 text-blue-500 mt-0.5" />}
        {type === 'confirm' && <HelpCircle className="w-5 h-5 text-yellow-500 mt-0.5" />}
        {type === 'danger' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </div>
    </Modal>
  );
};

// 抽屉组件
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  maskClosable?: boolean;
  footer?: React.ReactNode;
  className?: string;
  zIndex?: number;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  placement = 'right',
  size = 'md',
  closable = true,
  maskClosable = true,
  footer,
  className = '',
  zIndex = 1000
}) => {
  const [level, setLevel] = React.useState(0);

  // 处理ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // 处理滚动锁定
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setLevel(prev => prev + 1);
    } else {
      document.body.style.overflow = 'unset';
      setLevel(prev => Math.max(0, prev - 1));
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const sizeClasses = {
    sm: placement === 'left' || placement === 'right' ? 'w-80' : 'h-64',
    md: placement === 'left' || placement === 'right' ? 'w-96' : 'h-96',
    lg: placement === 'left' || placement === 'right' ? 'w-lg' : 'h-128'
  };

  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && maskClosable) {
      onClose();
    }
  };

  const getDrawerVariants = () => {
    switch (placement) {
      case 'left':
        return {
          initial: { x: '-100%' },
          animate: { x: 0 },
          exit: { x: '-100%' }
        };
      case 'right':
        return {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' }
        };
      case 'top':
        return {
          initial: { y: '-100%' },
          animate: { y: 0 },
          exit: { y: '-100%' }
        };
      case 'bottom':
        return {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' }
        };
    }
  };

  const drawerVariants = getDrawerVariants();

  const drawerContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-1001"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleMaskClick}
            style={{ zIndex: zIndex + level * 10 }}
          />

          {/* 抽屉内容 */}
          <motion.div
            className={`
              fixed bg-white shadow-2xl z-1002
              ${placement === 'left' || placement === 'right' ? 'h-full' : 'w-full'}
              ${sizeClasses[size]}
              ${placement === 'left' ? 'left-0 top-0' : ''}
              ${placement === 'right' ? 'right-0 top-0' : ''}
              ${placement === 'top' ? 'top-0 left-0 right-0' : ''}
              ${placement === 'bottom' ? 'bottom-0 left-0 right-0' : ''}
              ${className}
            `}
            {...drawerVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ zIndex: zIndex + level * 10 + 1 }}
          >
            {/* 标题栏 */}
            {(title || closable) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {closable && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              <div className="p-6">
                {children}
              </div>
            </div>

            {/* 底部区域 */}
            {footer && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};

// 便捷方法
export const modal = {
  alert: (title: string, content: string): Promise<void> => {
    return new Promise((resolve) => {
      const AlertModal = () => {
        const [open, setOpen] = React.useState(true);

        return (
          <Dialog
            open={open}
            onClose={() => {
              setOpen(false);
              resolve();
            }}
            type="alert"
            title={title}
            content={content}
          />
        );
      };

      // 这里需要使用一个全局状态管理器来渲染模态框
      // 暂时返回一个已解决的Promise
      resolve();
    });
  },

  confirm: (title: string, content: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const ConfirmModal = () => {
        const [open, setOpen] = React.useState(true);

        return (
          <Dialog
            open={open}
            onClose={() => {
              setOpen(false);
              resolve(false);
            }}
            onOk={() => {
              setOpen(false);
              resolve(true);
            }}
            type="confirm"
            title={title}
            content={content}
          />
        );
      };

      // 这里需要使用一个全局状态管理器来渲染模态框
      // 暂时返回true
      resolve(true);
    });
  },

  prompt: (title: string, content: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const PromptModal = () => {
        const [open, setOpen] = React.useState(true);
        const [value, setValue] = React.useState('');

        return (
          <Modal
            open={open}
            onClose={() => {
              setOpen(false);
              resolve(null);
            }}
            title={title}
            footer={
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={() => {
                    setOpen(false);
                    resolve(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </motion.button>
                <motion.button
                  onClick={() => {
                    setOpen(false);
                    resolve(value);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  确定
                </motion.button>
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-gray-600">{content}</p>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                placeholder="请输入..."
              />
            </div>
          </Modal>
        );
      };

      // 这里需要使用一个全局状态管理器来渲染模态框
      // 暂时返回null
      resolve(null);
    });
  }
};
