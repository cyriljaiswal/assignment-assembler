import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function App() {
  const [files, setFiles] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Handle dropped files
  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    }
  });

  // Handle removing a file before compiling
  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  // Send to Python Backend
  const handleCompile = async () => {
    if (files.length === 0) return;
    setIsCompiling(true);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post('http://172.20.10.8:5000/assemble', formData, {
        responseType: 'blob', // Important: tells axios we are receiving a file
      });

      // Force browser to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Final_Assignment.pdf');
      document.body.appendChild(link);
      link.click();
      
      // Clear the canvas after success
      setFiles([]);
    } catch (error) {
      console.error("Failed to compile:", error);
      alert("Error compiling PDF. Is your Python backend running?");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10 font-sans">
      <h1 className="text-4xl font-bold mb-2 text-blue-400">Assignment Assembler</h1>
      <p className="text-gray-400 mb-8">Drag images and PDFs to instantly merge them into one document.</p>

      {/* Drag and Drop Zone */}
      <div 
        {...getRootProps()} 
        className={`w-full max-w-2xl p-10 border-4 border-dashed rounded-xl cursor-pointer transition-all text-center
          ${isDragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-xl font-semibold text-blue-400">Drop the files right here...</p>
        ) : (
          <p className="text-xl text-gray-300">Drag & drop files here, or click to select files</p>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Files to Merge (Top to Bottom)</h2>
          <ul className="space-y-3 mb-8">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow">
                <span className="truncate pr-4">{index + 1}. {file.name}</span>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 font-bold px-3 py-1 bg-red-900/30 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Compile Button */}
          <button 
            onClick={handleCompile}
            disabled={isCompiling}
            className={`w-full py-4 rounded-xl text-xl font-bold transition-all
              ${isCompiling 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}`}
          >
            {isCompiling ? 'Stitching PDF...' : 'Compile to PDF'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;