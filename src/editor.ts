import fs from 'node:fs/promises'
import path from 'node:path'
import { execa } from 'execa'
import { type Package } from './types.js'

/**
 * Check if editor command is available
 */
export async function isEditorAvailable(command: string): Promise<boolean> {
  try {
    await execa('which', [command], { stdout: 'ignore', stderr: 'ignore' })
    return true
  } catch {
    try {
      // For Windows, try where command
      await execa('where', [command], { stdout: 'ignore', stderr: 'ignore' })
      return true
    } catch {
      return false
    }
  }
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Open file in editor
 */
export async function openInEditor(
  editorCommand: string,
  filePath: string,
  background: boolean = true
): Promise<void> {
  try {
    const available = await isEditorAvailable(editorCommand)
    if (!available) {
      console.warn(`Editor command '${editorCommand}' not found, skipping editor opening`)
      return
    }

    const exists = await fileExists(filePath)
    if (!exists) {
      console.warn(`File ${filePath} does not exist, skipping editor opening`)
      return
    }

    console.log(`Opening ${filePath} with ${editorCommand}`)

    if (background) {
      // Run in background, don't wait for it to finish
      execa(editorCommand, [filePath], {
        detached: true,
        stdio: 'ignore'
      })
    } else {
      await execa(editorCommand, [filePath])
    }
  } catch (error) {
    console.warn(`Failed to open editor: ${error}`)
  }
}

/**
 * Handle editor opening for package and command
 */
export async function handleEditorOpen(
  pkg: Package,
  args: string[]
): Promise<void> {
  const { editor } = pkg

  // Check if editor is enabled
  if (!editor.enabled) {
    return
  }

  // Check if command is in triggers
  const command = args[0]
  if (!command || !editor.triggers?.includes(command)) {
    return
  }

  // Build file path
  const filePath = path.join(pkg.workingDirectory, editor.filePath!)

  // Open in editor
  await openInEditor(editor.command!, filePath, true)
}
