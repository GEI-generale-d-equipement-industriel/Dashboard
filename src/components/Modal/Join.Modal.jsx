import React, { useState } from 'react';
import TalentRecruiterForm from '../Forms/TalentRecruiterForm';

const JoinModal = ({ onClose }) => {
  const [isRecruiterFormVisible, setRecruiterFormVisible] = useState(false);

  const openRecruiterForm = () => setRecruiterFormVisible(true);
  const closeRecruiterForm = () => setRecruiterFormVisible(false);

  /**
   * After form submission, close the Recruiter overlay AND the main JoinModal
   */
  const handleFormSubmit = (formData) => {
    
    // Close the recruiter form overlay
    closeRecruiterForm();
    // Also close the main JoinModal
    onClose();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6">
      {/* Close button for the main JoinModal */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
      >
        ✖
      </button>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Join BeModel as
      </h2>

      {/* Two options: Model or Talent Recruiter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option for Models */}
        <div
          onClick={() => (window.location.href = "https://be-model.tn/form")}
          className="cursor-pointer hover:shadow-xl transition-shadow rounded-lg overflow-hidden bg-white"
        >
          <img
            src="https://res.cloudinary.com/dqtwi6rca/image/upload/v1736177329/artist.png.webp"
            alt="Join as a Model"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 bg-gray-100 text-center">
            <h3 className="text-lg font-semibold text-gray-700">Model</h3>
          </div>
        </div>

        {/* Option for Talent Recruiters */}
        <div
          onClick={openRecruiterForm}
          className="cursor-pointer hover:shadow-xl transition-shadow rounded-lg overflow-hidden bg-white"
        >
          <img
            src="https://res.cloudinary.com/dqtwi6rca/image/upload/v1736177329/recruiter.png.webp"
            alt="Join as a Talent Recruiter"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 bg-gray-100 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Talent Recruiter
            </h3>
          </div>
        </div>
      </div>

      {/* Recruiter Form Overlay */}
      {isRecruiterFormVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm py-8 px-4">
          <div className="flex items-center justify-center min-h-full">
            <div className="relative bg-white w-full max-w-lg p-6 rounded-lg">
              {/* Close button for the Recruiter form overlay */}
              <button
                onClick={closeRecruiterForm}
                className="absolute top-2 right-2 text-gray-500 hover:text-black transition"
              >
                ✖
              </button>

              {/* Pass handleFormSubmit so that both overlays close on submission */}
              <TalentRecruiterForm
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinModal;
