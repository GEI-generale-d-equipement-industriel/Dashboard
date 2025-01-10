import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const url = process.env.REACT_APP_API_BASE_URL || '/api';

// Fetch campaigns for a user
export const fetchCampaigns = async (userId) => {
  const { data } = await axios.get(`${url}/campaigns/user/${userId}`);
  return data;
};

export const useGetCampaigns = (userId) => {
    return useQuery({
      queryKey: ['campaigns', userId],
      queryFn: () => fetchCampaigns(userId),
      enabled: !!userId, // or: enabled: Boolean(userId)
    });
  };

// Create a campaign
export const createCampaignRequest = async ({ userId, name }) => {
  const { data } = await axios.post(`${url}/campaigns`, { userId, name });
  return data; // the newly created campaign
};
export const fetchCampaignProfiles = async (campaignId) => {
  const { data } = await axios.get(`${url}/campaigns/${campaignId}/profiles`);
  return data;
};

export const useFetchCampaignProfiles = (campaignId) => {
  return useQuery({
    queryKey: ['campaignProfiles', campaignId],
    queryFn: () => fetchCampaignProfiles(campaignId),
    enabled: !!campaignId, // Ensures the query runs only when campaignId is available
  });
};
export const useCreateCampaign = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: createCampaignRequest,
      onSuccess: (data, variables) => {
        // Invalidate or update the campaign list
        queryClient.invalidateQueries(['campaigns', variables.userId]);
      },
    });
  };

// Delete a campaign
export const deleteCampaignRequest = async (campaignId) => {
  const { data } = await axios.delete(`${url}/campaigns/${campaignId}`);
  return data;
};

export const useDeleteCampaign = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: deleteCampaignRequest,
      onSuccess: (deletedCampaign) => {
        // If your backend returns the deleted campaign doc (including `owner`),
        // you can use that to invalidate:
        const userId = deletedCampaign.owner;
        if (userId) {
          queryClient.invalidateQueries(['campaigns', userId]);
        } else {
          // Otherwise, just invalidate all campaigns
          queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        }
      },
    });
  };
