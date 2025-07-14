# Monorepo Picker Example

This example demonstrates how to use monorepo-picker in a real project.

## Project Structure

```
example/
├── package.json          # Root configuration with picker setup
├── 2024-01-15/          # Example package with custom config
│   ├── package.json     # Package scripts
│   └── README.md        # Will open in editor (custom config)
└── 2024-02-20/          # Example package with default config
    └── src/
        ├── package.json # Package scripts
        └── slides.md    # Will open in editor (default config)
```

## Configuration

The root `package.json` contains picker configuration:

- **Pattern**: `^\\d{4}-\\d{2}-\\d{2}` - Matches date-based folders
- **Working Directory**: `src` by default
- **Editor**: Opens VS Code with `slides.md` when running `dev`
- **Package Override**: `2024-01-15` uses root directory and opens `README.md`

## Try It Out

1. Install dependencies:
   ```bash
   cd monorepo-picker
   npm install && npm run build
   cd example
   npm install
   ```

2. List available packages:
   ```bash
   npm run list
   ```

3. Interactive selection:
   ```bash
   npm run dev
   ```

4. Auto-select first package:
   ```bash
   npm run quick-dev
   ```

## Expected Behavior

- Running `npm run dev` will show a picker with both packages
- Selecting `2024-01-15` will run commands in the root directory and try to open `README.md`
- Selecting `2024-02-20` will run commands in the `src` directory and try to open `slides.md`
- The detected package manager will be used automatically
