import React from 'react';
import { Card, Button, Tooltip, Tag, Divider } from 'antd';
import { HeartOutlined, HeartFilled, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import BmiIndicateur from './BmiIndicateur';

const { Meta } = Card;

const interestShortNames = {
  'Modèle pour shooting en studio': 'Model',
  'Créateur UGC': 'UGC',
  // Optional: Add more mappings if needed
};

const CandidateCard = React.memo(
  ({
    candidate,
    fileLink,
    isFavorite,
    onToggleFavorite,
    tagColors,
  }) => {
    const defaultImage = 'https://res.cloudinary.com/dqtwi6rca/image/upload/v1733126857/cfoimwrcnfty6hoxiusw.jpg';

    const currentYear = new Date().getFullYear();
    const age = currentYear - candidate.birthYear;

    // Calculate BMI
    const weight = parseFloat(candidate.weight);
    const height = parseFloat(candidate.height);
    const bmi = weight / (height * height);

    // Get gender icon
    let genderIcon;
    if (candidate?.gender?.toLowerCase() === 'femme' || candidate?.gender?.toLowerCase() === 'female') {
      genderIcon = <WomanOutlined style={{ color: '#ed64c8', fontSize: '18px' }} />;
    } else if (candidate.gender.toLowerCase() === 'homme' || candidate.gender.toLowerCase() === 'male') {
      genderIcon = <ManOutlined style={{ color: '#1c30e8', fontSize: '18px' }} />;
    } else {
      genderIcon = null;
    }

    
    return (
      <Card
        hoverable
        cover={
          <div className="relative">
            <Link to={`/candidate/${candidate._id}`}>
              <img
                alt={candidate.firstName}
                src={fileLink || defaultImage}
                className="w-full h-40 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105 sm:h-56 md:h-60 lg:h-64"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
                loading="lazy"
              />
            </Link>
            {genderIcon && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                {genderIcon}
              </div>
            )}
          </div>
        }
        className="shadow-md rounded-md overflow-hidden p-2 sm:p-4 text-sm sm:text-base"
         bodyStyle={{ padding: '12px' }}
      >
        <Meta
          title={
            <Link
              to={`/candidate/${candidate._id}`}
              className="text-base font-semibold text-gray-800 hover:text-blue-500 sm:text-lg"
            >
              {candidate.firstName + ' ' + candidate.name}
            </Link>
          }
          description={
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-700 mb-2 sm:text-sm">
                <span>Age: {age}</span>
                <span>Taille: {candidate.height} m</span>
              </div>
              <div className="mb-2">
                <BmiIndicateur bmi={bmi} display={false} />
              </div>
              <Divider className="my-2" />
              <div className="flex flex-wrap gap-1">
                {candidate.interest
                  .flatMap((interest) => interest.split(','))
                  .map((interestItem, index) => {
                    const trimmedInterest = interestItem.trim();
                    const shortInterest =
                      interestShortNames[trimmedInterest] || trimmedInterest;
                    return (
                      <Tag color={tagColors[index % tagColors.length]} key={index} className="text-xs sm:text-sm">
                        {shortInterest}
                      </Tag>
                    );
                  })}
              </div>
            </div>
          }
        />
        <div className="mt-4 flex justify-between items-center">
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
  (prevProps, nextProps) => {
    return (
      prevProps.candidate._id === nextProps.candidate._id &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.fileLink === nextProps.fileLink
    );
  }
);

export default CandidateCard;
