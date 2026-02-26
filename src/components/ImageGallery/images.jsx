import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Images = ({ candidate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");

  const imageFiles = candidate.files
    ? candidate.files
        .filter(
          (file) =>
            file.contentType.startsWith("image/") &&
            !file.filename.includes("video")
        )
        .map((file) => file.filename)
    : [];
  
  const maxVisibleThumbnails = 7;
  // const visibleThumbnails = imageFiles.slice(
  //   visibleStartIndex,
  //   visibleStartIndex + maxVisibleThumbnails
  // );

  useEffect(() => {
    if (imageFiles.length === 0) return;

    const centerPosition = currentIndex - Math.floor(maxVisibleThumbnails / 2);
    const newStart = Math.max(
      0,
      Math.min(
        centerPosition,
        imageFiles.length - maxVisibleThumbnails
      )
    );
    
    if (newStart !== visibleStartIndex) {
      setVisibleStartIndex(newStart);
    }
  }, [currentIndex, imageFiles.length,visibleStartIndex]);

  const navigateImage = (direction) => {
    const newIndex = direction === "next" 
      ? Math.min(currentIndex + 1, imageFiles.length - 1)  // Prevent overflow
      : Math.max(currentIndex - 1, 0);                     // Prevent underflow
    
    setSlideDirection(direction === "next" ? "right" : "left");
    setCurrentIndex(newIndex);
  };

  const handleThumbnailClick = (index) => {
    setSlideDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const showNextThumbnails = () => {
    const newStart = Math.min(
      visibleStartIndex + maxVisibleThumbnails,
      imageFiles.length - maxVisibleThumbnails
    );
    const newIndex = Math.min(newStart + 3, imageFiles.length - 1);  // Stay within bounds
    setSlideDirection("right");
    setVisibleStartIndex(newStart);
    setCurrentIndex(newIndex);
  };
  

  const showPrevThumbnails = () => {
    const newStart = Math.max(visibleStartIndex - maxVisibleThumbnails, 0);
    const newIndex = Math.max(newStart + 3, 0);  // Stay within bounds
    setSlideDirection("left");
    setVisibleStartIndex(newStart);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="p-6 overflow-hidden bg-white">
      {imageFiles.length > 0 ? (
        <div className="flex flex-col items-center">
          {/* Main Image Viewer */}
          <div className="relative w-full max-w-md mb-4">
            <div
              className="aspect-square w-full max-w-md overflow-hidden rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={imageFiles[currentIndex]}
                alt={`${candidate.firstName} ${candidate.name}`}
                className={`w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out ${
                  slideDirection === "right" ? "translate-x-2" : "-translate-x-2"
                }`}
                onLoad={() => setSlideDirection("none")}
              />
            </div>

            {imageFiles.length > 1 && (
  <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
    <Button
      type="text"
      icon={<ChevronLeft />}
      className="bg-white/80 hover:bg-white/90 shadow-md rounded-full p-2 backdrop-blur-sm transition-all hover:scale-105 pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation();
        navigateImage("prev");
      }}
      disabled={currentIndex === 0}
    />
    <Button
      type="text"
      icon={<ChevronRight />}
      className="bg-white/80 hover:bg-white/90 shadow-md rounded-full p-2 backdrop-blur-sm transition-all hover:scale-105 pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation();
        navigateImage("next");
      }}
      disabled={currentIndex === imageFiles.length - 1}
    />
  </div>
)}
          </div>

          {/* Thumbnail Navigation */}
          {imageFiles.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 w-full max-w-2xl relative">
              {imageFiles.length > maxVisibleThumbnails && (
                <Button
                  type="text"
                  icon={<ChevronLeft />}
                  onClick={showPrevThumbnails}
                  disabled={visibleStartIndex === 0}
                  className="absolute left-0 -translate-x-full bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
                />
              )}

              <div className="flex gap-2 overflow-hidden flex-1 justify-center">
                <div
                  className={`flex gap-2 transition-transform duration-300 ease-in-out ${
                    slideDirection === "right"
                      ? "translate-x-[-10px]"
                      : "translate-x-[10px]"
                  }`}
                  style={{ transform: `translateX(-${visibleStartIndex * 76}px)` }}
                >
                  {imageFiles.map((image, index) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ease-in-out ${
                        index === currentIndex
                          ? "ring-2 ring-blue-500 scale-105"
                          : "hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {imageFiles.length > maxVisibleThumbnails && (
                <Button
                  type="text"
                  icon={<ChevronRight />}
                  onClick={showNextThumbnails}
                  disabled={visibleStartIndex >= imageFiles.length - maxVisibleThumbnails}
                  className="absolute right-0 translate-x-full bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucune image disponible.
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        open={lightboxOpen}
        onCancel={() => setLightboxOpen(false)}
        width="100%"
        bodyStyle={{ padding: 0 }}
        footer={null}
        centered
      >
        <div className="relative h-[80vh] flex items-center justify-center bg-gray-500">
          <img
            src={imageFiles[currentIndex]}
            alt={`Full size view - ${candidate.firstName} ${candidate.name}`}
            className="max-h-full max-w-full object-contain transition-opacity duration-300"
          />
          
          {imageFiles.length > 1 && (
            <div className="absolute inset-0 flex justify-between items-center px-4">
              <Button
                type="text"
                icon={<ChevronLeft />}
                className="bg-black/30 hover:bg-black/40 text-white rounded-full p-4 backdrop-blur-sm transition-all hover:scale-110"
                onClick={() => navigateImage("prev")}
                disabled={currentIndex === 0}
              />
              <Button
                type="text"
                icon={<ChevronRight />}
                className="bg-black/30 hover:bg-black/40 text-white rounded-full p-4 backdrop-blur-sm transition-all hover:scale-110"
                onClick={() => navigateImage("next")}
                disabled={currentIndex === imageFiles.length - 1}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Images;