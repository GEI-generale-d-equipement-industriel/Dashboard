import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import FiltersSidebar from '../components/FiltersSidebar';

const { Header, Content, Sider } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSex, setSelectedSex] = useState([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
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
            height: 120,
            margin: '16px 24px 16px 0',
          }}
        >
          <img
            src="/assets/GEI.png"
            alt="logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={['1', '2', '3'].map((key) => ({
            key,
            label: `nav ${key}`,
          }))}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider
          
          collapsed={collapsed}
          onCollapse={toggleCollapse}
          trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          width={220}
          style={{
            background: colorBgContainer,
            position: 'fixed',
            height: '100vh',
            overflow: 'auto',
            top: 64,
            left: 0,
            zIndex: 100,
          }}
        >
          <FiltersSidebar
            collapsed={collapsed}
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
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: 'margin-left 0.2s',
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
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
