export interface PickerConfig {
  /** Package manager to use. 'auto' will detect automatically */
  packageManager?: 'auto' | 'pnpm' | 'npm' | 'yarn' | 'bun'
  /** Regex pattern to match folder names */
  pattern?: string
  /** Path to scan for packages */
  scanPath?: string
  /** Default working directory for commands */
  workingDirectory?: string
  /** Folders to exclude from scanning */
  exclude?: string[]
  /** Editor configuration */
  editor?: EditorConfig
  /** Package-specific configurations */
  packages?: Record<string, PackageConfig>
}

export interface EditorConfig {
  /** Editor command to run */
  command?: string
  /** Commands that trigger editor opening */
  triggers?: string[]
  /** File path to open relative to working directory */
  filePath?: string
  /** Whether editor integration is enabled */
  enabled?: boolean
}

export interface PackageConfig {
  /** Override working directory for this package */
  workingDirectory?: string
  /** Override editor config for this package */
  editor?: Partial<EditorConfig>
}

export interface Package {
  /** Package name/folder name */
  name: string
  /** Absolute path to package */
  path: string
  /** Working directory for commands */
  workingDirectory: string
  /** Editor configuration for this package */
  editor: EditorConfig
}

export interface PackageManager {
  /** Package manager name */
  name: string
  /** Command to run */
  command: string
  /** Arguments prefix (e.g., 'run' for npm/yarn) */
  runPrefix?: string[]
}

export const DEFAULT_CONFIG: Required<PickerConfig> = {
  packageManager: 'auto',
  pattern: '^\\d{4}-',
  scanPath: '.',
  workingDirectory: 'src',
  exclude: ['node_modules', 'dist', '.git', '.next', '.nuxt'],
  editor: {
    command: 'code',
    triggers: ['dev'],
    filePath: 'slides.md',
    enabled: true
  },
  packages: {}
}
