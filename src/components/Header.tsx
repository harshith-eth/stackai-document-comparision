import React from 'react';
import { FileText, Github } from 'lucide-react';

const Header = () => {
  return (
    <div className="mb-8 relative">
      <div className="absolute top-0 right-0">
        <a 
          href="https://github.com/harshith-eth/stackai-document-comparision" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <Github className="h-4 w-4 mr-2" />
          View on GitHub
        </a>
      </div>
      
      <div className="text-center">
        <p className="text-gray-500 mb-2">Built by Harshith Vaddiparthy</p>
        <div className="flex items-center justify-center mb-2">
          <FileText className="h-8 w-8 mr-2 text-gray-800" />
          <h1 className="text-3xl font-bold text-gray-800">Document Comparison</h1>
        </div>
        <p className="text-gray-500 max-w-lg mx-auto">
          This is a template that I built using Next.js as my application for Stack AI Frontend Engineer Role.
        </p>
      </div>
    </div>
  );
};

export default Header;