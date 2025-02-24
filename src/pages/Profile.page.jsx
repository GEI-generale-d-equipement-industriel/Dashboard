import React, { useState, useEffect } from "react";
import { Avatar, Button, Card, Spin } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

import DisplayMode from "../components/Items/DisplayMode";
import EditMode from "../components/Items/EditMode";
import CandidateMediaGallery from "../components/Items/CandidateMediaGallery";
import { useParams } from "react-router-dom"; 
import { useUserWithLinkedCandidate, useUpdateUserProfile } from "../Hooks/useUserPRofile";

export default function CandidateProfile() {
  const { userId: Id } = useParams();

  const { data: user, isLoading, error } = useUserWithLinkedCandidate(Id);
  const updateMutation = useUpdateUserProfile();

  // Local state for edit mode and candidate profile data
  const [isEditing, setIsEditing] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [initialCandidate, setInitialCandidate] = useState(null); // Store initial state

  useEffect(() => {
    if (user && user.linkedCandidateId) {
      setCandidate(user.linkedCandidateId);
      setInitialCandidate(user.linkedCandidateId); // Store initial state when fetched
    }
  }, [user]);

  const toggleEdit = () => {
    if (!isEditing) {
      setInitialCandidate({ ...candidate }); // ✅ Store initial state before editing
    }
    setIsEditing((prev) => !prev);
  };

  // Handler for input changes
  const handleInputChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  // Handler for Ant Design Selects, Radio, Switch, etc.
  const handleSelectChange = (name, value) => {
    setCandidate({ ...candidate, [name]: value });
  };

  // Handler for switch changes
  const handleSwitchChange = (name, checked) => {
    setCandidate({ ...candidate, [name]: checked });
  };

  // Save changes
  const saveChanges = () => {
    updateMutation.mutate(
      { userId: Id, updateData: candidate },
      {
        onSuccess: (updatedCandidate) => {
          setCandidate(updatedCandidate); // ✅ Update local state with new data
          setIsEditing(false); // ✅ Exit edit mode
        },
      }
    );
  };

  // Cancel edit and restore initial state
  const handleCancel = () => {
    setCandidate(initialCandidate); // Restore initial state
    setIsEditing(false); // Exit edit mode
  };

  if (isLoading) return <Spin tip="Loading profile..." />;
  if (error) return <div>Error loading profile: {error.message}</div>;
  if (!candidate) return <div>No candidate profile available</div>;


  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto" bordered={false}>
        <Card
          title={
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-8">
                <Avatar size={64}>
                  {candidate.firstName ? candidate.firstName[0].toUpperCase() : "?"}
                  {candidate.name ? candidate.name[0].toUpperCase() : "?"}
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">
                    {candidate.firstName} {candidate.name}
                  </h1>
                  <p className="text-gray-500">{candidate.town}</p>
                </div>
              </div>
              <Button 
  type="default" 
  shape="circle" 
  onClick={() => (isEditing ? saveChanges() : toggleEdit())} // ✅ Calls saveChanges() if editing
>
  {isEditing ? <SaveOutlined /> : <EditOutlined />}
</Button>
            </div>
          }
          bordered={false}
        >
          {isEditing ? (
            <EditMode
              candidate={candidate}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
            />
          ) : (
            <DisplayMode candidate={candidate} />
          )}
        </Card>

        {/* Footer Buttons for Saving & Canceling */}
        {isEditing && (
          <div className="flex justify-end mt-4 space-x-4">
            <Button type="default" onClick={handleCancel} icon={<CloseOutlined />}>
              Annuler
            </Button>
            <Button type="primary" onClick={saveChanges} loading={updateMutation.isLoading} icon={<SaveOutlined />}>
              Sauvegarder les modifications
            </Button>
          </div>
        )}
      </Card>
      <CandidateMediaGallery candidate={candidate} />
    </div>
  );
}
