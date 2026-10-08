import React, { useMemo, useState } from 'react';
import { Layout, Drawer, Grid } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuthData } from '../store/authSlice';
import AuthInterceptor from '../services/auth/AuthInterceptor';
import FiltersSidebar from '../components/FiltersSidebar';
import AppHeader from '../components/header/AppHeader';
import FiltersDrawerContext from '../context/FiltersDrawerContext';
import { useConversations } from '../Hooks/useConversations';
import '../styles/AppLayout.css';

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const SIDEBAR_WIDTH = 300;
const CANVAS = 'var(--bm-canvas, #f6f3ec)';

const AppLayout = ({ children }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.id);

  const drawerApi = useMemo(
    () => ({ open: () => setDrawerVisible(true) }),
    []
  );

  const handleLogout = () => {
    dispatch(removeAuthData());
    AuthInterceptor.updateToken(null);
    navigate('/login', { replace: true });
  };

  const { data: conversations = [] } = useConversations(userId);

  const isFilterVisible = location.pathname === '/candidates' || location.pathname === '/';
  const showSider = isFilterVisible && screens.lg;

  return (
    <FiltersDrawerContext.Provider value={drawerApi}>
      <Layout className="min-h-screen" style={{ background: CANVAS }}>
        <AppHeader handleLogout={handleLogout} conversations={conversations} />

        <Layout style={{ marginTop: 64, background: CANVAS }}>
          {/* Filters sidebar on desktop */}
          {showSider && (
            <Sider width={SIDEBAR_WIDTH} theme="light" className="bm-sider">
              <FiltersSidebar />
            </Sider>
          )}

          {/* Filters drawer on mobile / tablet */}
          {isFilterVisible && !screens.lg && (
            <Drawer
              title={null}
              placement="left"
              onClose={() => setDrawerVisible(false)}
              open={drawerVisible}
              width={Math.min(360, window.innerWidth)}
              styles={{ body: { padding: 0 }, header: { display: 'none' } }}
              className="filters-drawer"
            >
              <FiltersSidebar onClose={() => setDrawerVisible(false)} />
            </Drawer>
          )}

          <Layout
            className="transition-all duration-300 min-h-[calc(100vh-64px)]"
            style={{ background: CANVAS, marginLeft: showSider ? SIDEBAR_WIDTH : 0 }}
          >
            <Content className="bm-content" style={{ background: CANVAS }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </FiltersDrawerContext.Provider>
  );
};

export default AppLayout;
