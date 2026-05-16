import ignore from 'ignore';
import path from 'path';

/**
 * Creates a matcher function from an array of patterns
 * Returns a function that checks if a path should be ignored
 */
export function createIgnoreMatcher(patterns: string[]) {
  const ig = ignore();
  ig.add(patterns);
  
  /**
   * Matcher function - checks if a path should be ignored
   * @param filePath - The full path to check
   * @param rootDir - The root directory (for relative path calculation)
   * @returns true if ignored, false if not
   */
  return (filePath: string, rootDir: string): boolean => {
    // Get path relative to root
    const relativePath = path.relative(rootDir, filePath);
    const normalizedPath = relativePath.replace(/\\/g, '/');
    
    // Never ignore the root itself
    if (normalizedPath === '' || normalizedPath === '.') return false;
    
    // Check if ignored
    return ig.ignores(normalizedPath);
  };
}

/**
 * Convenience function that both parses and creates a matcher
 */
export async function createIgnoreMatcherFromFile(ignoreFilePath: string) {
  const { parseIgnoreFile } = await import('./ignore-parser');
  const patterns = await parseIgnoreFile(ignoreFilePath);
  return createIgnoreMatcher(patterns);
}