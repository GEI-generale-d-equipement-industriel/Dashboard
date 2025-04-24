"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Spin, Button } from 'antd';
import { useLocation } from 'react-router-dom';
import ConversationList from '../components/Conversations/ConversationList';
import MessageArea from '../components/Messages/MessagesArea';
import { useSocket } from '../Hooks/useSocket';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useSound from 'use-sound';
import { ArrowLeftOutlined } from '@ant-design/icons';  

const { Sider, Content } = Layout;


function ChatPage() {
    const queryClient = useQueryClient();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const candidateId = queryParams.get("candidateId");
    const conversationIdParam = queryParams.get("conversationId");
    const userId = useSelector((state) => state.auth.id);
    const { socket } = useSocket();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showConversationList, setShowConversationList] = useState(true);
    // Track messages we've sent optimistically
    const [sentMessageIds, setSentMessageIds] = useState(new Set());

    const url = process.env.REACT_APP_API_BASE_URL || "/api";
    const [playNotification] = useSound('/sounds/notification.mp3');

    function getLastActivityDate(conv) {
        if (conv.messages && conv.messages.length > 0) {
            const lastMsg = conv.messages[conv.messages.length - 1];
            return new Date(lastMsg.createdAt).getTime();
        }
        return new Date(conv.createdAt).getTime();
    }

    const sortConversations = (convs) => {
        return convs.slice().sort((a, b) => 
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );
      };

    useEffect(() => {
        if (!userId) return;

        const fetchAllConversations = async () => {
            try {
                const response = await axios.get(`${url}/conversations/user/${userId}`);
                let convs = response.data;
                convs.sort((a, b) => getLastActivityDate(b) - getLastActivityDate(a));
                const nonEmptyConvs = convs.filter(conv => Array.isArray(conv.messages) && conv.messages.length >= 0);
                setConversations(nonEmptyConvs);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchAllConversations();
    }, [userId, url]);

    useEffect(() => {
        if (!userId || conversations.length === 0) return;

        const handleUrlParams = async () => {
            setLoading(true);
            try {
                let targetConversation = null;

                if (conversationIdParam) {
                    targetConversation = conversations.find(c => c._id === conversationIdParam);
                    if (!targetConversation) {
                        const res = await axios.get(`${url}/conversations/${conversationIdParam}`);
                        targetConversation = res.data;
                        setConversations(prev => [...prev, res.data]);  // Add to conversations
                    }
                } else if (candidateId) {
                    targetConversation = conversations.find(c =>
                        c.participants.some(p => p._id === candidateId || p.id === candidateId)
                    );
                    if (!targetConversation) {
                        const res = await axios.post(`${url}/conversations/findOrCreate`, {
                            participants: [userId, candidateId]
                        });
                        targetConversation = res.data;
                        setConversations(prev => [...prev, res.data]); // Add to conversations
                    }
                }

                setSelectedConversation(targetConversation || conversations[0]);
                if (isMobileView && targetConversation) {
                    setShowConversationList(false);
                }

            } finally {
                setLoading(false);
            }
        };

        handleUrlParams();
    }, [conversationIdParam, candidateId, conversations, userId, url, isMobileView]);

    useEffect(() => {
        if (!selectedConversation || !socket) return;

        // Reset messages and sentMessageIds when changing conversations
        setMessages([]);
        setSentMessageIds(new Set());

        const convId = selectedConversation._id;
        socket.emit("joinConversation", { conversationId: convId });

        socket.on("receiveMessage", (newMessage) => {
            if (newMessage.conversationId === selectedConversation._id) {
                // Only add the message if it's from another user or if we haven't already 
                // added it optimistically
                const isFromCurrentUser = newMessage.sender === userId;
                
                if (!isFromCurrentUser) {
                    // Play notification sound only for messages from others
                    playNotification();
                    
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: newMessage._id,
                            senderId: newMessage.sender,
                            content: newMessage.text,
                            timestamp: newMessage.createdAt,
                        },
                    ]);
                } else {
                    // For our own messages, check if we've already added this one optimistically
                    // If we did, update the optimistic message with the real one (which has a server ID)
                    setMessages(prevMessages => 
                        prevMessages.map(msg => {
                            // If this is a temp message with the same text content, replace it with the real one
                            if (msg.senderId === userId && 
                                msg.content === newMessage.text && 
                                typeof msg.id === 'number') { // Temporary IDs are numbers (timestamps)
                                return {
                                    id: newMessage._id,
                                    senderId: newMessage.sender,
                                    content: newMessage.text,
                                    timestamp: newMessage.createdAt
                                };
                            }
                            return msg;
                        })
                    );
                }
                setConversations(prevConvs => {
                    const updatedConvs = prevConvs.map(conv => {
                        if (conv._id === newMessage.conversationId) {
                            return {
                                ...conv,
                                lastMessage: newMessage.text,
                                messages: [...conv.messages, newMessage],
                                updatedAt: newMessage.createdAt
                            };
                        }
                        return conv;
                    });
                    return sortConversations(updatedConvs);
                });
            }
            queryClient.invalidateQueries(['conversations', userId]);  // Invalidate the query to refetch conversations
        });

        socket.on("conversationHistory", (history) => {
           
            const formatted = history.map(msg => ({
                id: msg._id,
                senderId: msg.sender,
                content: msg.text,
                timestamp: msg.createdAt,
            }));
            setMessages(formatted);
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("conversationHistory");
        };
    }, [selectedConversation, socket, playNotification, userId]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        if (isMobileView) {
            setShowConversationList(false);
        }
    };

    const handleSendMessage = (text) => {
        if (!selectedConversation || !socket || !userId) return;

        // --- Optimistic UI update ---
        const tempId = Date.now(); // Unique temporary ID
        const tempMessage = {
            id: tempId,
            senderId: userId,
            content: text,
            timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, tempMessage]);

        setConversations(prevConvs => {
            const tempServerMessage = {
                _id: tempId,
                text,
                sender: userId,
                createdAt: new Date().toISOString(),
                conversationId: selectedConversation._id
            };
    
            const updatedConvs = prevConvs.map(conv => {
                if (conv._id === selectedConversation._id) {
                    return {
                        ...conv,
                        lastMessage: text,
                        messages: [...conv.messages, tempServerMessage],
                        updatedAt: new Date().toISOString()
                    };
                }
                return conv;
            });
            
            return sortConversations(updatedConvs);
        });
        queryClient.invalidateQueries(['conversations', userId]);  // Invalidate the query to refetch conversations
        // Send the message to the server
        socket.emit("sendMessage", {
            conversationId: selectedConversation._id,
            
            text,
        });
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setShowConversationList(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleBackToConversationList = () => {
        setShowConversationList(true);
    };

    if (loading) {
        return <Spin tip="Loading conversation..." />;
    }

    return (
        <Layout className="min-h-screen overscroll-none ">
            {isMobileView ? (
                showConversationList ? (
                    <Content className="bg-white">
                        <ConversationList
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            onSelectConversation={handleSelectConversation}
                        />
                    </Content>
                ) : (
                    <Content className="bg-gray-50">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBackToConversationList}
                            className="m-4"
                        >
                            Back to Conversations
                        </Button>
                        <MessageArea
                            conversation={selectedConversation}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                        />
                    </Content>
                )
            ) : (
                <>
                    <Sider width={300} className="bg-white border-r">
                        <ConversationList
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            onSelectConversation={handleSelectConversation}
                        />
                    </Sider>
                    <Content className="bg-gray-50 ">
                        <MessageArea
                            conversation={selectedConversation}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                        />
                    </Content>
                </>
            )}
        </Layout>
    );
}

export default ChatPage;