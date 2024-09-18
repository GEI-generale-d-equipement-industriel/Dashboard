// src/hooks/useFetchFileLinks.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import isEqual from 'lodash/isEqual';

// Function to validate Google Drive URLs
const isValidGoogleDriveUrl = (url) => {
  const driveFileRegex = /^(https:\/\/)?(www\.)?(drive|docs)\.google\.com\/(file\/d\/|drive\/folders\/|open\?id=)[\w-]+/;
  return driveFileRegex.test(url);
};

const useFetchFileLinks = (candidates) => {
  const [fileLinks, setFileLinks] = useState({});
  const url = process.env.REACT_APP_API_BASE_URL; // Adjust as needed
  

  useEffect(() => {
    const fetchFileLinks = async () => {
      try {
        const updatedFileLinks = {};

        await Promise.all(
          candidates.map(async (candidate) => {
            
            
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
                  continue; // Skip this file
                }

                if (isValidGoogleDriveUrl(fileLink)) {
                  try {
                    const response = await axios.get(`${url}/google-drive/files`, {
                      params: { link: fileLink },
                    });

                    const imageFiles = response.data.filter(
                      (file) => file.contentType && file.contentType.startsWith('image/')
                    );

                    if (imageFiles.length > 0) {
                      // Store the first image file
                      updatedFileLinks[candidate._id] = imageFiles[0];
                      imageFound = true;
                      break; // Exit the loop since we found an image
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
                // Optionally handle candidates with no images
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
        console.error('Error in fetchFileLinks:', error);
      }
    };

    if (candidates.length > 0) {
      fetchFileLinks();
    }
  }, [candidates]);

  return fileLinks;
};

export default useFetchFileLinks;

