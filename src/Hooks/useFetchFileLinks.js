// import { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import isEqual from 'lodash/isEqual';
// import debounce from 'lodash/debounce';

// // Custom hook to fetch file links with caching and debouncing
// const useFetchFileLinks = (candidates) => {
//   const [fileLinks, setFileLinks] = useState({});
//   const url = process.env.REACT_APP_API_BASE_URL || '/api'; // Adjust as needed
//   const cache = useRef({}); // Cache file links between renders

//   const candidateArray = Array.isArray(candidates) ? candidates : [candidates];

//   const fetchFile = async (file, fallback = false) => {
//     try {
//       // Attempt to fetch file metadata using fileId or _id as a fallback
//       const fileIdOrFallback = fallback ? file._id : file.fileId;  
//       const fileMetadata = await axios.get(`${url}/files/download/${fileIdOrFallback}`, {
//         responseType: 'arraybuffer',
//       });

//       if (fileMetadata.data) {
//         const blob = new Blob([fileMetadata.data], { type: fileMetadata.headers['content-type'] });
//         const imageUrl = URL.createObjectURL(blob);

//         return {
//           link: imageUrl,
//           filename: fileMetadata.headers['content-disposition'],
//           contentType: fileMetadata.headers['content-type'],
//         };
//       }
//     } catch (error) {
//       console.error(
//         `Error fetching file metadata for file ${fallback ? '_id' : 'fileId'} :`,
//         error
//       );
//       if (!fallback) {
//         // Try fetching using file._id as a fallback
//         return await fetchFile(file, true);
//       }
//       return null;
//     }
//   };

//   const debouncedFetchFileLinks = useCallback(
//     debounce(async (candidateArray) => {
//       const updatedFileLinks = { ...cache.current }; // Start with cached data

//       const fetchPromises = candidateArray.map(async (candidate) => {
//         if (updatedFileLinks[candidate._id]) {
//           return; // Skip if already cached
//         }

//         if (candidate.files && candidate.files.length > 0) {
//           let candidateFileLinks = []; // Array to store multiple file links

//           for (const file of candidate.files) {
//             const fileLink = await fetchFile(file); // Fetch file with fallback logic
//             if (fileLink) {
//               candidateFileLinks.push(fileLink);
//             }
//           }

//           updatedFileLinks[candidate._id] = candidateFileLinks.length > 0 ? candidateFileLinks : null; // Store as an array
//           cache.current[candidate._id] = updatedFileLinks[candidate._id]; // Cache the result
//         }
//       });

//       // Wait for all fetch promises to resolve
//       await Promise.all(fetchPromises);

//       // Update state only if fileLinks have changed
//       setFileLinks((prevFileLinks) => {
//         if (!isEqual(prevFileLinks, updatedFileLinks)) {
//           return updatedFileLinks;
//         }
//         return prevFileLinks;
//       });
//     }, 500),
//     [url],
//   );

//   useEffect(() => {
//     if (candidateArray && candidateArray.length > 0) {
//       debouncedFetchFileLinks(candidateArray);
//     }
//   }, [candidateArray, debouncedFetchFileLinks]);

//   useEffect(() => {
//     return () => {
//       debouncedFetchFileLinks.cancel();
//     };
//   }, [debouncedFetchFileLinks]);

//   return fileLinks;
// };

// export default useFetchFileLinks;
import { useMemo } from 'react';

// Simplified hook to extract file links directly from candidates
const useFileLinks = (candidates) => {
  return useMemo(() => {
    const fileLinks = {};

    if (candidates && candidates.length > 0) {
      candidates.forEach((candidate) => {
        if (candidate.files && candidate.files.length > 0) {
          // Store the first file's CDN URL as the link for each candidate
          fileLinks[candidate._id] = candidate.files[0]?.filename || null;
        }
      });
    }

    return fileLinks;
  }, [candidates]);
};

export default useFileLinks;
