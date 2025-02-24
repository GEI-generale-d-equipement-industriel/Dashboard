import React from 'react';
import TalentRecruiterForm from '../Forms/TalentRecruiterForm';

const JoinModal = ({ onClose }) => {
  const handleFormSubmit = (formData) => {
    // Process formData as needed...
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm py-8 px-4">
      <div className="flex items-center justify-center min-h-full">
        <div className="relative bg-white w-full max-w-lg p-6 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
            aria-label="Close Talent Recruiter form"
          >
            ✖
          </button>
          <TalentRecruiterForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
};

export default JoinModal;
