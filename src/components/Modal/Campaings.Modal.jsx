import React, { useState } from 'react';
import { Modal } from 'antd';
import { ArrowLeft, Plus } from 'lucide-react';

const CampaignSelectionModal = ({
  visible,
  onClose,
  campaigns,
  onConfirm,
  onCreateCampaign,
}) => {
  // "list" shows the existing campaigns; "new" shows the creation form.
  const [creationStep, setCreationStep] = useState('list');
  const [newCampaignName, setNewCampaignName] = useState('');

  const handleClose = () => {
    setCreationStep('list');
    setNewCampaignName('');
    onClose();
  };

  const handleCreateCampaign = (event) => {
    event?.preventDefault();
    const name = newCampaignName.trim();
    if (!name) return;
    onCreateCampaign(name, (newCampaignId) => {
      onConfirm(newCampaignId);
      handleClose();
    });
  };

  const title =
    creationStep === 'new' ? (
      <div className="bm-modal-title">
        <button
          type="button"
          className="bm-icon-btn"
          onClick={() => setCreationStep('list')}
          aria-label="Retour"
        >
          <ArrowLeft size={18} />
        </button>
        <span>Nouvelle campagne</span>
      </div>
    ) : (
      <div className="bm-modal-title">
        <span>Ajouter à une campagne</span>
      </div>
    );

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={520}
      className="bm-modal"
    >
      {creationStep === 'list' && (
        <div className="bm-campaigns">
          {campaigns?.map((campaign) => (
            <button
              key={campaign._id}
              type="button"
              className="bm-campaign"
              onClick={() => {
                onConfirm(campaign._id);
                handleClose();
              }}
            >
              <span className="bm-campaign__badge">{campaign.name.charAt(0).toUpperCase()}</span>
              <span className="bm-campaign__name">{campaign.name}</span>
              <span className="bm-campaign__count">
                {campaign.profiles?.length || 0} profil{(campaign.profiles?.length || 0) > 1 ? 's' : ''}
              </span>
            </button>
          ))}
          <button
            type="button"
            className="bm-campaign bm-campaign--new"
            onClick={() => setCreationStep('new')}
          >
            <span className="bm-campaign__badge">
              <Plus size={20} />
            </span>
            <span className="bm-campaign__name">Nouvelle campagne</span>
          </button>
        </div>
      )}

      {creationStep === 'new' && (
        <form className="bm-form" onSubmit={handleCreateCampaign}>
          <label className="bm-form__label" htmlFor="bm-campaign-name">
            Nom de la campagne
          </label>
          <input
            id="bm-campaign-name"
            className="bm-input"
            placeholder="Ex. Lancement été 2026"
            value={newCampaignName}
            onChange={(event) => setNewCampaignName(event.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="bm-btn bm-btn--primary bm-btn--block"
            disabled={!newCampaignName.trim()}
          >
            Créer et ajouter
          </button>
        </form>
      )}
    </Modal>
  );
};

export default CampaignSelectionModal;
