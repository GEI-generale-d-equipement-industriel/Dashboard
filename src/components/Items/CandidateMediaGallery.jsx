import React, { useState } from "react";
 import { Card, Tabs, Button, Modal } from "antd";
 import { ChevronLeft, ChevronRight, Play, Volume2 } from "lucide-react";

 

 const MediaGallery = ({ candidate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("photos");

  // Filter image files from candidate.files
  const imageFiles = candidate.files
    ? candidate.files
        .filter(
          (file) =>
            file.contentType.startsWith("image/") &&
            !file.filename.includes("video")
        )
        .map((file) => file.filename)
    : [];

  // Filter video files from candidate.files
  const videoFiles = candidate.files
    ? candidate.files
        .filter(
          (file) =>
            file.contentType.startsWith("video/") ||
            file.filename.includes("video")
        )
        .map((file) => ({
          url: file.filename,
          thumbnail:
            file.thumbnail ||
            "https://via.placeholder.com/320x180?text=Video+Thumbnail",
        }))
    : [];

  // For audio, we use candidate.voiceUrl if available
  const audioFiles = candidate.voiceUrl
    ? [
        {
          title: "Enregistrement Audio",
          url: candidate.voiceUrl,
        },
      ]
    : [];

  const nextImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageFiles.length);

  const prevImage = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imageFiles.length) % imageFiles.length
    );

  const tabItems = [
    {
      key: "photos",
      label: `Photos (${imageFiles.length})`,
      children: (
        <Card className="p-6 overflow-hidden bg-white">
          {imageFiles.length > 0 ? (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md mb-4">
                <div
                  className="aspect-square w-full max-w-md overflow-hidden rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={imageFiles[currentIndex]}
                    alt={`${candidate.firstName} ${candidate.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {imageFiles.length > 1 && (
                  <>
                    <Button
                      type="primary"
                      icon={<ChevronLeft />}
                      size="large"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-90 rounded-full shadow-md border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                    />
                    <Button
                      type="primary"
                      icon={<ChevronRight />}
                      size="large"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-90 rounded-full shadow-md border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    />
                  </>
                )}
              </div>

              {imageFiles.length > 1 && (
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  {imageFiles.map((image, index) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        index === currentIndex ? 'ring-2 ring-blue-500' : 'hover:opacity-80'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune image disponible.
            </div>
          )}
        </Card>
      ),
      disabled: imageFiles.length === 0,
    },
    {
      key: "videos",
      label: `Vidéos (${videoFiles.length})`,
      children: (
        <Card className="p-6 bg-white">
          {videoFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoFiles.map((video, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md">
                  <div className="aspect-video relative">
                    <video
                      controls
                      poster={video.thumbnail}
                      className="w-full h-full object-cover"
                    >
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50">
                    <p className="text-sm font-medium">Vidéo {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune vidéo disponible.
            </div>
          )}
        </Card>
      ),
      disabled: videoFiles.length === 0,
    },
    {
      key: "audio",
      label: `Audio (${audioFiles.length})`,
      children: (
        <Card className="p-6 bg-white">
          {audioFiles.length > 0 ? (
            <div className="space-y-4">
              {audioFiles.map((audio, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Volume2 className="w-5 h-5 text-blue-500" />
                    <p className="font-medium">{audio.title}</p>
                  </div>
                  <audio controls className="w-full">
                    <source src={audio.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun enregistrement audio disponible.
            </div>
          )}
        </Card>
      ),
      disabled: audioFiles.length === 0,
    },
  ];

  return (
    <div className="mt-8">
      <Tabs
        defaultActiveKey="photos"
        className="w-full"
        onChange={(key) => setActiveTab(key )}
        items={tabItems}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Média</h2>
        </div>
      </Tabs>

      {/* Lightbox for image viewing */}
      <Modal
        open={lightboxOpen}
        onCancel={() => setLightboxOpen(false)}
        width={"100%"}
        bodyStyle={{ padding: 0, backgroundColor: 'transparent' }}
        wrapClassName="bg-transparent"
        closable={false}
        footer={null}
        centered
      >
        <div className="relative">
          <img
            src={imageFiles[currentIndex]}
            alt={`${candidate.firstName} ${candidate.name} - full size`}
            className="w-full h-auto max-h-[80vh] object-contain"
          />

          {imageFiles.length > 1 && (
            <>
              <Button
                type="primary"
                icon={<ChevronLeft />}
                size="large"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 border-none"
                onClick={prevImage}
              />
              <Button
                type="primary"
                icon={<ChevronRight />}
                size="large"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 border-none"
                onClick={nextImage}
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  );
 };

 export default MediaGallery;