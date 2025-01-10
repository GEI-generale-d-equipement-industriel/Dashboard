import React from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Row, Col, Button } from 'antd';
import { useFetchCampaignProfiles } from '../services/api/campaignService';
import CandidateCard from '../components/CandidateCard';
import { useNavigate } from 'react-router-dom';
const CampaignsPage = () => {
  const { campaignId } = useParams();
  const { data: profiles = [], isLoading, error } = useFetchCampaignProfiles(campaignId);

const navigate = useNavigate();
  if (isLoading) return <Spin tip="Loading profiles..." />;
  if (error) return <p>Error loading campaign profiles.</p>;
  const tagColors = ["orange", "red", "purple", "gold"];
  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Profiles in Campaign</h2>
        <Button onClick={() => navigate(-1)} type="default">Back to Campaigns</Button>
      </div>
      {profiles.length === 0 ? (
        <p>No profiles found in this campaign.</p>
      ) : (
        <Row gutter={[16, 24]}>
          {profiles.map((profile) => (
            <Col key={profile._id} xs={24} sm={12} md={8} lg={6}>
              <CandidateCard candidate={profile}  tagColors= {tagColors}/>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CampaignsPage;
