import React, { useState } from 'react';
import FileUpload from './FileUpload';
import Button from './Button';
import { FileCheck } from 'lucide-react';
import { mockCompareDocuments } from '../utils/mockComparison';
import { ComparisonResult } from '../types';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!criteria || !document1 || !document2) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // In a real application, you would upload the files and send the criteria
      // to your backend API. For this demo, we'll use a mock function.
      console.log('Submitting comparison with criteria:', criteria);
      console.log('Document 1:', document1);
      console.log('Document 2:', document2);
      
      // Simulate API delay
      setTimeout(async () => {
        const result = await mockCompareDocuments(criteria, document1, document2);
        onSubmit(result);
        setIsSubmitting(false);
        setIsLoading(false);
        
        // Show success animation
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }, 2000);
    } catch (error) {
      console.error('Error comparing documents:', error);
      setIsSubmitting(false);
      setIsLoading(false);
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
      
      <FileUpload
        label="Upload Document"
        acceptedFileTypes=".pdf,.doc,.docx,.txt"
        onChange={setDocument1}
        required
      />
      
      <FileUpload
        label="Upload Second Document"
        acceptedFileTypes=".pdf,.doc,.docx,.txt"
        onChange={setDocument2}
        required
      />
      
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