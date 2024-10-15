import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import isEqual from 'lodash/isEqual';

// Function to validate Google Drive URLs
const isValidGoogleDriveUrl = (url) => {
  const driveFileRegex =
    /^(https:\/\/)?(www\.)?(drive|docs)\.google\.com\/(file\/d\/|drive\/folders\/|open\?id=)[\w-]+/;
  return driveFileRegex.test(url);
};

// Custom hook to fetch file links with caching
const useFetchFileLinks = (candidates) => {
  
  const [fileLinks, setFileLinks] = useState({});
  const url = process.env.REACT_APP_API_BASE_URL || '/api'; // Adjust as needed
  const cache = useRef({}); // Use ref to cache file links between renders
  const candidateArray = Array.isArray(candidates) ? candidates : [candidates];
  useEffect(() => {
    const fetchFileLinks = async () => {
      const updatedFileLinks = { ...cache.current }; // Start with cached data

      // Prepare an array to handle all fetch promises
      const fetchPromises = candidateArray.map(async (candidate) => {
        if (updatedFileLinks[candidate._id]) {
          return; // Skip if already cached
        }

        if (candidate.files && candidate.files.length > 0) {
          let imageFound = false;

          for (const file of candidate.files) {
            let fileLink = file.filename || file.link || '';

            if (isValidGoogleDriveUrl(fileLink)) {
              // Fetch from Google Drive
              try {
                const response = await axios.get(`${url}/google-drive/files`, {
                  params: { link: fileLink },
                });

                const imageFiles = response.data.filter(
                  (file) => file.contentType && file.contentType.startsWith('image/')
                );

                if (imageFiles.length > 0) {
                  updatedFileLinks[candidate._id] = imageFiles[0];
                  cache.current[candidate._id] = imageFiles[0]; // Cache the result
                  imageFound = true;
                  break; // Stop after first image found
                }
              } catch (error) {
                console.error(`Error fetching Google Drive files for candidate ${candidate._id}:`, error);
              }
            } else {
              // Fetch from local server
              try {
                const fileMetadata = await axios.get(`${url}/files/download/${file._id}`, {
                  responseType: 'arraybuffer', // Ensure response is treated as binary data
              });
                
                
                if (fileMetadata.data) {
                  const blob = new Blob([fileMetadata.data], { type: fileMetadata.headers['content-type'] });
                  const imageUrl = URL.createObjectURL(blob);
                  updatedFileLinks[candidate._id] = {
                    link: imageUrl,
                    filename: fileMetadata.data.filename,
                    contentType: fileMetadata.headers['content-type'],
                  };
                  cache.current[candidate._id] = updatedFileLinks[candidate._id]; // Cache the result
                  imageFound = true;
                  break; // Stop after first file found
                }
              } catch (error) {
                console.error(`Error fetching local file metadata for candidate ${candidate._id}:`, error);
                // You can set a fallback or handle errors gracefully
              }
            }
          }

          if (!imageFound) {
            updatedFileLinks[candidate._id] = null; // Handle candidates with no images if needed
          }
        }
      });

      // Wait for all fetch promises to resolve
      await Promise.all(fetchPromises);

      // Update state only if fileLinks have changed
      setFileLinks((prevFileLinks) => {
        if (!isEqual(prevFileLinks, updatedFileLinks)) {
          return updatedFileLinks;
        }
        return prevFileLinks;
      });
    };
    ;
    
    if (candidates) {
      
      fetchFileLinks();
    }
  }, [candidates, url,candidateArray]);

  return fileLinks;
};

export default useFetchFileLinks;
