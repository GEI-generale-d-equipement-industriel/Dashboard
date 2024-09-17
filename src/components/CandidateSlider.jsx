import React from 'react';
import Slider from 'react-slick';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components for the slider
const PrevArrow = ({ className, style, onClick }) => (
  <LeftOutlined className={className} style={{ ...style, color: 'gray', fontSize: '16px', zIndex: 1 }} onClick={onClick} />
);

const NextArrow = ({ className, style, onClick }) => (
  <RightOutlined className={className} style={{ ...style, color: 'gray', fontSize: '16px', zIndex: 1 }} onClick={onClick} />
);

// CandidateFileSlider component
const CandidateFileSlider = ({ files, className }) => {
    console.log(files,'from the slider');
    
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
    <div className={`h-full w-full ${className || ''}`}> {/* Accepting className as props */}
      <Slider {...settings}>
        {files.map((file) => {
          if (!file) return null;

          const fileUrl = `http://localhost:3002/google-drive/file-stream?fileId=${file.fileId}`;

          if (file.contentType && file.contentType.startsWith('image/')) {
            return (
              <img
                key={file.fileId}
                src={fileUrl}
                alt={file.filename}
                className="w-full h-96 object-contain"
              />
            );
          } else if (file.contentType && file.contentType.startsWith('video/')) {
            return (
              <video
                key={file.fileId}
                controls
                className="w-full h-96 object-contain"
              >
                <source src={fileUrl} type={file.contentType} />
                Your browser does not support the video tag.
              </video>
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
