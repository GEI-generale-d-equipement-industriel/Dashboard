import React from 'react';
import { Avatar } from 'antd';
import { useSelector } from 'react-redux';

// Helper function to generate initials from a name
const getInitials = (name) => {
  if (!name) return "";
  return name.slice(0, 2).toUpperCase();
};

const ConversationList = ({ conversations, selectedConversation, onSelectConversation }) => {
  const userId = useSelector((state) => state.auth.id);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Conversations</h2>
      <ul>
        {conversations.map((conv) => {
          if (!conv || !conv.participants) {
            return null; // Skip if conversation or participants is undefined
          }

          // For a one-to-one conversation, find the "other" participant (not the current user).
          let otherParticipant = null;
          if (Array.isArray(conv.participants)) {
            otherParticipant = conv.participants.find((p) => {
              if (!p) return false;
              // Check the ID fields:
              if (p.id) return p.id !== userId;
              if (p._id) return p._id.toString() !== userId;
              return false;
            });
          }

          // If we found the other participant, build the display data from their info.
          let avatarSrc = null;
          let initials = "";
          let displayedUsername = "Conversation"; // Default fallback
          
          if (otherParticipant) {
            // If we stored an 'avatar' in the participant object, use that, else null
            avatarSrc = otherParticipant.avatar || null;
            // If there's a username, use it for both the displayed name and fallback initials
            
            if (otherParticipant.username) {
              
              
              displayedUsername = otherParticipant.username;
              initials = getInitials(otherParticipant.username);
            }
          }

          // Determine last message text. If you store a 'lastMessage' property, use that,
          // otherwise take the text of the last message from 'conv.messages'
          let lastMessage = "";
          if (conv.lastMessage) {
            lastMessage = conv.lastMessage;
          } else if (Array.isArray(conv.messages) && conv.messages.length > 0) {
            const lastMsg = conv.messages[conv.messages.length - 1];
            lastMessage = lastMsg.text;
          }

          return (
            <li
              key={conv._id}
              onClick={() => onSelectConversation(conv)}
              className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 
              transition-colors duration-200 hover:bg-gray-100
              ${selectedConversation && selectedConversation._id === conv._id ? 'bg-gray-200' : ''}`}
            >
              {/* Avatar with fallback initials if no avatarSrc is found */}
              <Avatar src={avatarSrc} size="large" className="mr-4">
                {!avatarSrc && initials}
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{displayedUsername}</p>
                <p className="text-sm text-gray-500 truncate" style={{ maxWidth: 200 }}>
                  {lastMessage}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConversationList;
