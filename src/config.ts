import fs from 'node:fs/promises'
import path from 'node:path'
import { DEFAULT_CONFIG, type PickerConfig } from './types.js'

/**
 * Load configuration from package.json
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<PickerConfig> {
  try {
    const packageJsonPath = path.join(cwd, 'package.json')
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonContent)

    const userConfig = packageJson.picker || {}

    // Merge with defaults
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
      editor: {
        ...DEFAULT_CONFIG.editor,
        ...userConfig.editor
      },
      packages: {
        ...DEFAULT_CONFIG.packages,
        ...userConfig.packages
      }
    }
  } catch (error) {
    console.warn('Could not load picker config from package.json, using defaults')
    return DEFAULT_CONFIG
  }
}

/**
 * Merge package-specific config with global config
 */
export function mergePackageConfig(
  globalConfig: PickerConfig,
  packageName: string
): { workingDirectory: string; editor: Required<NonNullable<PickerConfig['editor']>> } {
  const packageConfig = globalConfig.packages?.[packageName] || {}

  return {
    workingDirectory: packageConfig.workingDirectory || globalConfig.workingDirectory || DEFAULT_CONFIG.workingDirectory,
    editor: {
      ...DEFAULT_CONFIG.editor,
      ...globalConfig.editor,
      ...packageConfig.editor
    }
  }
}
