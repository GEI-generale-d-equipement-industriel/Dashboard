// MessagesDropdown.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Dropdown, Badge, Button, Avatar, Menu } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useConversations } from '../../Hooks/useConversations'; // Import the custom hook
import { useSelector } from 'react-redux';
export default function MessagesDropdown() {
  const userId = useSelector((state) => state.auth.id);
  
  const { conversations} = useConversations(userId);

// console.log(conversations);

  const badgeCount = conversations.length


  function getLastMessage(conv) {
    const lastMsg = conv.messages?.[conv.messages.length - 1];
    return lastMsg?.text || 'No messages';
  }

  // --- Responsiveness: Dynamic Placement ---
  const [placement, setPlacement] = useState('bottomRight');

  useEffect(() => {
    const handleResize = () => {
      setPlacement(window.innerWidth < 640 ? 'bottom' : 'bottomRight');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // --- End Responsiveness: Dynamic Placement ---



  const menuItems = [
    {
      key: 'label',
      label: <div className="px-4 py-2 font-semibold">Recent Messages</div>,
      disabled: true,
    },
    { key: 'divider-1', type: 'divider' },
    ...conversations.slice(0, 5).map((conversation) => {
      const lastMsgText = getLastMessage(conversation);
      return {
        key: conversation._id,
        label: (
          <Link to={`/chat?conversationId=${conversation._id}`} className="block">
            <div className="flex items-center space-x-3 py-2">
              <Avatar src={conversation.receiverAvatar} className="bg-gray-200">
                {conversation.receiverName?.[0]?.toUpperCase()}
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{conversation.receiverName}</p>
                <p className="text-sm text-gray-500 truncate">
                  {lastMsgText.slice(0, 22) + (lastMsgText.length > 22 ? '...' : '')}
                </p>
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

    // --- Responsiveness: Conditional Width ---
    // const menu = (
    //   <Menu
    //     className="w-full sm:w-80 max-w-screen-sm" // Responsive width
    //     items={menuItems}
    //   />
    // );
    // --- End Responsiveness: Conditional Width ---


    return (
      <Dropdown
        overlay={<Menu className="w-full sm:w-80" items={menuItems} />}
        placement={placement}
        trigger={['click']}
      >
        <Badge count={badgeCount} overflowCount={99} style={{ cursor: 'pointer' }}>
          <Button
            type="text"
            shape="circle"
            icon={<MessageOutlined style={{ fontSize: 24, color: '#f0b71d' }} />}
            aria-label="Messages"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
        </Badge>
      </Dropdown>
    )
}