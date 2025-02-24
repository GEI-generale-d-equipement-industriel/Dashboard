import React from 'react';
import { useParams,useLocation } from 'react-router-dom';
import { Spin, Button,notification } from 'antd';
import { useFetchCampaignProfiles,useUpdateCampaignProfile } from '../services/api/campaignService';
import CandidateGrid from '../components/Cards/CandidateGrid';
import { useNavigate } from 'react-router-dom';
import useFileLinks from '../Hooks/useFetchFileLinks';
import queryString from 'query-string';
import useHandleRemoveCandidate from '../Hooks/useHandleRemoveCandidate';
const CampaignsPage = () => {
  const { campaignId } = useParams();
  const location = useLocation(); // This gives you access to the query string
  const { source } = queryString.parse(location.search); 
  const { data: profiles = [], isLoading, error } = useFetchCampaignProfiles(campaignId);
  const { mutate: updateCampaignProfiles } = useUpdateCampaignProfile();
 
  const handleRemoveCandidate = (profileId) => {
    if (!campaignId || !profileId) {
      notification.error({
        message: 'Error',
        description: 'Invalid campaign or profile ID.',
      });
      return;
    }

    updateCampaignProfiles(
      { campaignId, profileId, action: 'remove' },
      {
        onSuccess: () => {
          notification.success({
            message: 'Removed Successfully',
            description: 'The candidate has been removed from the campaign.',
          });
        },
        onError: () => {
          notification.error({
            message: 'Remove Failed',
            description: 'An error occurred while removing the candidate.',
          });
        },
      }
    );
  };
const fileLinks = useFileLinks(profiles);
const navigate = useNavigate();
  if (isLoading) return <Spin tip="Loading profiles..." />;
  if (error) return <p>Error loading campaign profiles.</p>;
  
  
  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{source}</h1>
        <Button onClick={() => navigate(-1)} type="default">
          Go Back
        </Button>
      </div>

      <CandidateGrid
        candidates={profiles}
        fileLinks={fileLinks}
        onRemoveCandidate={(profileId) => handleRemoveCandidate(profileId)}
        // title={source}
        emptyMessage="No profiles found in this campaign."
      />
    </div>
  );
};

export default CampaignsPage;
