import React, { useState } from 'react';
import { Button, Modal, Input, notification, Spin } from 'antd';
import { useSelector } from 'react-redux';
import {
  useGetCampaigns,
  useCreateCampaign,
  useDeleteCampaign
} from '../../services/api/campaignService';
import { useNavigate } from 'react-router-dom';

const CampaignList = () => {
  const userId = useSelector((state) => state.auth.id);
  const navigate = useNavigate();
  
  const { data: campaigns = [], isLoading: loadingCampaigns } = useGetCampaigns(userId);
  const { mutate: createCampaign } = useCreateCampaign();
  const { mutate: deleteCampaign } = useDeleteCampaign();

  const [modalVisible, setModalVisible] = useState(false);
  const [campaignName, setCampaignName] = useState('');

  const handleCreateCampaign = () => {
    if (!campaignName.trim()) return;
    createCampaign(
      { userId, name: campaignName.trim() },
      {
        onSuccess: () => {
          notification.success({ message: 'Campaign created successfully' });
          setCampaignName('');
          setModalVisible(false);
        },
        onError: () => {
          notification.error({ message: 'Failed to create campaign' });
        },
      }
    );
  };

  const handleDeleteCampaign = (campaignId) => {
    deleteCampaign(campaignId, {
      onSuccess: () => {
        notification.success({ message: 'Campaign deleted successfully' });
      },
      onError: () => {
        notification.error({ message: 'Could not delete campaign' });
      },
    });
  };

  if (loadingCampaigns) {
    return <Spin tip="Loading campaigns..." style={{ marginTop: 50 }} />;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Collections</h2>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          New Collection
        </Button>
      </div>

      <Modal
        title="Create New Collection"
        visible={modalVisible}
        onOk={handleCreateCampaign}
        onCancel={() => setModalVisible(false)}
        okText="Create"
        cancelText="Cancel"
      >
        <Input
          placeholder="Collection name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
      </Modal>

      {campaigns.length === 0 ? (
        <p>No collections found. Create one above!</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
          {campaigns.map((campaign) => {
            // We'll assume there's a cover image or fallback
            const coverUrl = campaign.coverImageUrl || '/defaultCover.jpg';

            return (
              <div
                key={campaign._id}
                className="relative w-full pb-[100%] bg-gray-200 overflow-hidden group"
                onClick={() => navigate(`/campaigns/${campaign._id}`)}
              >
                <div className="absolute inset-0">
                  <img
                    src={coverUrl}
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Hover overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/40
                      opacity-0
                      group-hover:opacity-100
                      flex
                      items-center
                      justify-center
                      text-white
                      text-center
                      transition-opacity
                    "
                  >
                    <div>
                      <h3 className="font-bold text-lg">{campaign.name}</h3>
                      <p className="mb-2">
                        {campaign.profiles?.length ?? 0} saved
                      </p>
                      <Button
                        danger
                        onClick={() => handleDeleteCampaign(campaign._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
