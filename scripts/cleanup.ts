/**
 * Cleanup and Optimization Script
 * Automated code cleanup and optimization tools
 */

import fs from 'fs';
import path from 'path';

interface CleanupReport {
  filesScanned: number;
  filesOptimized: number;
  duplicatesRemoved: number;
  unusedImportsRemoved: number;
  sizeBefore: number;
  sizeAfter: number;
}

class CodeCleaner {
  private report: CleanupReport = {
    filesScanned: 0,
    filesOptimized: 0,
    duplicatesRemoved: 0,
    unusedImportsRemoved: 0,
    sizeBefore: 0,
    sizeAfter: 0
  };

  // Remove unused imports
  removeUnusedImports(content: string): string {
    const lines = content.split('\n');
    const usedImports = new Set<string>();
    const importLines: number[] = [];

    // Find all import statements
    lines.forEach((line, index) => {
      if (line.trim().startsWith('import ')) {
        importLines.push(index);
      }
    });

    // Simple unused import detection (basic implementation)
    return lines
      .filter((line, index) => {
        if (importLines.includes(index)) {
          // Check if import is used in the file
          const importMatch = line.match(/import\s+{([^}]+)}/);
          if (importMatch) {
            const imports = importMatch[1].split(',').map(imp => imp.trim());
            const usedInFile = imports.some(imp => 
              content.includes(imp) && content.split(imp).length > 2
            );
            return usedInFile;
          }
        }
        return true;
      })
      .join('\n');
  }

  // Consolidate imports from same source
  consolidateImports(content: string): string {
    const lines = content.split('\n');
    const importMap = new Map<string, string[]>();
    const nonImportLines: string[] = [];

    lines.forEach(line => {
      const match = line.match(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/);
      if (match) {
        const [, imports, source] = match;
        const importList = imports.split(',').map(imp => imp.trim());
        
        if (importMap.has(source)) {
          importMap.get(source)!.push(...importList);
        } else {
          importMap.set(source, importList);
        }
      } else if (!line.trim().startsWith('import ') || line.includes('export')) {
        nonImportLines.push(line);
      }
    });

    // Reconstruct with consolidated imports
    const consolidatedImports = Array.from(importMap.entries()).map(
      ([source, imports]) => {
        const uniqueImports = [...new Set(imports)].sort();
        return `import { ${uniqueImports.join(', ')} } from '${source}';`;
      }
    );

    return [...consolidatedImports, '', ...nonImportLines].join('\n');
  }

  // Remove duplicate interface definitions
  removeDuplicateInterfaces(content: string): string {
    const interfaceRegex = /interface\s+(\w+)\s*{[^}]*}/g;
    const interfaces = new Map<string, string>();
    let matches;

    while ((matches = interfaceRegex.exec(content)) !== null) {
      const [fullMatch, interfaceName] = matches;
      if (!interfaces.has(interfaceName)) {
        interfaces.set(interfaceName, fullMatch);
      }
    }

    // Remove duplicates
    let cleaned = content;
    const interfaceNames = Array.from(interfaces.keys());
    
    interfaceNames.forEach(name => {
      const regex = new RegExp(`interface\\s+${name}\\s*{[^}]*}`, 'g');
      const matches = content.match(regex);
      if (matches && matches.length > 1) {
        // Keep only the first occurrence
        let first = true;
        cleaned = cleaned.replace(regex, (match) => {
          if (first) {
            first = false;
            return match;
          }
          return '';
        });
        this.report.duplicatesRemoved++;
      }
    });

    return cleaned;
  }

  // Optimize component structure
  optimizeComponent(content: string): string {
    // Move interfaces to top
    const interfaceRegex = /interface\s+\w+\s*{[^}]*}/g;
    const interfaces = content.match(interfaceRegex) || [];
    
    // Remove interfaces from original content
    const withoutInterfaces = content.replace(interfaceRegex, '');
    
    // Find component declaration
    const componentMatch = withoutInterfaces.match(/(const|function)\s+\w+.*?=>/);
    if (componentMatch) {
      const beforeComponent = withoutInterfaces.substring(0, componentMatch.index);
      const afterComponent = withoutInterfaces.substring(componentMatch.index!);
      
      return [
        beforeComponent,
        ...interfaces,
        '',
        afterComponent
      ].join('\n');
    }

    return content;
  }

  // Process a single file
  processFile(filePath: string): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const originalSize = content.length;
      
      let optimized = content;
      optimized = this.removeUnusedImports(optimized);
      optimized = this.consolidateImports(optimized);
      optimized = this.removeDuplicateInterfaces(optimized);
      optimized = this.optimizeComponent(optimized);
      
      const optimizedSize = optimized.length;
      
      if (optimized !== content) {
        fs.writeFileSync(filePath, optimized, 'utf8');
        this.report.filesOptimized++;
        this.report.sizeBefore += originalSize;
        this.report.sizeAfter += optimizedSize;
        return true;
      }
      
      this.report.sizeBefore += originalSize;
      this.report.sizeAfter += originalSize;
      return false;
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      return false;
    }
  }

  // Process directory recursively
  processDirectory(dirPath: string): void {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        this.processDirectory(fullPath);
      } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(item)) {
        this.report.filesScanned++;
        this.processFile(fullPath);
      }
    });
  }

  // Generate report
  generateReport(): CleanupReport {
    const sizeSaved = this.report.sizeBefore - this.report.sizeAfter;
    const percentageSaved = this.report.sizeBefore > 0 
      ? ((sizeSaved / this.report.sizeBefore) * 100).toFixed(2)
      : '0';

    console.log('\n🧹 CLEANUP REPORT');
    console.log('================');
    console.log(`📁 Files scanned: ${this.report.filesScanned}`);
    console.log(`✨ Files optimized: ${this.report.filesOptimized}`);
    console.log(`🗑️  Duplicates removed: ${this.report.duplicatesRemoved}`);
    console.log(`📦 Size before: ${(this.report.sizeBefore / 1024).toFixed(2)} KB`);
    console.log(`📦 Size after: ${(this.report.sizeAfter / 1024).toFixed(2)} KB`);
    console.log(`💾 Space saved: ${(sizeSaved / 1024).toFixed(2)} KB (${percentageSaved}%)`);
    console.log('================\n');

    return this.report;
  }

  // Main cleanup function
  cleanup(sourcePath: string = './src'): CleanupReport {
    console.log('🚀 Starting code cleanup and optimization...\n');
    this.processDirectory(sourcePath);
    return this.generateReport();
  }
}

// Export for use in build scripts
export { CodeCleaner };

// CLI usage
if (require.main === module) {
  const cleaner = new CodeCleaner();
  const sourcePath = process.argv[2] || './src';
  cleaner.cleanup(sourcePath);
}
