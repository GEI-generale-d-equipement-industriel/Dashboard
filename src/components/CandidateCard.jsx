// CandidateCard.js

import React,{useState} from 'react';
import { Card, Button, Tooltip, Tag, Divider, Carousel} from 'antd';
import { HeartOutlined, HeartFilled, FrownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const CandidateCard = React.memo(
  ({
    candidate,
    fileLink,
    isFavorite,
    onToggleFavorite,
    tagColors,
  }) => {
    const defaultImage = '/assets/default.jpg';
    const [imageError, setImageError] = useState(false);
    console.log(candidate,'the',fileLink);
    const images =
      fileLink && fileLink[candidate._id] && fileLink[candidate._id].length > 0
        ? fileLink[candidate._id].map((file) => file.webContentLink)
        : [defaultImage];
    const handleImageError = () => {
      setImageError(true);
    };
    return (
      <Card
        hoverable
        cover={
          
            <img
              alt={candidate.firstName}
              src={fileLink || '/assets/default.jpg'}
              className="w-full h-56 object-cover transition duration-300 ease-in-out transform hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-image.jpg';
              }}
              loading="lazy"
            />
          
        }
        className="shadow-lg rounded-lg overflow-hidden"
        bodyStyle={{ padding: '16px' }}
      >
        <Meta
          title={
            <Link
              to={`/candidate/${candidate._id}`}
              className="text-lg font-semibold text-gray-800 hover:text-blue-500"
            >
              {candidate.firstName + ' ' + candidate.name}
            </Link>
          }
          description={
            <div className="mt-2">
              <Divider className="my-2" />
              <div className="flex flex-wrap gap-1">
                {candidate.interest
                  .flatMap((interest) => interest.split(','))
                  .map((interest, index) => (
                    <Tag color={tagColors[index % tagColors.length]} key={index}>
                      {interest.trim()}
                    </Tag>
                  ))}
              </div>
            </div>
          }
        />
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-700 capitalize">
            {candidate.gender}
          </p>
          <Tooltip
            title={
              isFavorite
                ? 'Click to remove from favorites'
                : 'Click to add to favorites'
            }
          >
            <Button
              type="text"
              icon={
                isFavorite ? (
                  <HeartFilled className="text-xl text-red-500" />
                ) : (
                  <HeartOutlined className="text-xl text-gray-500" />
                )
              }
              onClick={() => onToggleFavorite(candidate._id)}
              className="flex items-center hover:text-blue-500 transition-colors duration-300"
            />
          </Tooltip>
        </div>
      </Card>
    );
  },
  // Optional: Provide a custom comparison function
  (prevProps, nextProps) => {
    return (
      prevProps.candidate._id === nextProps.candidate._id &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.fileLink === nextProps.fileLink
    );
  }
);

export default CandidateCard;
