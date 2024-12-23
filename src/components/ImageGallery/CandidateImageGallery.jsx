import React from 'react';
import ImageGallery from './ImagesGallery'; // Adjust the import path accordingly

const CandidateImageGallery = ({ imageFiles }) => {
  return (
    <div style={{ width: '120%', maxWidth: '600px' }}>
      <ImageGallery
        images={imageFiles}
        containerStyle={{ width: '100%' }}
        thumbnailSize={60}
        mainImageHeight={500} // Fixed height for stability
      />
    </div>
  );
};

export default CandidateImageGallery;
