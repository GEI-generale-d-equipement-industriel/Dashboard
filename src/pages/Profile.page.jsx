import React, { useState, useEffect } from "react";
import {  Button,  Spin } from "antd";
import { Edit, Save, X } from "lucide-react";
import DisplayMode from "../components/Items/DisplayMode";
import EditMode from "../components/Items/EditMode";
import CandidateMediaGallery from "../components/Items/CandidateMediaGallery";
import Avatar from "../components/Items/Avatar";
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
    <div className="container max-w-5xl mx-auto p-4 md:p-6 mb-16">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar 
                firstName={candidate.firstName} 
                lastName={candidate.name}
                size="lg" 
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {candidate.firstName} {candidate.name}
                </h1>
                <p className="text-gray-500">{candidate.town}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-auto">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Annuler</span>
                  </Button>
                  <Button 
                    onClick={saveChanges} 
                    className="gap-2"
                    disabled={updateMutation.isLoading}
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Sauvegarder</span>
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={toggleEdit}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
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
        </div>
      </div>

      {/* Media Gallery */}
      <CandidateMediaGallery candidate={candidate} />
    </div>
  );
}
