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
    <Card className="bg-white rounded-lg shadow-md">
      <CandidateTabs candidate={candidate} isEditing={isEditing} form={form} bmi={bmi} />
      <div className="mt-4 flex justify-end space-x-4">
        <CandidateActions
          isEditing={isEditing}
          handleSave={handleSave}
          handleEditToggle={handleEditToggle}
          isFavorite={isFavorite}
          handleLikeToggle={handleLikeToggle}
        />
      </div>
    </Card>
  );
};

export default CandidateDetailsCard;
