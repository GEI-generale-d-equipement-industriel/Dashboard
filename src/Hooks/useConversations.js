// src/hooks/useConversations.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const url = process.env.REACT_APP_API_BASE_URL || '/api';

function getLastActivityDate(conv) {
  if (conv.messages && conv.messages.length > 0) {
    const lastMsg = conv.messages[conv.messages.length - 1];
    return new Date(lastMsg.createdAt).getTime();
  }
  // If no messages, fallback to conversation's own createdAt
  return new Date(conv.createdAt).getTime();
}

// The actual fetcher function
async function fetchConversations(userId) {
  if (!userId) return [];
  
  const response = await axios.get(`${url}/conversations/user/${userId}`);
  let convs = response.data || [];

  // Sort by last message date (descending)
  convs.sort((a, b) => getLastActivityDate(b) - getLastActivityDate(a));

  // Filter out empty conversations if you want
  const nonEmptyConvs = convs.filter(
    (conv) => Array.isArray(conv.messages) && conv.messages.length > 0
  );

  return nonEmptyConvs;
}

// The custom hook
export function useConversations(userId) {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => fetchConversations(userId),
    enabled: !!userId,  // only run if userId is truthy
    staleTime: 1000 * 60, // optional: how long data stays fresh
  });
}
