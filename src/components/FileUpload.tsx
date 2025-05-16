import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  label: string;
  acceptedFileTypes: string;
  onChange: (file: File | null) => void;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  acceptedFileTypes, 
  onChange,
  required = false 
}) => {
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName('');
      onChange(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onChange(file);
      
      // Update the file input for consistency
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 cursor-pointer
          ${isDragging ? 'border-gray-500 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}
          ${fileName ? 'bg-gray-50' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="sr-only"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          ref={fileInputRef}
          required={required}
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          {fileName ? (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500 mt-1">Click to replace</p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">
                Drag and drop or click to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PDF, DOC, DOCX, TXT
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;