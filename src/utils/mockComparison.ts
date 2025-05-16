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
  
  // Generate mock comparison results based on the criteria
  const mockResults = [
    {
      section: 'Payment Terms',
      doc1: 'Net 30 days from invoice date',
      doc2: 'Net 15 days from invoice date'
    },
    {
      section: 'Liability',
      doc1: 'Limited to fees paid in the last 12 months',
      doc2: 'Limited to fees paid in the last 6 months'
    },
    {
      section: 'Termination Clause',
      doc1: '30 days written notice required for termination',
      doc2: '60 days written notice required for termination'
    },
    {
      section: 'Intellectual Property',
      doc1: 'All IP created during the engagement belongs to the Client',
      doc2: 'IP created during the engagement is jointly owned'
    },
    {
      section: 'Confidentiality Period',
      doc1: '5 years after termination',
      doc2: '3 years after termination'
    }
  ];
  
  // If the criteria contains specific keywords, we can tailor the results
  if (criteria.toLowerCase().includes('payment')) {
    return {
      text: mockResults.filter(item => 
        item.section.toLowerCase().includes('payment')
      )
    };
  } else if (criteria.toLowerCase().includes('legal') || criteria.toLowerCase().includes('liability')) {
    return {
      text: mockResults.filter(item => 
        item.section.toLowerCase().includes('liability') || 
        item.section.toLowerCase().includes('termination') ||
        item.section.toLowerCase().includes('intellectual')
      )
    };
  }
  
  // Default: return all results
  return {
    text: mockResults
  };
};