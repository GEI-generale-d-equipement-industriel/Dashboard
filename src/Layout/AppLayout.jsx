import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import FiltersSidebar from '../components/FiltersSidebar';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint(); // Detect screen size

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState([]);
  const [selectedAge, setSelectedAge] = useState([0, 60]);
  const [selectedSex, setSelectedSex] = useState([]);

  const location = useLocation();

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: '#001529',
          padding: '0 16px',
        }}
      >
        <div
          className="logo"
          style={{
            width: 120,
            height: 64,
            marginRight: '24px',
          }}
        >
          <Link to="/">
            <img
              src="/assets/GEI.png"
              alt="logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Link>
        </div>
        <Menu theme="dark" mode="horizontal" style={{ flex: 1, minWidth: 0 }}>
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/favorites">Favorites</Link>
          </Menu.Item>
        </Menu>
        {!screens.lg && (
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            className="ml-auto"
          />
        )}
      </Header>
      <Layout style={{ marginTop: 64 }}>
        {location.pathname === '/' && screens.lg && (
          <Sider
            width={304}
            className="shadow-lg"
            style={{
              backgroundColor: "#f1f5f9",
              position: 'fixed',
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
              top: 64,
              left: 0,
              zIndex: 100,
              padding: '16px',
            }}
          >
            <FiltersSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedInterest={selectedInterest}
              setSelectedInterest={setSelectedInterest}
              selectedAge={selectedAge}
              setSelectedAge={setSelectedAge}
              selectedSex={selectedSex}
              setSelectedSex={setSelectedSex}
            />
          </Sider>
        )}

        <Drawer
          title="Filters"
          placement="left"
          onClose={toggleDrawer}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <FiltersSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedInterest={selectedInterest}
            setSelectedInterest={setSelectedInterest}
            selectedAge={selectedAge}
            setSelectedAge={setSelectedAge}
            selectedSex={selectedSex}
            setSelectedSex={setSelectedSex}
          />
        </Drawer>

        <Layout
          style={{
            marginLeft: screens.lg&&location.pathname==="/" ? 280 : 0,
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
