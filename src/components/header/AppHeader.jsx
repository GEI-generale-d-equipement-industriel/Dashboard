import React from 'react';
import { useLocation } from 'react-router-dom'; // Add this
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MessagesDropdown from '../DropDown/MessageDropdown';

const { Header } = Layout;

// Centralized navigation configuration
const NAV_ITEMS = [
  { key: '1', path: '/candidates', label: 'Home' },
  { key: '2', path: '/favorites', label: 'Favorites' },
];

// Style constants
const linkStyle = {
  color: '#f0b71d',
  fontFamily: 'Libre Franklin, sans-serif',
  fontWeight: '600',
  fontSize: '16px',
  transition: 'all 0.3s ease',
};

const AppHeader = ({ handleLogout, conversations }) => {
  const location = useLocation();
  const userRole = useSelector((state) => state.auth.role);
  
  // Determine selected menu keys based on current path
  const selectedKeys = NAV_ITEMS
    .filter(item => location.pathname === item.path)
    .map(item => item.key);

  // Profile menu configuration
  const profileMenu = {
    items: [
      ...(userRole !== 'candidate' ? [
        {
          key: 'profile',
          label: <Link to="/profile">Profile</Link>,
        },
        {
          key: 'settings',
          label: <Link to="/settings">Settings</Link>,
        },
      ] : []),
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

  // Generate navigation menu items
  const navigationMenuItems = NAV_ITEMS.map(item => ({
    key: item.key,
    label: (
      <Link to={item.path} style={linkStyle}>
        {item.label}
      </Link>
    ),
  }));

  // Dynamic logo link based on user role
  const logoLink = userRole === 'candidate' ? '/dashboard' : '/candidates';

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
      {/* Logo with dynamic link */}
      <div className="hidden md:block w-[120px] h-[64px] mr-6">
  <Link to={logoLink}>
    <img
      src="/assets/BeModel.png"
      alt="logo"
      className="w-full h-full object-contain"
    />
  </Link>
</div>

      {/* Navigation Menu */}
      {userRole !== 'candidate' && (  
        <Menu
          mode="horizontal"
          theme="dark"
          items={navigationMenuItems}
          selectedKeys={selectedKeys}
          className="flex-1 min-w-0 bg-transparent border-none 
          [&_.ant-menu-item]:!bg-transparent [&_.ant-menu-item-selected]:after:!border-b-2 
          [&_.ant-menu-item-selected]:after:!border-amber-500 [&_.ant-menu-item-selected>a]:!text-amber-500" 
        />
      )}

      {/* Right-Side Actions */}
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '24px' }}>
        <MessagesDropdown
          conversations={conversations}
          badgeCount={conversations.length}
        />

        {/* Profile Dropdown */}
        <Dropdown menu={profileMenu} trigger={['click']}>
          <Avatar
            style={{
              backgroundColor: '#f0b71d',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            <UserOutlined style={{ fontSize: 18 }} />
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;