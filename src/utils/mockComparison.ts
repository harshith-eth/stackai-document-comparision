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
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock results based on file types
  return {
    text: [
      {
        section: "Introduction",
        doc1: `This is a mock section from document 1: ${doc1.name}`,
        doc2: `This is a mock section from document 2: ${doc2.name}`,
        changeType: 'modification',
        importance: 'medium'
      },
      {
        section: "Key Points",
        doc1: `Important content from ${doc1.name}`,
        doc2: `Different important content from ${doc2.name}`,
        changeType: 'modification',
        importance: 'high'
      },
      {
        section: "Conclusion",
        doc1: `Conclusion from ${doc1.name}`,
        doc2: `Conclusion from ${doc2.name}`,
        changeType: 'unchanged',
        importance: 'low'
      }
    ]
  };
};