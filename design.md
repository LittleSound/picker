# Monorepo Picker 配置设计

## 配置结构

在 `package.json` 中添加 `picker` 字段：

```json
{
  "name": "my-monorepo",
  "picker": {
    "packageManager": "auto",
    "pattern": "^\\d{4}-",
    "scanPath": ".",
    "workingDirectory": "src",
    "exclude": ["node_modules", "dist", ".git"],
    "editor": {
      "command": "code",
      "triggers": ["dev"],
      "filePath": "slides.md",
      "enabled": true
    },
    "packages": {
      "2025-07-12": {
        "workingDirectory": ".",
        "editor": {
          "filePath": "README.md"
        }
      }
    }
  }
}
```

## 配置说明

### 全局配置

- `packageManager`: 包管理器，支持 `"auto"`, `"pnpm"`, `"npm"`, `"yarn"`, `"bun"`
- `pattern`: 文件夹匹配的正则表达式，用于自动发现子包
- `scanPath`: 扫描路径，默认为当前目录 `"."`
- `workingDirectory`: 默认工作目录，命令会在这个目录下执行
- `exclude`: 排除的文件夹，避免扫描不必要的目录

### 编辑器配置

- `editor.command`: 编辑器命令，默认 `"code"`
- `editor.triggers`: 触发打开编辑器的命令列表
- `editor.filePath`: 要打开的文件路径（相对于包的工作目录）
- `editor.enabled`: 是否启用编辑器功能

### 包特定配置

`packages` 对象可以为特定的包提供覆盖配置。

## 使用示例

```bash
# 交互式选择包并运行 dev 命令
npx monorepo-picker dev

# 自动选择最新包运行 build
npx monorepo-picker -y build

# 运行多个参数的命令
npx monorepo-picker test --watch
```

## TypeScript 类型定义

```typescript
interface PickerConfig {
  packageManager?: 'auto' | 'pnpm' | 'npm' | 'yarn' | 'bun'
  pattern?: string
  scanPath?: string
  workingDirectory?: string
  exclude?: string[]
  editor?: EditorConfig
  packages?: Record<string, PackageConfig>
}

interface EditorConfig {
  command?: string
  triggers?: string[]
  filePath?: string
  enabled?: boolean
}

interface PackageConfig {
  workingDirectory?: string
  editor?: Partial<EditorConfig>
}
```
