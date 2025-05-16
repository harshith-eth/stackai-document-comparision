import React, { useState } from 'react';
import Button from './Button';
import { Download, Loader2 } from 'lucide-react';
import { ComparisonResult } from '../types';

interface ComparisonResultsProps {
  results: ComparisonResult | null;
  isLoading: boolean;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ results, isLoading }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownload = (format: 'txt' | 'docx' | 'xlsx') => {
    if (!results) return;
    
    // In a real application, this would convert the results to the selected format
    // and trigger a download. For this demo, we'll just log the action.
    console.log(`Downloading results as ${format}`);
    
    // Mock download functionality
    const content = typeof results.text === 'string' 
      ? results.text 
      : JSON.stringify(results.text, null, 2);
      
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparison-results.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowDropdown(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Comparison Results</h2>
        
        {results && !isLoading && (
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setShowDropdown(!showDropdown)}
              icon={<Download className="h-4 w-4" />}
            >
              Download
            </Button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleDownload('txt')}
                  >
                    Download as .txt
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleDownload('docx')}
                  >
                    Download as .docx
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleDownload('xlsx')}
                  >
                    Download as .xlsx
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md min-h-[200px] text-gray-800">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
            <p className="text-gray-500">Analyzing documents...</p>
          </div>
        ) : results ? (
          <div>
            {typeof results.text === 'string' ? (
              <pre className="whitespace-pre-wrap font-mono text-sm">{results.text}</pre>
            ) : (
              <div className="space-y-4">
                {results.text.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                    <h3 className="font-medium text-gray-900 mb-1">{item.section}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Document 1</p>
                        <p className="text-sm">{item.doc1}</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Document 2</p>
                        <p className="text-sm">{item.doc2}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">No comparison results to display</p>
        )}
      </div>
    </div>
  );
};

export default ComparisonResults;