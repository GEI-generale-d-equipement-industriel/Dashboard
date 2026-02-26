import React from 'react';
import { Layout, Drawer, Grid } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
    data: conversations = [],
  } = useConversations(userId);

  const isFilterVisible = location.pathname === '/candidates' || location.pathname === '/';

  return (
    <Layout className="min-h-screen">
      {/* Use the extracted AppHeader component */}
      <AppHeader
        handleLogout={handleLogout}
        toggleDrawer={toggleDrawer}
        screens={screens}
        conversations={conversations}
      />

      <Layout style={{ marginTop: 64 }}>
        {/* Sidebar for Filters on Desktop */}
        {isFilterVisible && screens.lg && (
          <Sider
            width={320}
            className="site-sidebar bg-white fixed top-[64px] left-0 h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden border-r border-gray-100 z-10 shadow-sm"
          >
            <FiltersSidebar />
          </Sider>
        )}

        {/* Drawer for Mobile Filters */}
        <Drawer
          title={null}
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
          width={320}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ display: 'none' }}
          className="filters-drawer"
        >
          <FiltersSidebar onClose={toggleDrawer} />
        </Drawer>

        {/* Content Area */}
        <Layout
          className={`transition-all duration-300 min-h-[calc(100vh-64px)] bg-[#fcfcfc] ${screens.lg && isFilterVisible ? 'ml-[320px]' : 'ml-0'}`}
        >
          <Content
            className="p-4 sm:p-6 lg:p-8 min-h-[280px] bg-[#fcfcfc] rounded-3xl"
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
