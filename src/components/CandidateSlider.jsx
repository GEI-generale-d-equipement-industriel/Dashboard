import React from 'react';
import Slider from 'react-slick';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components for the slider
const PrevArrow = ({ className, style, onClick }) => (
  <button
    className={className}
    style={{ ...style, display: 'block', background: 'transparent', border: 'none' }}
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <LeftOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
  </button>
);

const NextArrow = ({ className, style, onClick }) => (
  <button
    className={className}
    style={{ ...style, display: 'block', background: 'transparent', border: 'none' }}
    onClick={onClick}
    aria-label="Next Slide"
  >
    <RightOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
  </button>
);

// CandidateFileSlider component
const CandidateFileSlider = ({ files, className }) => {
  if (!files || files.length === 0) {
    return <div className="text-center">No media available</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={`h-full w-full ${className || ''}`}>
      <Slider {...settings}>
        {files.map((file) => {
          if (!file) return null;

          // Use a dynamic base URL
          const baseURL = process.env.REACT_APP_API_BASE_URL ;
          const fileUrl = `${baseURL}/google-drive/file-stream?fileId=${file.fileId}`;

          if (file.contentType && file.contentType.startsWith('image/')) {
            return (
              <div key={file.fileId} className="flex justify-center">
                <img
                  src={file.fileStreamUrl}
                  alt={file.filename || 'Candidate Image'}
                  className="max-w-full h-auto object-contain"
                />
              </div>
            );
          } else if (file.contentType && file.contentType.startsWith('video/')) {
            return (
              <div key={file.fileId} className="flex justify-center">
                <video
                  controls
                  className="max-w-full h-auto object-contain"
                >
                  <source src={file.fileStreamUrl} type={file.contentType} />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          } else {
            return null;
          }
        })}
      </Slider>
    </div>
  );
};

export default CandidateFileSlider;
