// src/Hooks/useCandidates.js
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCandidates } from "../services/api/apiService";
import { removeCandidateRequest } from "../services/api/apiService";
import { useMutation, useQueryClient } from '@tanstack/react-query';


const useCandidates = (filters, pageSize) => {
  // Transform filters to match backend expectations
  
  
  const transformedFilters = {
    searchTerm: filters.searchTerm || undefined,
    sortBy: filters.sortBy || "createdAt",
    sortOrder: filters.sortOrder || "desc",
    ageRange: filters.selectedAgeRange ? `${filters.selectedAgeRange[0]}-${filters.selectedAgeRange[1]}` : undefined,
    heightRange: filters.selectedHeightRange ? `${filters.selectedHeightRange[0]}-${filters.selectedHeightRange[1]}` : undefined,
    weightRange: filters.selectedWeightRange ? `${filters.selectedWeightRange[0]}-${filters.selectedWeightRange[1]}` : undefined,
    sex: filters.selectedSex?.length > 0 ? filters.selectedSex.join(",") : undefined,
    interests: filters.selectedInterests?.length > 0 ? filters.selectedInterests.join(",") : undefined,
    signs: filters.selectedSign?.length > 0 ? filters.selectedSign.join(",") : undefined,
    veiled: filters.selectedVeilStatus || undefined,
    pregnant: filters.selectedPregnancyStatus || undefined,
    hairColor: filters.selectedHairColor?.length > 0 ? filters.selectedHairColor.join(",") : undefined,
    hairType: filters.selectedHairType?.length > 0 ? filters.selectedHairType.join(",") : undefined,
    eyeColor: filters.selectedEyeColor?.length > 0 ? filters.selectedEyeColor.join(",") : undefined,
    skinColor: filters.selectedSkinColor?.length > 0 ? filters.selectedSkinColor.join(",") : undefined,
    facialHair: filters.selectedFacialHair?.length > 0 ? filters.selectedFacialHair.join(",") : undefined,
    town: filters.selectedTown || undefined,
    registrationType: filters.selectedRegistrationType || undefined,
    source: filters.selectedSource || undefined,
  };
 
  return useInfiniteQuery({
    queryKey: ["candidates", transformedFilters,],
    queryFn: ({ pageParam = 1 }) =>
      fetchCandidates({ ...transformedFilters, page: pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      
      
      const totalPages = Math.ceil(
        Number(lastPage.meta.total) / Number(lastPage.meta.pageSize)
      );
      const currentPage = Number(lastPage.meta.page);
      const nextPage = currentPage + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    keepPreviousData: false,
  });
};
export const useRemoveCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateId) => removeCandidateRequest(candidateId),
    onSuccess: (data, candidateId) => {
      // If you want to remove them from the local "candidates" list, 
      // or re-fetch it:
      queryClient.invalidateQueries(['candidates']);
      // Or do other cleanup if needed
    },
    onError: (error) => {
      console.error('Error removing candidate:', error);
    },
  });
};
export default useCandidates;
