import React from 'react';
import { Layout, Drawer, Grid } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
// import { CloseOutlined } from '@ant-design/icons';
import { removeAuthData } from '../store/authSlice';
import AuthInterceptor from '../services/auth/AuthInterceptor';
import FiltersSidebar from '../components/FiltersSidebar';
import AppHeader from '../components/header/AppHeader'; // Import the extracted AppHeader
import { useConversations } from '../Hooks/useConversations';
import '../styles/AppLayout.css';
  
const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const AppLayout = ({ children }) => {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.id);
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleLogout = () => {
    dispatch(removeAuthData());
    AuthInterceptor.updateToken(null);
    navigate('/login', { replace: true });
  };
  const {
    data: conversations = [], // default to empty array if undefined
  } = useConversations(userId);

  
  
  // const conversations = [
  //   { id: "1", name: "John Doe", lastMessage: "Hey, how are you?", avatar: "https://github.com/shadcn.png" },
  //   { id: "2", name: "Jane Smith", lastMessage: "Can we meet tomorrow?", avatar: "https://github.com/shadcn.png" },
  //   { id: "3", name: "Bob Johnson", lastMessage: "The project is done!", avatar: "https://github.com/shadcn.png" },
  //   { id: "4", name: "Alice Brown", lastMessage: "Don't forget the meeting", avatar: "https://github.com/shadcn.png" },
  //   { id: "5", name: "Charlie Davis", lastMessage: "Thanks for your help!", avatar: "https://github.com/shadcn.png" },
  // ]
  return (
    <Layout className="min-h-screen">
      {/* Use the extracted AppHeader component */}
      <AppHeader
        handleLogout={handleLogout}
        toggleDrawer={toggleDrawer}
        screens={screens}
        conversations={conversations}
      />

      {/* Close Button for Drawer
      {drawerVisible && (
        <Button
        icon={<CloseOutlined />}
        onClick={toggleDrawer}
        style={{
          position: 'fixed',
          top: 28,
          right: 16,
          zIndex: 2000,
          // border: 'none',
          background: 'none', // Transparent background
          color: '#ffffff', // Icon color (adjust if needed)
          borderRadius: '50%',
          height: 48,
          width: 48,
          display: screens.lg ? 'none' : 'block', // Hide on large screens
          boxShadow: 'none', // Remove any button shadow
          padding: 0, // Tighten padding
        }}
      />
      )} */}

      {/* Main Layout */}
      <Layout style={{ marginTop: 64 }}>
        {/* Sidebar for Filters */}
        {(location.pathname === '/candidates' || location.pathname === '/') && screens.lg && (
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
          width="75vw" // Adjusted width for smaller screens
          styles={{
            header: { backgroundColor: '#000000', color: '#f0b71d' },
            body: { padding: '0' },
          }}
        >
          <FiltersSidebar onClose={toggleDrawer} />
        </Drawer>

        {/* Content Area */}
        <Layout
          style={{
            marginLeft:
              screens.lg && (location.pathname === '/candidates' || location.pathname === '/') ? 304 : 0,
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: '#fcfcfc',
              borderRadius: '20px',
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
