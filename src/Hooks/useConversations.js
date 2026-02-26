// src/hooks/useConversations.js
import { useQuery,useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useSocket } from './useSocket';

const url = process.env.REACT_APP_API_BASE_URL || '/api';

// function getLastActivityDate(conv) {
//   if (conv.messages && conv.messages.length > 0) {
//     const lastMsg = conv.messages[conv.messages.length - 1];
//     return new Date(lastMsg.createdAt).getTime();
//   }
//   // If no messages, fallback to conversation's own createdAt
//   return new Date(conv.createdAt).getTime();
// }

export const sortConversations = (convs) => {
  const getLastActivity = (conv) => {
    if (conv.messages?.length > 0) {
      return new Date(conv.messages[conv.messages.length - 1].createdAt).getTime();
    }
    return new Date(conv.createdAt).getTime();
  };
  
  return [...convs].sort((a, b) => getLastActivity(b) - getLastActivity(a));
};
// The actual fetcher function
async function fetchConversations(userId) {
  if (!userId) return [];
  
  const response = await axios.get(`${url}/conversations/user/${userId}`);
  return sortConversations(response.data || []);
}

// The custom hook
export function useConversations(userId) {
  const queryClient = useQueryClient();
  const { socket } = useSocket(); // Get socket instance from centralized hook

  const { data: conversations = [], ...queryInfo } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => fetchConversations(userId),
    enabled: !!userId,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    select: (data) => {
  return data.map(conv => ({
    ...conv,
    lastMessage: conv.messages?.[conv.messages.length - 1]?.text || '',
    updatedAt: conv.messages?.[conv.messages.length - 1]?.createdAt || conv.createdAt
  }));
    }
  });

  // WebSocket integration using centralized socket
  useEffect(() => {
    if (!userId || !socket) return;

    const handleMessage = (newMessage) => {
      queryClient.setQueryData(['conversations', userId], (old) => {
        const updated = old.map(conv => {
          if (conv._id === newMessage.conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: newMessage.text,
              updatedAt: newMessage.createdAt
            };
          }
          return conv;
        });
        return sortConversations(updated);
      });
    };

    const handleConversationUpdate = () => {
      queryClient.invalidateQueries(['conversations', userId]);
    };

    socket.on('receiveMessage', handleMessage);
    socket.on('conversationUpdated', handleConversationUpdate);

    return () => {
      socket.off('receiveMessage', handleMessage);
      socket.off('conversationUpdated', handleConversationUpdate);
    };
  }, [userId, queryClient, socket]);

  // Rest of the hook remains unchanged
  const optimisticUpdate = async (config) => {
    await queryClient.cancelQueries(['conversations', userId]);
    
    const previous = queryClient.getQueryData(['conversations', userId]);
    
    queryClient.setQueryData(['conversations', userId], (old) => {
      return sortConversations(config.optimisticUpdate(old));
    });

    try {
      const result = await config.mutation();
      return result;
    } catch (error) {
      queryClient.setQueryData(['conversations', userId], previous);
      throw error;
    }
  };

  return {
    conversations,
    ...queryInfo,
    optimisticUpdate,
    updateConversation: (updatedConv) => {
      queryClient.setQueryData(['conversations', userId], (old) => {
        const updated = old.map(conv => 
          conv._id === updatedConv._id ? updatedConv : conv
        );
        return sortConversations(updated);
      });
    }
  };
}
  