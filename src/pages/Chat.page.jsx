// ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import ConversationList from '../components/Conversations/ConversationList';
import MessageArea from '../components/Messages/MessagesArea';
import { useSocket } from '../Hooks/useSocket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import useSound from 'use-sound';
// import notificationsound from "/assets/sounds/notification.mp3";
const { Sider, Content } = Layout;

function ChatPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const candidateId = queryParams.get("candidateId");
  const conversationIdParam = queryParams.get("conversationId"); // May be provided via URL
  const userId = useSelector((state) => state.auth.id);
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]); // You can later populate this list
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const url = process.env.REACT_APP_API_BASE_URL || "/api";

  const [playNotification] = useSound('/sounds/notification.mp3');
  
  function getLastActivityDate(conv) {
    if (conv.messages && conv.messages.length > 0) {
      const lastMsg = conv.messages[conv.messages.length - 1];
      return new Date(lastMsg.createdAt).getTime();
    }
    // If no messages, fallback to conversation's own createdAt
    return new Date(conv.createdAt).getTime();
  }

  // 1) Fetch all conversations for the user
  useEffect(() => {
    if (!userId) return;
  
    const fetchAllConversations = async () => {
      try {
        const response = await axios.get(`${url}/conversations/user/${userId}`);
        let convs = response.data;

        // Sort by last message date (descending)
        convs.sort((a, b) => {
          return getLastActivityDate(b) - getLastActivityDate(a);
        });
        const nonEmptyConvs = convs.filter((conv) => 
          Array.isArray(conv.messages) && conv.messages.length > 0
        );
        setConversations(nonEmptyConvs);
        
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
  
    fetchAllConversations();
  }, [userId, url]);


  // Fetch or create conversation based on URL parameters
  useEffect(() => {
  if (!userId || conversations.length === 0) return;

  const handleUrlParams = async () => {
    setLoading(true);
    try {
      let targetConversation = null;

      // Case 1: Specific conversation ID in URL
      if (conversationIdParam) {
        targetConversation = conversations.find(
          c => c._id === conversationIdParam
        );
        if (!targetConversation) {
          // Fetch if not in local list
          const res = await axios.get(`${url}/conversations/${conversationIdParam}`);
          targetConversation = res.data;
          setConversations(prev => [...prev, res.data]);
        }
      }
      // Case 2: Candidate ID in URL
      else if (candidateId) {
        targetConversation = conversations.find(c => 
          c.participants.some(p => p._id === candidateId || p.id === candidateId)
        );

        if (!targetConversation) {
          const res = await axios.post(`${url}/conversations/findOrCreate`, {
            participants: [userId, candidateId]
          });
          targetConversation = res.data;
          setConversations(prev => [...prev, res.data]);
        }
      }

      setSelectedConversation(targetConversation || conversations[0]);
    } finally {
      setLoading(false);
    }
  };

  handleUrlParams();
}, [conversationIdParam, candidateId, conversations, userId, url]);

  // When conversation is loaded, join the corresponding socket room.
  useEffect(() => {
    if (!selectedConversation || !socket) return;
    const convId = selectedConversation._id;
    socket.emit("joinConversation", { conversationId: convId });

    // Listen for conversationHistory to load existing messages.
    socket.on("conversationHistory", (history) => {
      const formatted = history.map((msg) => ({
        id: msg._id,
        senderId: msg.sender,
        content: msg.text,
        timestamp: msg.createdAt,
      }));
      setMessages(formatted);
    });

    return () => {
      socket.off("conversationHistory");
    };
  }, [selectedConversation, socket]);

  // Listen for new messages.
  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", (newMessage) => {
      playNotification();
      const formatted = {
        id: newMessage._id,
        senderId: newMessage.sender,
        content: newMessage.text,
        timestamp: newMessage.createdAt,
      };
      setMessages((prev) => [...prev, formatted]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, playNotification]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  // Send a message using the conversation ID.
  const handleSendMessage = (text) => {
    if (!selectedConversation || !socket || !userId) return;
    socket.emit("sendMessage", {
      conversationId: selectedConversation._id,
      senderId: userId,
      text, // Use "text" property as expected by your backend
    });
  };

  if (loading) {
    return <Spin tip="Loading conversation..." />;
  }

  return (
    <Layout className="min-h-screen">
      <Sider width={300} className="bg-white border-r">
        
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
      </Sider>
      <Content className="bg-gray-50">
        <MessageArea
          conversation={selectedConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </Content>
    </Layout>
  );
}

export default ChatPage;
