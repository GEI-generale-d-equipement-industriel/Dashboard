import React from 'react';
import { Col } from 'antd';
import ImageGallery from './ImagesGallery'; // Adjust the import path accordingly

const CandidateImageGallery = ({ imageFiles }) => {
  return (
    <Col xs={24} sm={24} md={12} lg={12} className="flex justify-center">
      <ImageGallery
        images={imageFiles}
        containerStyle={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}
        thumbnailSize={60}
        mainImageHeight={400}
      />
    </Col>
  );
};

export default CandidateImageGallery;
