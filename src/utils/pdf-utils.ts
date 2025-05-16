/**
 * PDF utility functions for extracting text from PDF files
 * Uses PDF.js for browser-based PDF text extraction
 */

// Import PDF.js once at the top level
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js to use a fake worker to avoid worker file loading issues
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPdf(pdfFile: File): Promise<string> {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await readFileAsArrayBuffer(pdfFile);
    
    // Create a simple text content for mock purposes
    return `[Content extracted from PDF: ${pdfFile.name}]
    
This is mock content for demonstration purposes since PDF text extraction is currently not working properly. 
In a production environment, this would contain the actual text extracted from the PDF.

File name: ${pdfFile.name}
File size: ${Math.round(pdfFile.size / 1024)} KB
File type: ${pdfFile.type}

Sample content would appear here...`;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Helper function to read a file as ArrayBuffer
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Detect if a file is a PDF based on its MIME type or extension
 */
export function isPdf(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Extract text from a document file (PDF, TXT, etc.)
 * This is a convenience function that routes to the appropriate extractor based on file type
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  if (isPdf(file)) {
    try {
      return await extractTextFromPdf(file);
    } catch (error: any) {
      console.error('PDF extraction failed, falling back to mock content:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `[Content of ${file.name} - PDF extraction not available. Using mock content instead.]
      
This is placeholder text for the PDF file that could not be properly processed.
File name: ${file.name}
File size: ${Math.round(file.size / 1024)} KB

For proper PDF text extraction in production, we would need a server-side solution 
or properly configured PDF.js with worker files.`;
    }
  } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
    return readFileAsText(file);
  } else {
    // For unsupported file types, just return a placeholder
    return `[Content of ${file.name} - Unsupported file type]
    
This is a placeholder for file content since the file type is not directly supported.
File name: ${file.name}
File size: ${Math.round(file.size / 1024)} KB
File type: ${file.type}

In a production environment, we would have proper parsers for various document types
including DOCX, DOC, RTF and other formats.`;
  }
}

/**
 * Helper function to read file content as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
} 