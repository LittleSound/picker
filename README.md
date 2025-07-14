# [WIP] Monorepo Picker

🎯 Interactive monorepo package picker with editor integration

A powerful CLI tool that helps you quickly select and run commands in monorepo packages. Perfect for projects with multiple sub-packages where you frequently need to run development or build commands.

## Features

- 🔍 **Auto-discovery**: Automatically scan and detect packages based on configurable patterns
- 📦 **Multi-PM Support**: Works with pnpm, npm, yarn, and bun (auto-detection or manual config)
- ⚡ **Quick Selection**: Interactive picker with keyboard navigation
- 🎯 **Auto-select**: Skip selection with `-y` flag for automation
- 🔧 **Editor Integration**: Automatically open files in your preferred editor
- ⚙️ **Flexible Config**: Customize everything through package.json configuration
- 🎨 **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
# Global installation
npm install -g monorepo-picker

# Or use directly with npx
npx monorepo-picker dev
```

## Quick Start

1. Add configuration to your `package.json`:

```json
{
  "name": "my-monorepo",
  "picker": {
    "pattern": "^\\d{4}-\\d{2}-\\d{2}",
    "workingDirectory": "src",
    "editor": {
      "command": "code",
      "triggers": ["dev"],
      "filePath": "index.ts"
    }
  },
  "scripts": {
    "dev": "monorepo-picker dev",
    "build": "monorepo-picker build",
    "quick-dev": "monorepo-picker -y dev"
  }
}
```

2. Run commands:

```bash
# Interactive selection
picker dev

# Auto-select first package
picker -y build

# List available packages
picker --list
```

## Configuration

All configuration is done through the `picker` field in your `package.json`:

```json
{
  "picker": {
    "packageManager": "auto",
    "pattern": "^\\d{4}-",
    "scanPath": ".",
    "workingDirectory": "src",
    "exclude": ["node_modules", "dist", ".git"],
    "editor": {
      "command": "code",
      "triggers": ["dev", "start"],
      "filePath": "index.ts",
      "enabled": true
    },
    "packages": {
      "special-package": {
        "workingDirectory": ".",
        "editor": {
          "filePath": "README.md"
        }
      }
    }
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `packageManager` | `string` | `"auto"` | Package manager to use (`"auto"`, `"pnpm"`, `"npm"`, `"yarn"`, `"bun"`) |
| `pattern` | `string` | `"^\\d{4}-"` | Regex pattern to match package folder names |
| `scanPath` | `string` | `"."` | Directory to scan for packages |
| `workingDirectory` | `string` | `"src"` | Default working directory for commands |
| `exclude` | `string[]` | `["node_modules", "dist", ".git"]` | Folders to exclude from scanning |
| `editor.command` | `string` | `"code"` | Editor command to run |
| `editor.triggers` | `string[]` | `["dev"]` | Commands that trigger editor opening |
| `editor.filePath` | `string` | `"slides.md"` | File to open (relative to working directory) |
| `editor.enabled` | `boolean` | `true` | Whether to enable editor integration |
| `packages` | `object` | `{}` | Package-specific configuration overrides |

## CLI Usage

```bash
monorepo-picker [options] <command> [args...]

Options:
  -y, --yes       Auto-select the first package without prompting
  -l, --list      List available packages and exit
  -h, --help      Show help message
  -v, --version   Show version number

Examples:
  monorepo-picker dev
  monorepo-picker -y build
  monorepo-picker test --watch
  monorepo-picker --list
```

## Use Cases

### Date-based Packages
Perfect for presentation or project folders organized by date:
```
my-project/
├── 2024-01-15/
├── 2024-02-20/
├── 2024-03-10/
└── package.json
```

### Feature Packages
Great for feature-based monorepos:
```json
{
  "picker": {
    "pattern": "^(feature|package)-",
    "workingDirectory": "."
  }
}
```

### Multi-framework Projects
Works with any project structure:
```
project/
├── frontend-react/
├── frontend-vue/
├── backend-node/
└── mobile-app/
```

## API Usage

You can also use monorepo-picker programmatically:

```typescript
import { pick, listPackages, type PickerConfig } from 'monorepo-picker'

// Custom picker
await pick(['dev'], {
  autoSelect: true,
  config: {
    pattern: '^app-',
    workingDirectory: 'src'
  }
})

// List packages
const packages = await listPackages({
  config: {
    pattern: '^service-'
  }
})
```

## License

MIT © 2024

## Contributing

Contributions welcome! Please read the contributing guidelines first.
