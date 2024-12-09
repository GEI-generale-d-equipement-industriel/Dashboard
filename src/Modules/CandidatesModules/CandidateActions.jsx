import React from 'react';
import { Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const CandidateActions = ({ isEditing, handleEditToggle, isFavorite, handleLikeToggle }) => {
  return (
    <div className="mt-4 flex justify-center space-x-4">
      {isEditing ? (
        <>
          <Button type="primary" onClick={handleEditToggle}>
            Save
          </Button>
          <Button onClick={handleEditToggle}>Cancel</Button>
        </>
      ) : (
        <>
          <Button type="primary" onClick={handleEditToggle}>
            Edit
          </Button>
          <Button
            type="primary"
            icon={isFavorite ? '❤️' : '🤍'}
            onClick={handleLikeToggle}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </>
      )}
    </div>
  );
};

export default CandidateActions;
