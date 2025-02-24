import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';

const CampaignSelectionModal = ({
  visible,
  onClose,
  campaigns,
  onConfirm,
  onCreateCampaign,
}) => {
  // “list” shows the grid of existing campaigns;
  // “new” shows the campaign creation view.
  const [creationStep, setCreationStep] = useState('list');
  const [newCampaignName, setNewCampaignName] = useState('');

  const handleCreateCampaign = () => {
    if (newCampaignName.trim()) {
      onCreateCampaign(newCampaignName, (newCampaignId) => {
        onConfirm(newCampaignId);
        handleClose();
      });
    }
  };

  // Reset internal state when closing the modal
  const handleClose = () => {
    setCreationStep('list');
    setNewCampaignName('');
    onClose();
  };

  return (
    <Modal
      // When in “new” mode, we show a header with a back button and title.
      title={
        creationStep === 'new' ? (
          <div className="flex items-center">
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => setCreationStep('list')}
              style={{ padding: 0 }}
            />
            <span className="flex-1 text-center">New Campaign</span>
          </div>
        ) : (
          'Select a Campaign'
        )
      }
      open={visible}
      onCancel={handleClose}
      footer={null} // We are handling actions inside the modal content.
    >
      {creationStep === 'list' && (
        <div className="grid grid-cols-3 gap-4 py-4">
          {campaigns?.map((campaign) => (
            <button
              key={campaign._id}
              className="flex flex-col items-center space-y-2 p-4  rounded hover:bg-gray-100"
              onClick={() => {
                onConfirm(campaign._id);
                handleClose();
              }}
            >
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                {/* Optionally, if you have campaign images you could render an <img> here. */}
                <span className="text-xl font-bold">
                  {campaign.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700 truncate text-center">
                {campaign.name}
              </span>
            </button>
          ))}
          <button
            className="flex flex-col items-center justify-center space-y-2 p-4 rounded hover:bg-gray-100"
            onClick={() => setCreationStep('new')}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <PlusOutlined style={{ fontSize: '24px', color: '#aaa' }} />
            </div>
            <span className="text-sm text-gray-700">New Campaign</span>
          </button>
        </div>
      )}

      {creationStep === 'new' && (
        <div className="py-4">
          <Input
            placeholder="Campaign name"
            value={newCampaignName}
            onChange={(e) => setNewCampaignName(e.target.value)}
            className="mb-4"
          />
          <Button
            type="primary"
            onClick={handleCreateCampaign}
            block
            disabled={!newCampaignName.trim()}
          >
            Create Campaign
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default CampaignSelectionModal;
