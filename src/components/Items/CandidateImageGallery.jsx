import React, { useState } from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import CandidateImageUploader from "./CandidateImagesUploader";

export default function CandidateImageGallery({ images, candidateId }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);

  return (
    <div className="relative max-w-xs mx-auto">
      {/* Image Display */}
      {images.length > 0 ? (
        <div className="w-64 h-64 overflow-hidden rounded-lg relative">
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Candidate image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucune image disponible.</p>
      )}

      {/* Navigation Buttons (only if images exist) */}
      {images.length > 1 && (
        <>
          <Button shape="circle" icon={<LeftOutlined />} className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10" onClick={prevImage} />
          <Button shape="circle" icon={<RightOutlined />} className="absolute right-12 top-1/2 transform -translate-y-1/2 z-10" onClick={nextImage} />
        </>
      )}

      {/* Image Index Buttons */}
      <div className="mt-4 flex justify-center space-x-2">
        {images.map((_, index) => (
          <Button key={index} type={index === currentIndex ? "primary" : "default"} size="small" onClick={() => setCurrentIndex(index)}>
            {index + 1}
          </Button>
        ))}
      </div>

      {/* Upload Button */}
      <CandidateImageUploader candidateId={candidateId} />
    </div>
  );
}
