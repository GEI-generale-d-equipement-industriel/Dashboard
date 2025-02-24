import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';



const CandidateHeader = ({ candidateName }) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        type="text"
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-2 text-lg text-blue-600 hover:text-blue-800 transition-all"
      >
        <ArrowLeftOutlined />
        <span className="font-medium">Go Back</span>
      </Button>
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
        {candidateName}
      </h1>
      <div className="border-b border-gray-300 mb-4"></div>
    </>
  );
};

export default CandidateHeader;
