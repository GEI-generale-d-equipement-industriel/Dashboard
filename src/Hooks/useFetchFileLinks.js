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
  const url = process.env.REACT_APP_API_BASE_URL; // Adjust as needed
  const cache = useRef({}); // Use ref to cache file links between renders
  
  useEffect(() => {
    const fetchFileLinks = async () => {
      try {
        const updatedFileLinks = { ...cache.current }; // Start with cached data
        console.log(updatedFileLinks);
        
        await Promise.all(
          candidates.map(async (candidate) => {
            // Skip fetching if already cached
            if (updatedFileLinks[candidate._id]) {
              return;
            }

            if (candidate.files && candidate.files.length > 0) {
              let imageFound = false;

              for (const file of candidate.files) {
                let fileLink = '';
                
                if (typeof file === 'string') {
                  fileLink = file;
                } else if (file.filename) {
                  fileLink = file.filename;
                } else if (file.link) {
                  fileLink = file.link;
                } else {
                  continue; // Skip this file if no valid link found
                }

                // Check if the file is from Google Drive
                if (isValidGoogleDriveUrl(fileLink)) {
                  try {
                    const response = await axios.get(`${url}/google-drive/files`, {
                      params: { link: fileLink },
                    });

                    const imageFiles = response.data.filter(
                      (file) => file.contentType && file.contentType.startsWith('image/')
                    );

                    if (imageFiles.length > 0) {
                      // Cache the first image file
                      updatedFileLinks[candidate._id] = imageFiles[0];
                      cache.current[candidate._id] = imageFiles[0]; // Cache the result
                      imageFound = true;
                      break; // Stop searching after the first image is found
                    }
                  } catch (error) {
                    console.error(
                      `Error fetching files for candidate ${candidate._id}:`,
                      error
                    );
                  }
                }
              }

              if (!imageFound) {
                // Handle candidates with no images if needed
              }
            }
          })
        );

        // Update state only if fileLinks have changed
        setFileLinks((prevFileLinks) => {
          if (!isEqual(prevFileLinks, updatedFileLinks)) {
            return updatedFileLinks;
          }
          return prevFileLinks;
        });
      } catch (error) {
        console.error('Error fetching file links:', error);
      }
    };

    if (candidates.length > 0) {
      fetchFileLinks();
    }
  }, [candidates, url]);

  return fileLinks;
};

export default useFetchFileLinks;
