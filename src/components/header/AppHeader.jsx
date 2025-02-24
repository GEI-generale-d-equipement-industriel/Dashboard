import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector to get the auth state
import MessagesDropdown from '../DropDown/MessageDropdown';
const { Header } = Layout;

const AppHeader = ({ handleLogout, toggleDrawer, screens, conversations }) => {
  // Get user role from Redux store
  const userRole = useSelector((state) => state.auth.role);
  
  // Profile menu items (default for all roles)
  let profileMenu = {
    items: [
      {
        key: 'logout',
        label: (
          <span onClick={handleLogout} style={{ color: '#f5222d' }}>
            Logout
          </span>
        ),
      },
    ],
  };

  // If the user is **not** a candidate, add extra profile menu options
  if (userRole !== 'candidate') {
    profileMenu.items.unshift(
      {
        key: 'profile',
        label: <Link to="/under-construction">Profile</Link>,
      },
      {
        key: 'settings',
        label: <Link to="/under-construction">Settings</Link>,
      }
    );
  }

  // Navigation menu items (only for non-candidates)
  const navigationMenuItems = userRole !== 'candidate' ? [
    {
      key: '1',
      label: (
        <Link
          to="/candidates"
          style={{
            color: '#f0b71d',
            fontFamily: 'Libre Franklin, sans-serif',
            fontWeight: '600',
            fontSize: '16px',
          }}
        >
          Home
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link
          to="/favorites"
          style={{
            color: '#f0b71d',
            fontFamily: 'Libre Franklin, sans-serif',
            fontWeight: '600',
            fontSize: '16px',
          }}
        >
          Favorites
        </Link>
      ),
    },
  ] : [];

  // Messages menu items (only for non-candidates)
  // const messagesMenuItems = userRole !== 'candidate' ? [
  //   {
  //     key: 'label',
  //     label: (
  //       <div className="px-4 py-2 font-semibold">
  //         Recent Messages
  //       </div>
  //     ),
  //     disabled: true,
  //   },
  //   {
  //     key: 'divider-1',
  //     type: 'divider',
  //   },
  //   ...conversations.slice(0, 5).map((conversation) => ({
  //     key: conversation.id,
  //     label: (
  //       <div className="flex items-center space-x-3 py-2">
  //         <Avatar src={conversation.avatar} className="bg-gray-200">
  //           {conversation.name[0]}
  //         </Avatar>
  //         <div className="overflow-hidden">
  //           <p className="font-medium truncate">{conversation.name}</p>
  //           <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
  //         </div>
  //       </div>
  //     ),
  //   })),
  //   {
  //     key: 'divider-2',
  //     type: 'divider',
  //   },
  //   {
  //     key: 'see-all',
  //     label: (
  //       <Link
  //         to="/chat"
  //         className="block w-full text-center text-blue-500 hover:text-blue-600"
  //       >
  //         See all messages
  //       </Link>
  //     ),
  //   },
  // ] : [];

  // const messagesMenu = userRole !== 'candidate' ? <Menu className="w-80" items={messagesMenuItems} /> : null;

  return (
    <Header
      style={{
        position: 'fixed',
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: '#000000',
        padding: '0 16px',
      }}
    >
      {/* Logo */}
      <div
        className="logo"
        style={{
          width: 120,
          height: 64,
          marginRight: 24,
        }}
      >
        <Link to="/candidates">
          <img
            src="/assets/BeModel.png"
            alt="logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Link>
      </div>

      {/* Navigation Menu (Only for non-candidates) */}
      {userRole !== 'candidate' && (  
        <Menu
          mode="horizontal"
          theme="dark"
          items={navigationMenuItems}
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: 'transparent',
            borderBottom: 'none',
          }}
        />
      )}

      {/* Right-Side Actions */}
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '24px' }}>
        {/* Messages (Only for non-candidates) */}
        {/* {userRole !== 'candidate' && (
          <Dropdown overlay={messagesMenu} placement="bottomRight" trigger={['click']}>
            <Badge
              count={5}
              offset={[0, 0]}
              style={{ cursor: 'pointer' }}
            >
              <Button
                type="text"
                shape="circle"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                icon={
                  <MessageOutlined
                    style={{ fontSize: 24, color: '#f0b71d' }}
                  />
                }
              />
            </Badge>
          </Dropdown>
        )} */}
         <MessagesDropdown
            conversations={conversations}
            badgeCount={conversations.length} // or pass an unread count
          />

        {/* Profile Dropdown (Always Visible) */}
        <Dropdown menu={profileMenu} trigger={['click']}>
          <Avatar
            style={{
              backgroundColor: '#f0b71d',
              cursor: 'pointer',
              marginLeft: 'auto', // Ensures it's always at the end
            }}
          >
            <UserOutlined style={{ fontSize: 18 }} />
          </Avatar>
        </Dropdown>

        {/* Mobile Menu Toggle (only if screens.lg is false AND user is NOT a candidate) */}
        {!screens.lg && userRole !== 'candidate' && (
          <Button
            type="primary"
            ghost
            icon={<MenuOutlined style={{ color: '#ffffff', fontSize: 20 }} />}
            onClick={toggleDrawer}
            style={{
              marginLeft: '16px',
              borderColor: '#ffffff',
              borderRadius: '20px',
            }}
          />
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
