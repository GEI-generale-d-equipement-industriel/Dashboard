// src/components/CandidateProfile/CandidateMediaGallery.jsx
import React from "react";
import CandidateMedia from "./CandidateMedia";
import CandidateImageGallery from "./CandidateImageGallery";
import CandidateImageUploader from "./CandidateImagesUploader";
export default function CandidateMediaGallery({ candidate }) {
  // Filter image files from candidate.files (if any)
  
  
  const imageFiles = candidate.files
    ? candidate.files
        .filter(
          (file) =>
            file.contentType.startsWith("image/") &&
            !file.filename.includes("video")
        )
        .map((file) => file.filename)
    : [];

  // Filter video files from candidate.files (if any)
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

  // For audio, we use candidate.voiceUrl if available.
  const audioFiles = candidate.voiceUrl
    ? [
        {
          title: "Enregistrement Audio",
          url: candidate.voiceUrl,
        },
      ]
    : [];

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 gap-6">
      {/* Candidate Image Gallery */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Galerie Photos</h2>
        <CandidateImageGallery images={imageFiles} candidateId={candidate._id} />
      </div>
      

      {/* Candidate Media Section (videos & audio) */}
      {(videoFiles.length > 0 || audioFiles.length > 0) && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Médias</h2>
          <CandidateMedia videos={videoFiles} audioFiles={audioFiles} />
        </div>
      )}
    </div>
  );
}
