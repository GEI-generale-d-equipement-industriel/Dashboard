import { useQueryClient } from '@tanstack/react-query';

const useHandleRemoveCandidate = (updateCandidates) => {
  const queryClient = useQueryClient();

  const handleRemoveCandidate = (candidateId, candidates, cacheKey, callbacks) => {
    const updatedCandidates = candidates.filter((candidate) => candidate._id !== candidateId);
    queryClient.setQueryData(cacheKey, updatedCandidates);

    updateCandidates(
      { candidateId, action: 'remove' },
      {
        onSuccess: callbacks.onSuccess,
        onError: () => {
          queryClient.setQueryData(cacheKey, candidates);
          callbacks.onError();
        },
      }
    );
  };

  return handleRemoveCandidate;
};

export default useHandleRemoveCandidate;
