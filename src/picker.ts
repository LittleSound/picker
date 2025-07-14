import prompts from 'prompts'
import { execa } from 'execa'
import { loadConfig } from './config.js'
import { scanPackages } from './scanner.js'
import { getPackageManager, buildCommand } from './package-manager.js'
import { handleEditorOpen } from './editor.js'
import { type Package, type PickerConfig } from './types.js'

export interface PickerOptions {
  /** Auto-select first package without prompting */
  autoSelect?: boolean
  /** Working directory */
  cwd?: string
  /** Override config */
  config?: Partial<PickerConfig>
}

/**
 * Main picker function
 */
export async function pick(args: string[], options: PickerOptions = {}): Promise<void> {
  const cwd = options.cwd || process.cwd()

  // Load configuration
  const config = {
    ...await loadConfig(cwd),
    ...options.config
  }

  // Scan for packages
  const packages = await scanPackages(config, cwd)

  if (packages.length === 0) {
    console.error('No packages found matching the pattern')
    process.exit(1)
  }

  // Select package
  let selectedPackage: Package

  if (options.autoSelect) {
    selectedPackage = packages[0]
    console.log(`Auto-selected: ${selectedPackage.name}`)
  } else {
    const result = await prompts({
      type: 'select',
      name: 'package',
      message: 'Pick a package',
      choices: packages.map(pkg => ({
        title: pkg.name,
        value: pkg,
        description: pkg.path
      })),
      initial: 0
    })

    if (!result.package) {
      console.log('Selection cancelled')
      process.exit(0)
    }

    selectedPackage = result.package
  }

  // Handle editor opening
  await handleEditorOpen(selectedPackage, args)

  // Get package manager
  const packageManager = await getPackageManager(config.packageManager, cwd)

  // Build command
  const command = buildCommand(packageManager, args)

  console.log(`Running: ${command.join(' ')} in ${selectedPackage.workingDirectory}`)
  console.log(`Package: ${selectedPackage.name}`)
  console.log(`Package Manager: ${packageManager.name}`)
  console.log('')

  // Execute command
  try {
    await execa(command[0], command.slice(1), {
      cwd: selectedPackage.workingDirectory,
      stdio: 'inherit'
    })
  } catch (error: any) {
    console.error(`Command failed with exit code ${error.exitCode || 1}`)
    process.exit(error.exitCode || 1)
  }
}

/**
 * List available packages
 */
export async function listPackages(options: PickerOptions = {}): Promise<Package[]> {
  const cwd = options.cwd || process.cwd()
  const config = {
    ...await loadConfig(cwd),
    ...options.config
  }

  return await scanPackages(config, cwd)
}
