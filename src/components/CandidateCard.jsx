import React, { useState } from 'react';
import { Card, Button, Tooltip, Tag, message } from 'antd';
import { Link } from 'react-router-dom';
import CampaignSelectionModal from './Modal/Campaings.Modal';
import { useUpdateCampaignProfile } from '../services/api/campaignService';
import BmiIndicateur from './BmiIndicateur';
import { ManOutlined,WomanOutlined } from '@ant-design/icons';
import { MdBookmarkBorder,MdBookmarkAdded } from "react-icons/md";
// Mapping for interest names (optional)
const interestShortNames = {
  'Modèle pour shooting': 'Model',
  'Modèle pour shooting en studio':'Model',
  'Créateur UGC': 'UGC',
  // Add more mappings if needed
};

const CandidateCard = React.memo(
  ({
    candidate,
    fileLink,
    isFavorite,         // true if candidate is in any campaign
    tagColors,
    campaigns,
    onCreateCampaign,   // callback for creating new campaigns from the modal
  }) => {
   
    const { mutate: updateCampaignProfile } = useUpdateCampaignProfile();

    // Local state for campaign selection modal visibility
    const [isModalVisible, setModalVisible] = useState(false);

    // Fallback image if none provided
    const defaultImage =
      'https://res.cloudinary.com/dqtwi6rca/image/upload/v1733126857/cfoimwrcnfty6hoxiusw.jpg';


    // Compute candidate stats
    const year=parseInt(candidate?.birthDate?.substring(0,4))
    const currentYear = new Date().getFullYear();
    const age = currentYear - (candidate.birthYear?candidate.birthYear:year || 2000);
    const weight = parseFloat(candidate.weight) || 0;
    const height = parseFloat(candidate.height) || 1;
    const bmi = weight / (height * height);

    /**
     * Clicking the bookmark icon:
     * - If candidate is already in a campaign, remove them.
     * - Otherwise, open the modal so the user can add the candidate.
     */
    const handleBookmarkClick = () => {
      if (isFavorite) {
        removeFromAllCampaigns();
      } else {
        setModalVisible(true);
      }
    };

    const removeFromAllCampaigns = () => {
      const campaignsWithCandidate = campaigns.filter((camp) =>
        camp.profiles?.some(
          (p) => p === candidate._id || p?._id === candidate._id
        )
      );

      if (!campaignsWithCandidate.length) {
        message.warning('Candidate is not in any campaign.');
        return;
      }

      campaignsWithCandidate.forEach((camp) => {
        updateCampaignProfile(
          {
            campaignId: camp._id,
            profileId: candidate._id,
            action: 'remove',
          },
          {
            onSuccess: () => {
              message.success(`Candidate removed from ${camp.name}!`);
              // Optionally invalidate queries via queryClient.invalidateQueries(...)
            },
            onError: () => {
              message.error(`Failed to remove candidate from "${camp.name}".`);
            },
          }
        );
      });
    };

    /**
     * Called when a campaign is chosen in the modal for adding the candidate.
     */
    const handleConfirm = (campaignId) => {
      // Try to find the campaign in the local campaigns list.
      const chosenCampaign = campaigns.find((c) => c._id === campaignId);
      // Proceed with the update regardless of whether it was found locally.
      updateCampaignProfile(
        {
          campaignId,
          profileId: candidate._id,
          action: 'add',
        },
        {
          onSuccess: () => {
            // Display a specific message if we have the campaign's name;
            // otherwise, use a generic message.
            if (chosenCampaign) {
              message.success(`Candidate added to campaign ${chosenCampaign.name}!`);
            } else {
              message.success("Candidate added to the new campaign!");
            }
          },
          onError: () => {
            message.error('Failed to add candidate to campaign.');
          },
        }
      );
      setModalVisible(false);
    };
    


    // Determine the gender icon (using lucide‑react)
    const genderIcon =
      candidate.gender === 'Femme' ? (
        <WomanOutlined className="w-8 h-8 text-pink-500 absolute top-1 left-2 bg-white rounded-full p-2 border" />
      ) : (
        <ManOutlined className="w-8 h-8 text-blue-500 absolute top-1 left-2 bg-white rounded-full p-2 border" />
      );

    return (
      <>
       <Card className="w-full rounded-lg shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between p-2">
            <div className="text-left">
              <Link
                to={`/candidate/${candidate._id}`}
                className="font-bold text-lg text-gray-800 hover:underline"
              >
                {candidate.firstName.charAt(0).toUpperCase()+candidate.firstName.slice(1)} {candidate.name[0].toUpperCase()}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{age} ans</span>
                <span >•</span>
                <span>{height.toFixed(2)} m</span>
                {genderIcon}
              </div>
            </div>
            <Tooltip
              title={
                isFavorite
                  ? "Remove candidate from all campaigns"
                  : "Add candidate to a campaign"
              }
            >
              <Button
                type="text"
                icon={
                  isFavorite ? (
                    <MdBookmarkAdded className="w-8 h-8 text-blue-600" />
                  ) : (
                    <MdBookmarkBorder className="w-8 h-8 text-gray-500" />
                  )
                }
                onClick={handleBookmarkClick}
              />
            </Tooltip>
          </div>

          {/* Candidate Image */}
          <div className="relative w-full h-64">
            <Link to={`/candidate/${candidate._id}`}>
              <img
                src={fileLink || candidate.profileImage || defaultImage}
                alt={`${candidate.firstName} ${candidate.name}'s profile`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </Link>
          </div>

          {/* Footer */}
          <div className="p-4 space-y-2">
            <div className="flex gap-2 sm:flex-nowrap flex-wrap">
              {candidate.interest
                ?.flatMap((interest) => interest.split(","))
                .map((interestItem, index) => {
                  const trimmed = interestItem.trim();
                  const shortInterest =
                    interestShortNames[trimmed] || trimmed;
                  return (
                    <Tag
                      key={index}
                      color={tagColors[index % tagColors.length]}
                      className=" text-xs sm:text-sm  font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-xl sm:rounded-2xl max-w-[80px] sm:max-w-none  "
                    >
                      {shortInterest}
                    </Tag>
                  );
                })}
            </div>
            {/* <div className="flex justify-between items-center">
              <BmiIndicateur bmi={bmi} />
              
            </div> */}
          </div>
        </Card>

        {/* Campaign Selection Modal */}
        <CampaignSelectionModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          campaigns={campaigns}
          onConfirm={handleConfirm}
          onCreateCampaign={onCreateCampaign}
        />

        {/* SEO JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: `${candidate.firstName} ${candidate.name}`,
            image: fileLink || candidate.profileImage || defaultImage,
            jobTitle: candidate.jobTitle || 'Model',
            url: `${window.location.origin}/candidate/${candidate._id}`,
            gender: candidate.gender,
            birthDate: candidate.birthYear
              ? `${candidate.birthYear}-01-01`
              : undefined,
            description: `Age: ${age}, Height: ${height.toFixed(
              2
            )}m, Interests: ${candidate.interest?.join(', ')}`,
          })}
        </script>
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.candidate._id === nextProps.candidate._id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.fileLink === nextProps.fileLink
);

export default CandidateCard;
