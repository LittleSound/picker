// Main exports
export { pick, listPackages, type PickerOptions } from './picker.js'
export { loadConfig, mergePackageConfig } from './config.js'
export { scanPackages, hasPackageJson, getPackageInfo } from './scanner.js'
export { detectPackageManager, getPackageManager, buildCommand } from './package-manager.js'
export { isEditorAvailable, fileExists, openInEditor, handleEditorOpen } from './editor.js'

// Types
export type {
  PickerConfig,
  EditorConfig,
  PackageConfig,
  Package,
  PackageManager
} from './types.js'

export { DEFAULT_CONFIG } from './types.js'
