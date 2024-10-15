// AppLayout.jsx
import React from 'react';
import { Layout, Menu, Drawer, Button, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import FiltersSidebar from '../components/FiltersSidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeAuthData } from '../store/authSlice';
import '../styles/AppLayout.css'

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const AppLayout = ({ children }) => {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleLogout = () => {
    dispatch(removeAuthData());
    navigate('/login', { replace: true });
  };

  return (
    <Layout className="min-h-screen">
      {/* Header */}
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
        <Menu  mode="horizontal" style={{ flex: 1, minWidth: 0,backgroundColor: 'transparent', 
            borderBottom: 'none', }}theme="dark"
            className="custom-menu">
          <Menu.Item key="1" style={{ fontFamily: 'Libre Franklin, sans-serif', fontWeight: '600',fontSize:"16px" }}>
            <Link to="/candidates" style={{ color: '#f0b71d' }}>Home</Link>
          </Menu.Item>
          <Menu.Item key="2" style={{ fontFamily: 'Libre Franklin, sans-serif', fontWeight: '600' ,fontSize:"16px"}}>
            <Link to="/favorites" style={{ color: '#f0b71d' }}>Favorites</Link>
          </Menu.Item>
        </Menu>

        {/* Logout Button */}
        <Button
          type="text"
          style={{
            marginLeft: 'auto',
    color: '#f0b71d',
    borderColor: '#f0b71d',
    borderRadius: '20px',
    fontFamily: 'Libre Franklin, sans-serif',
    fontWeight: '600',
    fontSize: '16px',
    opacity: 0.9,
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>

        {/* Mobile Menu Toggle */}
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

      {/* Main Layout */}
      <Layout style={{ marginTop: 64 }}>
        {/* Sidebar for Filters */}
        {(location.pathname === '/candidates'||location.pathname === '/') && screens.lg && (
          <Sider
            width={304}
            className="shadow-lg"
            style={{
              backgroundColor: '#fcfcfc',
              position: 'fixed',
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
              top: 64,
              left: 0,
              zIndex: 100,
              padding: '16px',
            }}
          >
            <FiltersSidebar />
          </Sider>
        )}

        {/* Drawer for Mobile Filters */}
        <Drawer
          title="Filters"
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
        
  styles={{
    header: { backgroundColor: '#000000', color: '#f0b71d' },
    body: { padding: '0' },
    content: { backgroundColor: '#000000' },
  }}
  
        >
          <FiltersSidebar />
        </Drawer>

        {/* Content Area */}
        <Layout
          style={{
            marginLeft:
              screens.lg && (location.pathname === '/candidates'||location.pathname === '/') ? 304 : 0,
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: '#fcfcfc',
              borderRadius: "20px",
              
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
