import React from 'react';
import { Layout, Drawer } from 'antd';
import { useLocation } from 'react-router-dom';
import FiltersSidebar from '../FiltersSidebar';

const { Sider } = Layout;

const Sidebar = ({ visible, onClose, screens }) => {
  const location = useLocation();

  if (screens.lg && location.pathname === '/candidates') {
    return (
        <div className="hidden lg:block">
        <Sider width={304} className="sidebar">
          <FiltersSidebar />
        </Sider>
      </div>
    );
  }

  return (
    <Drawer
      title="Filters"
      placement="left"
      onClose={onClose}
      open={visible}
      className="filters-drawer lg:hidden"
    >
      <FiltersSidebar />
    </Drawer>
  );
};

export default Sidebar;
