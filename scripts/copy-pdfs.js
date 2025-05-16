/**
 * This script copies PDF files from the root directory to the public directory
 * so they can be served by the Vite development server
 */

import { readdir, copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, resolve } from 'path';

async function copyPdfFiles() {
  try {
    const rootDir = resolve('.');
    const publicDir = join(rootDir, 'public');
    
    // Ensure public directory exists
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
      console.log(`Created public directory: ${publicDir}`);
    }
    
    // Read all files in the root directory
    const files = await readdir(rootDir);
    
    // Filter PDF files
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      console.log('No PDF files found in the root directory.');
      return;
    }
    
    console.log(`Found ${pdfFiles.length} PDF files:`);
    
    // Copy each PDF file to the public directory
    for (const pdfFile of pdfFiles) {
      const sourcePath = join(rootDir, pdfFile);
      const destinationPath = join(publicDir, pdfFile);
      
      await copyFile(sourcePath, destinationPath);
      console.log(`✓ Copied ${pdfFile} to public directory`);
    }
    
    console.log('All PDF files have been copied to the public directory.');
  } catch (error) {
    console.error('Error copying PDF files:', error);
    process.exit(1);
  }
}

// Execute the function
copyPdfFiles(); 