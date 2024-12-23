import React from 'react';
import { Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const CandidateActions = ({ isEditing, handleEditToggle, isFavorite, handleLikeToggle,role }) => {
  const canEdit = role === 'admin';
  return (
    <div className="mt-4 flex justify-center space-x-4">
      {isEditing ? (
        <>
          {canEdit && (
            <>
              <Button type="primary" onClick={handleEditToggle}>
                Save
              </Button>
              <Button onClick={handleEditToggle}>Cancel</Button>
            </>
          )}
        </>
      ) : (
        <>
          {canEdit && (
            <Button type="primary" onClick={handleEditToggle}>
              Edit
            </Button>
          )}
          <Button
            type="primary"
            icon={isFavorite ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
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
