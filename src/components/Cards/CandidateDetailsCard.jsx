import React from 'react';
import { Card, Form } from 'antd';
import CandidateTabs from '../Tabs/CandidateTabs';
import CandidateActions from '../../Modules/CandidatesModules/CandidateActions';

const CandidateDetailsCard = ({
  candidate,
  isEditing,
  form,
  handleSave,
  handleEditToggle,
  isFavorite,
  handleLikeToggle,
  bmi,
}) => {
  return (
    <div className="shadow-md p-6 bg-white rounded-lg flex flex-col justify-between h-full">
      {/* Candidate Tabs */}
      <CandidateTabs candidate={candidate} isEditing={isEditing} form={form} bmi={bmi} />

      {/* Actions */}
      <div className="mt-4 flex justify-end space-x-4">
        <CandidateActions
          isEditing={isEditing}
          handleEditToggle={handleEditToggle}
          isFavorite={isFavorite}
          handleLikeToggle={handleLikeToggle}
        />
      </div>
    </div>
  );
};

export default CandidateDetailsCard;
