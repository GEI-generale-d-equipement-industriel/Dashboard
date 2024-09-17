// AppLayout.jsx
import React from 'react';
import { Layout, Menu, Drawer, Button, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import FiltersSidebar from '../components/FiltersSidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeAuthData } from '../store/authSlice';

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
    <Layout style={{ minHeight: '100vh' }}>
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
              src="/assets/BeModel.png"
              alt="logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Navigation Menu */}
        <Menu  mode="horizontal" style={{ flex: 1, minWidth: 0,backgroundColor: 'transparent', 
            borderBottom: 'none', }}>
          <Menu.Item key="1">
            <Link to="/candidates">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/favorites">Favorites</Link>
          </Menu.Item>
        </Menu>

        {/* Logout Button */}
        <Button
          type="primary"
          style={{ marginLeft: 'auto' }}
          onClick={handleLogout}
        >
          Logout
        </Button>

        {/* Mobile Menu Toggle */}
        {!screens.lg && (
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            className="ml-auto"
          />
        )}
      </Header>

      {/* Main Layout */}
      <Layout style={{ marginTop: 64 }}>
        {/* Sidebar for Filters */}
        {location.pathname === '/candidates' && screens.lg && (
          <Sider
            width={304}
            className="shadow-lg"
            style={{
              backgroundColor: '#f1f5f9',
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
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <FiltersSidebar />
        </Drawer>

        {/* Content Area */}
        <Layout
          style={{
            marginLeft:
              screens.lg && location.pathname === '/candidates' ? 280 : 0,
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8,
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
