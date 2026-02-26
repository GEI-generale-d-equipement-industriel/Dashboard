import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CandidateHeader = ({ candidateName }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all font-medium text-sm shadow-xs"
      >
        <ArrowLeftOutlined />
        <span>Retour</span>
      </button>
      {candidateName && (
        <>
          <span className="text-slate-300 font-light text-lg">/</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-base">
            {candidateName}
          </span>
        </>
      )}
    </div>
  );
};

export default CandidateHeader;
