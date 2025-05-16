import React from 'react';
import Header from './components/Header';
import ComparisonForm from './components/ComparisonForm';
import { useState, useEffect } from 'react';
import { ComparisonResult } from './types';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from './components/ui/resizable';
import { Copy, Download, FileText } from 'lucide-react';

// Enhanced comparison type to handle different types of changes
interface EnhancedComparisonItem {
  section: string;
  doc1: string;
  doc2: string;
  changeType?: 'addition' | 'deletion' | 'modification' | 'unchanged';
  importance?: 'high' | 'medium' | 'low';
}

function App() {
  // Initialize with mock data for demo purposes
  const [results, setResults] = useState<{ text: EnhancedComparisonItem[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  // Always show all items by default
  const selectedView = 'all';

  // Load sample data automatically for demo purposes
  useEffect(() => {
    const loadSampleData = async () => {
      setIsLoading(true);
      
      // Simulate loading delay
      setTimeout(async () => {
        // Initialize with empty results
        const emptyResult = {
          text: []
        };
        
        setResults(emptyResult);
        setIsLoading(false);
      }, 1000);
    };
    
    loadSampleData();
  }, []);

  const handleCopy = () => {
    if (!results) return;
    
    let content = "# Document Comparison Results\n\n";
    
    results.text.forEach(item => {
      content += `## ${item.section}\n\n`;
      content += `**Document 1:** ${item.doc1}\n\n`;
      content += `**Document 2:** ${item.doc2}\n\n`;
      content += `---\n\n`;
    });
    
    navigator.clipboard.writeText(content)
      .then(() => {
        console.log('Content copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy content: ', err);
      });
  };

  const handleDownload = (format: 'txt' | 'docx' | 'xlsx' | 'pdf' | 'html' | 'csv' | 'json' | 'md') => {
    if (!results) return;
    
    let content = '';
    let mimeType = 'text/plain';
    
    // Prepare content based on format
    if (format === 'json') {
      content = JSON.stringify(results.text, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      // Create CSV content for structured data
      content = 'Section,Change Type,Importance,Document 1,Document 2\n';
      results.text.forEach(item => {
        content += `"${item.section}","${item.changeType || 'unknown'}","${item.importance || 'unknown'}","${item.doc1}","${item.doc2}"\n`;
      });
      mimeType = 'text/csv';
    } else if (format === 'html') {
      // Create a more detailed HTML representation
      content = `
<!DOCTYPE html>
<html>
<head>
  <title>Document Comparison Results</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    .comparison-item { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }
    .section-header { background: #f5f5f5; padding: 10px 15px; font-weight: bold; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; }
    .item-content { display: flex; }
    .doc-column { flex: 1; padding: 15px; border-right: 1px solid #eee; }
    .doc-column:last-child { border-right: none; }
    .doc-label { font-size: 12px; color: #666; margin-bottom: 5px; }
    .importance-high { border-left: 4px solid #333333; }
    .importance-medium { border-left: 4px solid #555555; }
    .importance-low { border-left: 4px solid #777777; }
    .change-addition { background-color: #f5f5f5; }
    .change-deletion { background-color: #e0e0e0; }
    .change-modification { background-color: #eeeeee; }
    .summary { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin-right: 5px; background: #f0f0f0; color: #333333; }
    .badge-high { background: #333333; color: #ffffff; }
    .badge-medium { background: #555555; color: #ffffff; }
    .badge-low { background: #777777; color: #ffffff; }
  </style>
</head>
<body>
  <h1>Document Comparison Results</h1>
  
  <div class="summary">
    <h3>Summary of Changes</h3>
    <p>
      <span class="badge badge-high">High Priority: ${results.text.filter(i => i.importance === 'high').length}</span>
      <span class="badge badge-medium">Medium Priority: ${results.text.filter(i => i.importance === 'medium').length}</span>
      <span class="badge badge-low">Low Priority: ${results.text.filter(i => i.importance === 'low').length}</span>
    </p>
    <p>
      <span class="badge">Additions: ${results.text.filter(i => i.changeType === 'addition').length}</span>
      <span class="badge">Deletions: ${results.text.filter(i => i.changeType === 'deletion').length}</span>
      <span class="badge">Modifications: ${results.text.filter(i => i.changeType === 'modification').length}</span>
      <span class="badge">Unchanged: ${results.text.filter(i => i.changeType === 'unchanged').length}</span>
    </p>
  </div>
`;

      results.text.forEach(item => {
        const importanceClass = item.importance ? `importance-${item.importance}` : '';
        const changeClass = item.changeType ? `change-${item.changeType}` : '';
        
        content += `
  <div class="comparison-item ${importanceClass} ${changeClass}">
    <div class="section-header">
      <div>${item.section}</div>
      <div>
        ${item.changeType ? `<span class="badge">${item.changeType}</span>` : ''}
        ${item.importance ? `<span class="badge badge-${item.importance}">${item.importance}</span>` : ''}
      </div>
    </div>
    <div class="item-content">
      <div class="doc-column">
        <div class="doc-label">Document 1</div>
        <div>${item.doc1 || '<em>No content</em>'}</div>
      </div>
      <div class="doc-column">
        <div class="doc-label">Document 2</div>
        <div>${item.doc2 || '<em>No content</em>'}</div>
      </div>
    </div>
  </div>
`;
      });
      
      content += `
</body>
</html>`;
      mimeType = 'text/html';
    } else if (format === 'md') {
      // Create markdown representation
      content = '# Document Comparison Results\n\n';
      content += '## Summary\n\n';
      content += `- High Priority Changes: ${results.text.filter(i => i.importance === 'high').length}\n`;
      content += `- Medium Priority Changes: ${results.text.filter(i => i.importance === 'medium').length}\n`;
      content += `- Low Priority Changes: ${results.text.filter(i => i.importance === 'low').length}\n\n`;
      content += `- Additions: ${results.text.filter(i => i.changeType === 'addition').length}\n`;
      content += `- Deletions: ${results.text.filter(i => i.changeType === 'deletion').length}\n`;
      content += `- Modifications: ${results.text.filter(i => i.changeType === 'modification').length}\n`;
      content += `- Unchanged: ${results.text.filter(i => i.changeType === 'unchanged').length}\n\n`;
      
      results.text.forEach(item => {
        content += `## ${item.section}\n\n`;
        if (item.changeType) content += `**Change Type:** ${item.changeType}\n\n`;
        if (item.importance) content += `**Importance:** ${item.importance}\n\n`;
        content += `### Document 1\n\n${item.doc1 || '*No content*'}\n\n`;
        content += `### Document 2\n\n${item.doc2 || '*No content*'}\n\n`;
        content += `---\n\n`;
      });
      
      mimeType = 'text/markdown';
    } else {
      // Default text format
      content = "DOCUMENT COMPARISON RESULTS\n\n";
      
      content += "SUMMARY:\n";
      content += `- High Priority Changes: ${results.text.filter(i => i.importance === 'high').length}\n`;
      content += `- Medium Priority Changes: ${results.text.filter(i => i.importance === 'medium').length}\n`;
      content += `- Low Priority Changes: ${results.text.filter(i => i.importance === 'low').length}\n\n`;
      content += `- Additions: ${results.text.filter(i => i.changeType === 'addition').length}\n`;
      content += `- Deletions: ${results.text.filter(i => i.changeType === 'deletion').length}\n`;
      content += `- Modifications: ${results.text.filter(i => i.changeType === 'modification').length}\n`;
      content += `- Unchanged: ${results.text.filter(i => i.changeType === 'unchanged').length}\n\n`;
      
      results.text.forEach(item => {
        content += `----------------\n`;
        content += `SECTION: ${item.section}\n`;
        if (item.changeType) content += `CHANGE TYPE: ${item.changeType}\n`;
        if (item.importance) content += `IMPORTANCE: ${item.importance}\n`;
        content += `\nDOCUMENT 1:\n${item.doc1 || '[No content]'}\n\n`;
        content += `DOCUMENT 2:\n${item.doc2 || '[No content]'}\n\n`;
      });
    }
      
    const blob = new Blob([content], { type: mimeType });
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

  // Filter results based on selected view
  const getFilteredResults = () => {
    if (!results) return [];
    if (selectedView === 'all') return results.text;
    return results.text.filter(item => item.changeType !== 'unchanged');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col py-8 px-4">
      <div className="w-full max-w-7xl mx-auto mb-8">
        <Header />
      </div>
      
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="p-6 h-full overflow-y-auto">
            <ComparisonForm 
              onSubmit={(result) => setResults(result as any)} 
              setIsLoading={setIsLoading}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={60}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Comparison Results</h2>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  title="Copy results"
                >
                  <Copy className="h-5 w-5" />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    title="Download results"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span>Download</span>
                    <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 max-h-96 overflow-y-auto" style={{ right: 0 }}>
                      <div className="py-1">
                        <div className="px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Documents</div>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDownload('txt')}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> Plain text (.txt)
                        </button>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDownload('docx')}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> Microsoft Word (.docx)
                        </button>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDownload('pdf')}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> PDF Document (.pdf)
                        </button>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDownload('md')}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> Markdown (.md)
                        </button>
                        
                        <div className="px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Spreadsheets</div>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDownload('xlsx')}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> Microsoft Excel (.xlsx)
                        </button>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDownload('csv')}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> CSV Spreadsheet (.csv)
                        </button>
                        
                        <div className="px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Web & Data</div>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDownload('html')}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> HTML Document (.html)
                        </button>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDownload('json')}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> JSON Data (.json)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Enhanced comparison results display */}
            <div className="bg-gray-50 rounded-md text-gray-800 overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <div className="h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-500">Analyzing documents...</p>
                </div>
              ) : results ? (
                <div>
                  {/* Simple text area for displaying content */}
                  <div className="border border-gray-200 rounded-md shadow-sm">
                    <div className="p-3 bg-gray-100 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Document Comparison</h3>
                    </div>
                    <div className="h-[500px] overflow-y-auto p-4 bg-white">
                      <textarea 
                        className="w-full h-full p-4 border border-gray-200 rounded-md resize-none focus:outline-none"
                        placeholder="Enter text here..."
                        readOnly
                        value={results.text.map(item => 
                          `${item.section}\n\nDocument 1:\n${item.doc1 || 'No content'}\n\nDocument 2:\n${item.doc2 || 'No content'}\n\n---\n\n`
                        ).join('')}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-gray-400 mb-2">No comparison results to display yet</p>
                  <p className="text-xs text-gray-400">Upload two documents and submit to see the comparison</p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;