// src/Hooks/useCandidates.js
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCandidates } from "../services/api/apiService";

const useCandidates = (filters, pageSize) => {
  // Transform filters to match backend expectations
  const transformedFilters = {
    searchTerm: filters.searchTerm || undefined,
    sortBy: filters.sortBy || "createdAt",  
  sortOrder: filters.sortOrder || "desc",
    ageRange:
      filters.selectedAgeRange !== undefined
        ? `${filters.selectedAgeRange[0]}-${filters.selectedAgeRange[1]}`
        : undefined,
    heightRange:
      filters.selectedHeightRange !== undefined
        ? `${filters.selectedHeightRange[0]}-${filters.selectedHeightRange[1]}`
        : undefined,
    weightRange:
      filters.selectedWeightRange !== undefined
        ? `${filters.selectedWeightRange[0]}-${filters.selectedWeightRange[1]}`
        : undefined,
    sex:
      filters.selectedSex && filters.selectedSex.length > 0
        ? filters.selectedSex.join(",")
        : undefined,
    interests:
      filters.selectedInterests && filters.selectedInterests.length > 0
        ? filters.selectedInterests.join(",")
        : undefined,
    signs:
      filters.selectedSign && filters.selectedSign.length > 0
        ? filters.selectedSign.join(",")
        : undefined,
    veiled: filters.selectedVeilStatus || undefined,
    pregnant: filters.selectedPregnancyStatus || undefined,
    hairColor: filters.selectedHairColor || undefined,
    hairType: filters.selectedHairType || undefined,
    eyeColor: filters.selectedEyeColor || undefined,
    skinColor: filters.selectedSkinColor || undefined,
    facialHair: filters.selectedFacialHair || undefined,
    town: filters.selectedTown || undefined,
    registrationType: filters.selectedRegistrationType || undefined,
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

export default useCandidates;
