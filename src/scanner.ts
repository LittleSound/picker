import fs from 'node:fs/promises'
import path from 'node:path'
import { type PickerConfig, type Package } from './types.js'
import { mergePackageConfig } from './config.js'

/**
 * Scan for packages based on configuration
 */
export async function scanPackages(
  config: PickerConfig,
  cwd: string = process.cwd()
): Promise<Package[]> {
  const scanPath = path.resolve(cwd, config.scanPath || '.')
  const pattern = new RegExp(config.pattern || '^\\d{4}-')
  const exclude = config.exclude || []

  try {
    const entries = await fs.readdir(scanPath, { withFileTypes: true })

    const packages: Package[] = []

    for (const entry of entries) {
      // Skip if not a directory
      if (!entry.isDirectory()) continue

      // Skip if in exclude list
      if (exclude.includes(entry.name)) continue

      // Skip if doesn't match pattern
      if (!pattern.test(entry.name)) continue

      const packagePath = path.join(scanPath, entry.name)

      // Check if it's a valid package (optional: could check for package.json)
      try {
        await fs.access(packagePath)
        const packageConfig = mergePackageConfig(config, entry.name)

        packages.push({
          name: entry.name,
          path: packagePath,
          workingDirectory: path.join(packagePath, packageConfig.workingDirectory),
          editor: packageConfig.editor
        })
      } catch {
        // Skip if directory is not accessible
        continue
      }
    }

    // Sort packages by name (newest first if date-like pattern)
    return packages.sort((a, b) => {
      // If both look like dates, sort newest first
      if (/^\d{4}-\d{2}-\d{2}/.test(a.name) && /^\d{4}-\d{2}-\d{2}/.test(b.name)) {
        return -a.name.localeCompare(b.name)
      }
      // Otherwise sort alphabetically
      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    console.error(`Failed to scan packages in ${scanPath}:`, error)
    return []
  }
}

/**
 * Check if a package directory has a package.json
 */
export async function hasPackageJson(packagePath: string): Promise<boolean> {
  try {
    await fs.access(path.join(packagePath, 'package.json'))
    return true
  } catch {
    return false
  }
}

/**
 * Get package info from package.json
 */
export async function getPackageInfo(packagePath: string): Promise<{ name?: string; version?: string } | null> {
  try {
    const packageJsonPath = path.join(packagePath, 'package.json')
    const content = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(content)
    return {
      name: packageJson.name,
      version: packageJson.version
    }
  } catch {
    return null
  }
}
