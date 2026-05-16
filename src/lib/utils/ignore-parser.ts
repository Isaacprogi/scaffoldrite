import fs from 'fs/promises';

/**
 * Parses a .gitignore-style file and returns an array of patterns
 * Handles comments, empty lines, and trailing spaces automatically
 */
export async function parseIgnoreFile(filePath: string): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Split into lines, trim, remove comments and empty lines
    const patterns = content
      .split(/\r?\n/)           // Split by newline
      .map(line => line.trim()) // Remove whitespace
      .filter(line => {          // Filter out:
        if (!line) return false;      // Empty lines
        if (line.startsWith('#')) return false; // Comments
        return true;
      });
    
    return patterns;
  } catch (error) {
    // File doesn't exist - return empty array
    return [];
  }
}

/**
 * Synchronous version for when you need it
 */
export function parseIgnoreFileSync(filePath: string): string[] {
  try {
    const fsSync = require('fs');
    const content = fsSync.readFileSync(filePath, 'utf-8');
    
    return content
      .split(/\r?\n/)
      .map((line:any) => line.trim())
      .filter((line:any) => line && !line.startsWith('#'));
  } catch {
    return [];
  }
}