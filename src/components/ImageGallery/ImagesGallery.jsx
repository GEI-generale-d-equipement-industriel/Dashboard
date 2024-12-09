import React, { useState } from "react";
import { Modal, Button } from "antd";
import { FileImageOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

const ImageGallery = ({
  images = [],
  containerStyle = {},
  thumbnailSize = 60,
  mainImageHeight = 400,
  onThumbnailClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    if (onThumbnailClick) onThumbnailClick(index);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...containerStyle,
      }}
    >
      {images.length > 0 ? (
        <>
          {/* Main Image Section */}
          <div
            style={{
              width: "100%",
              height: `${mainImageHeight}px`,
              textAlign: "center",
              marginBottom: "16px",
              position: "relative",
            }}
          >
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={handlePrev}
              style={{
                position: "absolute",
                top: "50%",
                left: "0",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "none",
                zIndex: 10,
              }}
              disabled={images.length === 1}
            />
            <img
              src={images[currentSlide]?.filename}
              alt={`Main View ${currentSlide}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => setVisible(true)} // Open modal
            />
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={handleNext}
              style={{
                position: "absolute",
                top: "50%",
                right: "0",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "none",
                zIndex: 10,
              }}
              disabled={images.length === 1}
            />
          </div>

          {/* Thumbnails Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px",
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {images.map((file, index) => (
              <div
                key={index}
                onClick={() => handleThumbnailClick(index)}
                style={{
                  border:
                    currentSlide === index
                      ? "2px solid #1890ff"
                      : "2px solid transparent",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  boxShadow:
                    currentSlide === index
                      ? "0px 4px 6px rgba(24, 144, 255, 0.4)"
                      : "none",
                }}
              >
                <img
                  src={file.filename}
                  alt={`Thumbnail ${index}`}
                  style={{
                    width: `${thumbnailSize}px`,
                    height: `${thumbnailSize}px`,
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Modal for Larger View */}
          <Modal
            visible={visible}
            footer={null}
            onCancel={() => setVisible(false)}
            width="40%"
            centered
          >
            <div style={{ position: "relative" }}>
              {images[currentSlide] && (
                <img
                  src={images[currentSlide].filename}
                  alt={`Modal View ${currentSlide}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              )}
              {/* Modal Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={handlePrev}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "0",
                      transform: "translateY(-50%)",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      border: "none",
                    }}
                  />
                  <Button
                    type="text"
                    icon={<RightOutlined />}
                    onClick={handleNext}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "0",
                      transform: "translateY(-50%)",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      border: "none",
                    }}
                  />
                </> 
              )}
            </div>
          </Modal>
        </>
      ) : (
        <div className="w-full h-80 bg-gray-200 flex flex-col items-center justify-center text-center">
          <FileImageOutlined style={{ fontSize: "48px", color: "#8c8c8c" }} />
          <p style={{ marginTop: "16px", fontSize: "16px", color: "#595959" }}>
            No photos available.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
