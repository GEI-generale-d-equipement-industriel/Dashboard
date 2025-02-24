import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const CandidateGrid = ({
  candidates = [],
  fileLinks = {},
  onRemoveCandidate,
  emptyMessage = 'No candidates found.',
  title = 'Candidates',
}) => {
  const [notificationApi, contextHolder] = notification.useNotification();

  const handleRemove = useCallback(
    (candidateId) => {
      if (onRemoveCandidate) {
        onRemoveCandidate(candidateId, {
          onSuccess: () =>
            notificationApi.success({
              message: 'Removed from Favorites',
              description: 'This candidate has been removed successfully.',
              placement: 'topRight',
              duration: 2,
            }),
          onError: () =>
            notificationApi.error({
              message: 'Action Failed',
              description: 'An error occurred. Please try again.',
              placement: 'topRight',
              duration: 2,
            }),
        });
      }
    },
    [onRemoveCandidate, notificationApi]
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      {contextHolder}
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {/* If no candidates, show message; otherwise, show grid */}
        {candidates.length === 0 ? (
          <p className="text-center">{emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
            {candidates.map((candidate) => {
              const link = fileLinks[candidate._id];

              return (
                <div
                  key={candidate._id}
                  className="relative w-full pb-[100%] bg-gray-200 overflow-hidden group"
                >
                  {/* Full-area Link for navigation */}
                  <Link
                    to={`/candidate/${candidate._id}`}
                    className="absolute inset-0 z-10 block w-full h-full"
                  />

                  {/* Candidate image or fallback */}
                  {link ? (
                    <img
                      src={link}
                      alt={candidate.name || 'Candidate'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-500 flex items-center justify-center text-white text-sm">
                      {candidate.name || 'No Image'}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/40
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      flex
                      items-center
                      justify-center
                      pointer-events-none
                      z-30
                    "
                  >
                    {/* Delete button */}
                    <Button
                      icon={<DeleteOutlined style={{ fontSize: '1.2rem' }} />}
                      shape="circle"
                      className="pointer-events-auto border-white text-gray hover:bg-gray/20"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent Link click
                        handleRemove(candidate._id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

CandidateGrid.propTypes = {
  candidates: PropTypes.array.isRequired,
  fileLinks: PropTypes.object,
  onRemoveCandidate: PropTypes.func,
  emptyMessage: PropTypes.string,
  title: PropTypes.string,
};

export default React.memo(CandidateGrid);
