import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Input, Dropdown, Button, Checkbox, Menu } from 'antd';
import { FilterOutlined, ClearOutlined, SearchOutlined } from '@ant-design/icons';
import {
  filterByInterest,
  filterByName,
  filterByAge,
  filterBySex,
  clearFilters,
  restPages
} from '../store/movieSlice';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState([]);
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedSex, setSelectedSex] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(filterByName(value));
  };

  const handleInterestChange = (value) => {
    setSelectedInterest(value);
    dispatch(filterByInterest(value));
  };

  const handleAgeChange = (e) => {
    const age = e.target.value;
    setSelectedAge(age);
    dispatch(filterByAge(age));
  };

  const handleSexChange = (e) => {
    const sex = e.target.value;
    console.log(sex);
    
    setSelectedSex(sex);
    dispatch(filterBySex(sex));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
    setSelectedInterest([]);
    setSelectedAge('');
    setSelectedSex('');
    navigate('/');
  };

  const resetPage = () => dispatch(restPages());

  const clearAll = () => {
    handleClearFilters();
    resetPage();
  };

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Filter by Interest">
        <Menu.Item key="interests">
          <Checkbox.Group
            options={['model', 'ugc', 'voiceOver']}
            value={selectedInterest}
            onChange={handleInterestChange}
          />
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Filter by Age">
        {['18-25', '26-35', '36-45', '46-60', '60+'].map((age) => (
          <Menu.Item key={age}>
            <Checkbox
              value={age}
              checked={selectedAge === age}
              onChange={() => handleAgeChange({ target: { value: age } })}
            >
              {age}
            </Checkbox>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Filter by Gender">
        {['male', 'female'].map((sex) => (
          <Menu.Item key={sex}>
            <Checkbox
              value={sex}
              checked={selectedSex === sex}
              onChange={() => handleSexChange({ target: { value: sex } })}
            >
              {sex}
            </Checkbox>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <Header className="bg-gray-800 text-white">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between py-4">
        <div className="flex items-center mb-4 lg:mb-0">
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-400" onClick={clearAll}>
            Candidate App
          </Link>
          <Link
            to="/favorites"
            className="text-lg font-bold text-white hover:text-gray-400 ml-6"
            onClick={handleClearFilters}
          >
            Favorites
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          <Search
            placeholder="Search for a candidate..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            enterButton
            prefix={<SearchOutlined />}
            className="bg-gray-700 text-white"
            style={{ maxWidth: 300 }}
          />
          <Dropdown overlay={menu} trigger={['click']}>
            <Button
              className="bg-gray-700 text-white flex items-center space-x-2"
              icon={<FilterOutlined />}
            >
              Filter
            </Button>
          </Dropdown>
          {(selectedInterest.length > 0 || selectedAge || selectedSex) && (
            <Button
              className="bg-red-600 text-white flex items-center space-x-2"
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
