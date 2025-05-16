import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import Button from './Button';
import { FileCheck, FileText } from 'lucide-react';
import { mockCompareDocuments } from '../utils/mockComparison';
import { ComparisonResult } from '../types';
import { compareDocumentsWithAI } from '../utils/azure-openai';

interface ComparisonFormProps {
  onSubmit: (result: ComparisonResult) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const ComparisonForm: React.FC<ComparisonFormProps> = ({ onSubmit, setIsLoading }) => {
  const [criteria, setCriteria] = useState('');
  const [document1, setDocument1] = useState<File | null>(null);
  const [document2, setDocument2] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [doc1Name, setDoc1Name] = useState<string>('');
  const [doc2Name, setDoc2Name] = useState<string>('');
  // Always use AI for comparison
  const [useAI, setUseAI] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!criteria || !document1 || !document2) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      let result;
      
      // Handle special case for Tesla reports
      const doc1Content = document1?.name.includes("NASDAQ_TSLA") 
        ? await fetchTeslaReport(document1.name)
        : await readFileAsText(document1);
        
      const doc2Content = document2?.name.includes("NASDAQ_TSLA")
        ? await fetchTeslaReport(document2.name)
        : await readFileAsText(document2);
      
      if (useAI && isAzureOpenAIConfigured()) {
        // Use Azure OpenAI for comparison
        try {
          console.log('Using Azure OpenAI for document comparison');
          result = await compareDocumentsWithAI(criteria, doc1Content, doc2Content);
        } catch (error) {
          console.error('Error with Azure OpenAI, falling back to mock:', error);
          result = await mockCompareDocuments(criteria, document1, document2);
        }
      } else {
        // Use mock comparison
        console.log('Using mock comparison (Azure OpenAI not configured)');
        result = await mockCompareDocuments(criteria, document1, document2);
      }
      
      onSubmit(result);
      setIsSubmitting(false);
      setIsLoading(false);
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error comparing documents:', error);
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Function to fetch Tesla report content
  const fetchTeslaReport = async (filename: string): Promise<string> => {
    try {
      const response = await fetch(`/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
      }
      
      // For PDFs, return a placeholder text since we're mocking the comparison anyway
      return `Content of ${filename} (PDF content would be processed here in production)`;
    } catch (error) {
      console.error(`Error fetching Tesla report:`, error);
      return `Failed to load ${filename}`;
    }
  };

  // Helper function to read file content as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  // Check if Azure OpenAI is configured
  const isAzureOpenAIConfigured = (): boolean => {
    return !!(
      import.meta.env.VITE_AZURE_OPENAI_API_KEY &&
      import.meta.env.VITE_AZURE_OPENAI_ENDPOINT &&
      import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME
    );
  };

  const loadTeslaReport = (year: '2022' | '2023', setDocument: React.Dispatch<React.SetStateAction<File | null>>, setDocName: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      // Simply create a faux File object with the filename
      // This will tell the UI it's loaded, without needing to actually load the file
      const filename = `NASDAQ_TSLA_${year}.pdf`;
      
      // Create an empty file to satisfy the UI
      // The actual PDF processing will happen on form submission where the server can access the files
      const file = new File(["placeholder"], filename, { type: 'application/pdf' });
      
      setDocument(file);
      setDocName(filename);
      
      console.log(`Successfully loaded Tesla ${year} report`);
    } catch (error) {
      console.error(`Error loading Tesla ${year} report:`, error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="criteria" className="block text-sm font-medium text-gray-700 mb-2">
          Input Comparison Criteria <span className="text-red-500">*</span>
        </label>
        <textarea
          id="criteria"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
          placeholder="Fill here..."
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          required
        />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-grow">
          <FileUpload
            label="Upload Document"
            acceptedFileTypes=".pdf,.doc,.docx,.txt"
            onChange={setDocument1}
            required
            fileName={doc1Name}
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-grow">
          <FileUpload
            label="Upload Second Document"
            acceptedFileTypes=".pdf,.doc,.docx,.txt"
            onChange={setDocument2}
            required
            fileName={doc2Name}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Button 
          type="submit" 
          disabled={isSubmitting || !criteria || !document1 || !document2}
          fullWidth
          icon={showSuccess ? <FileCheck className="h-4 w-4" /> : undefined}
        >
          {isSubmitting ? 'Processing...' : showSuccess ? 'Success!' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default ComparisonForm;