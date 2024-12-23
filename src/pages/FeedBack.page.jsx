import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'react-lottie';
import { Button } from 'antd';
import animationData from '../animations/construction.json'; // Path to your Lottie animation

const FeedBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle the "Go Back" button
  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/'); // Default to home if no previous location
    }
  };

  // Lottie animation configuration
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Lottie Animation */}
      <div style={{ width: 300, height: 300 }}>
        <Lottie options={defaultOptions} />
      </div>

      {/* Page Title and Subtitle */}
      <h1 className="text-3xl font-bold text-gray-700 mt-8">
        Feature Under Construction
      </h1>
      <p className="text-gray-500 text-lg text-center max-w-lg mt-4">
        This page or feature is still being updated. Please check back later. 
        Thank you for your patience!
      </p>

      {/* Go Back Button */}
      <Button
        type="primary"
        size="large"
        onClick={handleGoBack}
        style={{ marginTop: 24, backgroundColor: '#1890ff', borderRadius: '8px' }}
      >
        Go Back
      </Button>
    </div>
  );
};

export default FeedBack;
