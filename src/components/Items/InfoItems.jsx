// src/components/CandidateProfile/InfoItem.jsx
import React from "react";

export default function InfoItem({ label, value }) {
  return (
    <div>
      <span className="font-medium">{label}:</span> {value}
    </div>
  );
}
