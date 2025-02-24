// src/hooks/useUserProfile.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authInterceptorInstance from "../services/auth/AuthInterceptor";

/**
 * Hook to fetch a user with their linked candidate profile.
 * @param {string} userId - The ID of the user.
 */
export const useUserWithLinkedCandidate = (userId) => {
  const axiosInstance = authInterceptorInstance.getInstance();

  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      // If your interceptor already returns response.data, no need to destructure
      return await axiosInstance.get(`/user/full-profile/${userId}`);
    },
    enabled: !!userId, // Only run if userId is truthy.
  });
};

/**
 * Hook to update a user profile.
 * @returns Mutation object with a mutate function.
 */
export const useUpdateUserProfile = () => {
  const axiosInstance = authInterceptorInstance.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updateData }) => {
      const response = await axiosInstance.put(`/user/update-profile/${userId}`, updateData);
      return response // Return updated data
    },
    onSuccess: (data, variables) => {
      // Update local state and invalidate cache to fetch fresh data
      queryClient.setQueryData(['userProfile', variables.userId], (oldData) => ({
        ...oldData,
        linkedCandidateId: data, // Ensure correct update
      }));
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    },
  });
};
