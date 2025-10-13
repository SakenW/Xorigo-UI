// 客户端 Hooks 导出文件
// 封装浏览器 API，支持 RSC/Client 分离

export { useThemeSync } from './use-theme-sync'
export {
  useMediaQuery,
  useBreakpoints,
  useDevice
} from './use-media-query'
export {
  useLocalStorage,
  useLocalStorageString,
  useLocalStorageBoolean,
  useLocalStorageNumber
} from './use-local-storage'
export { useCopyToClipboard } from './use-copy-to-clipboard'
export { useMounted } from './use-mounted'