import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = ({ handleLogout, toggleDrawer, screens }) => {
  // Profile menu items
  const profileMenu = {
    items: [
      {
        key: 'profile',
        label: <Link to="/under-construction">Profile</Link>,
      },
      {
        key: 'settings',
        label: <Link to="/under-construction">Settings</Link>,
      },
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

  // Navigation menu items
  const navigationMenuItems = [
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
  ];

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
          marginRight: '24px',
        }}
      >
        <Link to="/candidates">
          <img
            src="/assets/Logo.jpg"
            alt="logo"
            style={{ width: '200%', height: '100%', objectFit: 'cover' }}
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="horizontal"
        theme="dark"
        items={navigationMenuItems}
        style={{ flex: 1, minWidth: 0, backgroundColor: 'transparent', borderBottom: 'none' }}
      />

      {/* Profile Dropdown */}
      <Dropdown menu={profileMenu} trigger={['click']}>
        <Avatar
          style={{
            marginLeft: 'auto',
            backgroundColor: '#f0b71d',
            cursor: 'pointer',
          }}
        >
          <UserOutlined />
        </Avatar>
      </Dropdown>

      {/* Mobile Menu Toggle (only if screens.lg is false) */}
      {!screens.lg && (
        <Button
          type="primary"
          ghost
          icon={<MenuOutlined style={{ color: '#ffffff', fontSize: '20px' }} />}
          onClick={toggleDrawer}
          style={{
            marginLeft: '16px',
            borderColor: '#ffffff',
            borderRadius: '20px',
          }}
        />
      )}
    </Header>
  );
};

export default AppHeader;
