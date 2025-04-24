// ConversationList.jsx
import React from 'react';
import { Avatar, Badge, Empty } from 'antd';
import { useSelector } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';

const getInitials = (name) => {
  if (!name) return "";
  return name.slice(0, 2).toUpperCase();
};

const ConversationList = ({ conversations, selectedConversation, onSelectConversation }) => {
  const userId = useSelector((state) => state.auth.id);
  
  const truncateMessage = (text) => {
    if (!text) return "";
    if (text.length > 30) {
      return text.substring(0, 30) + "...";
    }
    return text;
  };
  
  const truncateUser = (text) => {
    if (!text) return "";
    if (text.length > 15) {
      return text.substring(0, 15) + "...";
    }
    return text;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // If today, show time
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If this week, show day name
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        {conversations.length === 0 ? (
          <Empty 
            description="No conversations yet" 
            className="mt-8"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <ul className="space-y-2">
            {conversations.map((conv) => {
              if (!conv || !conv.participants) return null;

              const otherParticipant = conv.participants.find(p => 
                p?.id !== userId && p?._id?.toString() !== userId
              );

              // Avatar handling
              const avatarSrc = otherParticipant?.avatar || null;
              const displayedUsername = otherParticipant?.username || "Conversation";
              const initials = getInitials(displayedUsername);

              // Message handling
              const lastMessage = conv.lastMessage || 
                (conv.messages?.length > 0 ? conv.messages[conv.messages.length - 1]?.text : "");
              const lastMessageSender = conv.messages?.length > 0 
                ? conv.messages[conv.messages.length - 1]?.sender 
                : "";
              const lastMessageTime = conv.messages?.length > 0 
                ? conv.messages[conv.messages.length - 1]?.timestamp 
                : conv.updatedAt || conv.createdAt;

              const isLastMessageFromOther = lastMessageSender !== userId;
              const isUnread = isLastMessageFromOther && !conv.readStatus?.[userId];

              return (
                <li
                  key={conv._id}
                  onClick={() => onSelectConversation(conv)}
                  className={`flex items-center w-full p-3 rounded-lg cursor-pointer
                    transition-all duration-200 hover:bg-gray-50
                    ${selectedConversation?._id === conv._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                >
                  <div className="relative">
                    <Avatar 
                      src={avatarSrc} 
                      size="large" 
                      className="mr-3"
                      icon={!avatarSrc && <UserOutlined />}
                    >
                      {!avatarSrc && initials}
                    </Avatar>
                    {isUnread && (
                      <Badge
                        status="processing"
                        className="absolute -top-1 -right-1"
                        style={{ transform: 'scale(0.8)' }}
                      />
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold text-base ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {truncateUser(displayedUsername)}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTimestamp(lastMessageTime)}
                      </span>
                    </div>

                    <p className={`text-sm text-gray-500 truncate ${isUnread ? 'font-medium' : ''}`}>
                      {truncateMessage(lastMessage)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationList;