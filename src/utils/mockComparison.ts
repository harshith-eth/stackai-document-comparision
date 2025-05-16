import { ComparisonResult } from '../types';

/**
 * Mock function to simulate document comparison
 * In a real application, this would call an API
 */
export const mockCompareDocuments = async (
  criteria: string,
  doc1: File,
  doc2: File
): Promise<ComparisonResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return empty results
  return {
    text: []
  };
};