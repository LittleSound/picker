#!/usr/bin/env node
import process from 'node:process'
import { pick, listPackages } from './picker.js'

const VERSION = '1.0.0'

function printHelp() {
  console.log(`
monorepo-picker v${VERSION}

Interactive monorepo package picker with editor integration

USAGE:
  monorepo-picker [options] <command> [args...]

OPTIONS:
  -y, --yes       Auto-select the first package without prompting
  -l, --list      List available packages and exit
  -h, --help      Show this help message
  -v, --version   Show version number

EXAMPLES:
  monorepo-picker dev
  monorepo-picker -y build
  monorepo-picker test --watch
  monorepo-picker --list

CONFIGURATION:
  Add a "picker" field to your package.json:

  {
    "picker": {
      "packageManager": "auto",
      "pattern": "^\\\\d{4}-",
      "scanPath": ".",
      "workingDirectory": "src",
      "editor": {
        "command": "code",
        "triggers": ["dev"],
        "filePath": "slides.md"
      }
    }
  }
`)
}

async function main() {
  const args = process.argv.slice(2)

  // Handle help
  if (args.includes('-h') || args.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  // Handle version
  if (args.includes('-v') || args.includes('--version')) {
    console.log(VERSION)
    process.exit(0)
  }

  // Handle list
  if (args.includes('-l') || args.includes('--list')) {
    try {
      const packages = await listPackages()
      if (packages.length === 0) {
        console.log('No packages found')
      } else {
        console.log('Available packages:')
        for (const pkg of packages) {
          console.log(`  ${pkg.name} (${pkg.path})`)
        }
      }
    } catch (error) {
      console.error('Failed to list packages:', error)
      process.exit(1)
    }
    process.exit(0)
  }

  // Handle auto-select
  const autoSelect = args.includes('-y') || args.includes('--yes')
  const filteredArgs = args.filter(arg =>
    !arg.startsWith('-y') &&
    !arg.startsWith('--yes') &&
    !arg.startsWith('-l') &&
    !arg.startsWith('--list')
  )

  if (filteredArgs.length === 0) {
    console.error('No command specified')
    printHelp()
    process.exit(1)
  }

  try {
    await pick(filteredArgs, { autoSelect })
  } catch (error) {
    console.error('Picker failed:', error)
    process.exit(1)
  }
}

main().catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
