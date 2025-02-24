// MessagesDropdown.jsx
import React from 'react';
import { Dropdown, Badge, Button, Avatar, Menu } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function MessagesDropdown({ conversations = [], badgeCount = 0 }) {

  function getLastMessage(conv) {
    if (conv.messages && conv.messages.length > 0) {
      const lastMsg = conv.messages[conv.messages.length - 1];
      return lastMsg.text || 'No messages';
    }
    return 'No messages';
  }

  const menuItems = [
    {
      key: 'label',
      label: <div className="px-4 py-2 font-semibold">Recent Messages</div>,
      disabled: true,
    },
    { key: 'divider-1', type: 'divider' },
    ...conversations.slice(0, 5).map((conversation) => {
      const convoId = conversation._id;
      const displayName = conversation.receiverName || 'Conversation';
      const avatarUrl = conversation.receiverAvatar || null;
      const lastMsgText = getLastMessage(conversation);

      return {
        key: convoId,
        label: (
          // Clicking this <Link> navigates to /chat?conversationId=<convoId>
          <Link to={`/chat?conversationId=${convoId}`} className="block">
            <div className="flex items-center space-x-3 py-2">
              <Avatar src={avatarUrl} className="bg-gray-200">
                {!avatarUrl && displayName[0]?.toUpperCase()}
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{displayName}</p>
                <p className="text-sm text-gray-500 truncate">{lastMsgText}</p>
              </div>
            </div>
          </Link>
        ),
      };
    }),
    { key: 'divider-2', type: 'divider' },
    {
      key: 'see-all',
      label: (
        <Link to="/chat" className="block w-full text-center text-blue-500 hover:text-blue-600">
          See all messages
        </Link>
      ),
    },
  ];

  const menu = <Menu className="w-80" items={menuItems} />;

  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
      <Badge count={badgeCount} overflowCount={99} style={{ cursor: 'pointer' }}>
        <Button
          type="text"
          shape="circle"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          icon={<MessageOutlined style={{ fontSize: 24, color: '#f0b71d' }}/> }
        />
      </Badge>
    </Dropdown>
  );
}
