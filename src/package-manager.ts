import fs from 'node:fs/promises'
import path from 'node:path'
import { type PackageManager } from './types.js'

const PACKAGE_MANAGERS: Record<string, PackageManager> = {
  pnpm: {
    name: 'pnpm',
    command: 'pnpm',
    runPrefix: ['run']
  },
  npm: {
    name: 'npm',
    command: 'npm',
    runPrefix: ['run']
  },
  yarn: {
    name: 'yarn',
    command: 'yarn',
    runPrefix: []
  },
  bun: {
    name: 'bun',
    command: 'bun',
    runPrefix: ['run']
  }
}

/**
 * Detect package manager based on lock files
 */
export async function detectPackageManager(cwd: string = process.cwd()): Promise<PackageManager> {
  try {
    const files = await fs.readdir(cwd)

    // Check for lock files in priority order
    if (files.includes('pnpm-lock.yaml')) {
      return PACKAGE_MANAGERS.pnpm
    }
    if (files.includes('yarn.lock')) {
      return PACKAGE_MANAGERS.yarn
    }
    if (files.includes('bun.lockb')) {
      return PACKAGE_MANAGERS.bun
    }
    if (files.includes('package-lock.json')) {
      return PACKAGE_MANAGERS.npm
    }

    // Default to npm if no lock file found
    return PACKAGE_MANAGERS.npm
  } catch {
    return PACKAGE_MANAGERS.npm
  }
}

/**
 * Get package manager based on config or auto-detection
 */
export async function getPackageManager(
  configuredPM: string = 'auto',
  cwd: string = process.cwd()
): Promise<PackageManager> {
  if (configuredPM === 'auto') {
    return await detectPackageManager(cwd)
  }

  const pm = PACKAGE_MANAGERS[configuredPM]
  if (!pm) {
    console.warn(`Unknown package manager: ${configuredPM}, falling back to auto-detection`)
    return await detectPackageManager(cwd)
  }

  return pm
}

/**
 * Build command arguments for package manager
 */
export function buildCommand(
  packageManager: PackageManager,
  args: string[]
): string[] {
  const runPrefix = packageManager.runPrefix || []
  return [packageManager.command, ...runPrefix, ...args]
}
