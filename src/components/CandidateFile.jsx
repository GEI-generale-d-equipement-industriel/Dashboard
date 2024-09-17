import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CandidateFiles = ({ candidate }) => {
  const [folderFiles, setFolderFiles] = useState([]);
  const extractFileId = (link) => {
    // Check if it's a file link
    const fileMatch = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch && fileMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`; // Convert to direct view link
    }
  
    // Check if it's a folder link
    const folderMatch = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch && folderMatch[1]) {
      return folderMatch[1]; // Return the folder ID
    }
  
    return null;
  };
  
  const handleFileDisplay = (file) => {
    const fileLink = extractFileId(file.filename);

    if (file.filename.includes('/folders/')) {
      // If it's a folder link, fetch the files in that folder
      fetchFilesInFolder(fileLink);
    } else if (file.contentType.startsWith('image/')) {
      // Render image
      return <img key={file._id} src={fileLink} alt={file.filename} className="w-full h-48 object-cover" />;
    } else if (file.contentType.startsWith('video/')) {
      // Render video
      return (
        <video key={file._id} controls className="w-full h-48 object-cover">
          <source src={fileLink} type={file.contentType} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      // Render download link for other file types
      return (
        <a key={file._id} href={fileLink} download className="block">
          Download {file.filename}
        </a>
      );
    }
  };

  const fetchFilesInFolder = async (folderId) => {
    try {
      const response = await axios.get(`http://localhost:3002/google-drive/list-files`, {
        params: { folderId },
      });
      setFolderFiles(response.data); // Store folder files in state
    } catch (error) {
      console.error('Error fetching files from folder:', error);
    }
  };

  return (
    <div>
      {candidate.files.map((file) => (
        <div key={file._id}>
          {handleFileDisplay(file)}
        </div>
      ))}

      {/* Render files from the folder (if any) */}
      {folderFiles.length > 0 && (
        <div>
          <h3>Files from Folder:</h3>
          {folderFiles.map((folderFile) => (
            <div key={folderFile.id}>
              {folderFile.mimeType.startsWith('image/') ? (
                <img src={folderFile.webViewLink} alt={folderFile.name} className="w-full h-48 object-cover" />
              ) : folderFile.mimeType.startsWith('video/') ? (
                <video controls className="w-full h-48 object-cover">
                  <source src={folderFile.webViewLink} type={folderFile.mimeType} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <a href={folderFile.webContentLink} download>
                  Download {folderFile.name}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateFiles;
