import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Dropdown, Menu, Checkbox } from 'antd';
import { SearchOutlined, ClearOutlined, DownOutlined } from '@ant-design/icons';
import {
  filterByInterest,
  filterByName,
  filterByAge,
  filterBySex,
  clearFilters,
  restPages,
} from '../store/candidatesSlice';
// import logo from '../../public/assets/GEI.svg'; // Ensure the correct path to your logo

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

  const handleAgeChange = (age) => {
    setSelectedAge(age);
    dispatch(filterByAge(age));
  };

  const handleSexChange = (sex) => {
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

  const interestsMenu = (
    <Menu>
      {['Modèle pour shooting en studio', 'Créateur UGC', 'Voix-off'].map((interest) => (
        <Menu.Item key={interest}>
          <Checkbox
            checked={selectedInterest.includes(interest)}
            onChange={(e) => {
              const checked = e.target.checked;
              const newInterests = checked
                ? [...selectedInterest, interest]
                : selectedInterest.filter((i) => i !== interest);
              handleInterestChange(newInterests);
            }}
          >
            {interest}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  const ageMenu = (
    <Menu>
      {['18-25', '26-35', '36-45', '46-60', '60+'].map((age) => (
        <Menu.Item key={age}>
          <Checkbox
            checked={selectedAge.includes(age)}
            onChange={(e) => {
              const checked = e.target.checked;
              const newAges = checked
                ? [...selectedAge, age]
                : selectedAge.filter((a) => a !== age);
              handleAgeChange(newAges);
            }}
          >
            {age}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  // Adjusted sexMenu for vertical layout
  const sexMenu = (
    <Menu>
      {['Homme', 'Femme'].map((sex) => (
        <Menu.Item key={sex}>
          <Checkbox
            checked={selectedSex.includes(sex)}
            onChange={(e) => {
              const checked = e.target.checked;
              const newSexes = checked
                ? [...selectedSex, sex]
                : selectedSex.filter((s) => s !== sex);
              handleSexChange(newSexes);
              
            }}
            
          >
            {sex}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <header className="bg-gray-800 text-white p-4 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <div className="flex items-center space-x-12">
          <Link to="/" className="flex items-center" onClick={clearAll}>
            {/* <img src={"/assets/GEI.svg"} alt="Candidate App Logo" className="h-12 w-auto mr-2" />  */}
            {/* Uncomment below line if you want to keep text beside logo */}
            <span className="ml-4 text-2xl font-bold text-white hover:text-gray-400">Home</span>
          </Link>
          <Link to="/favorites" className="text-2xl font-bold text-white shadow-lg rounded-lg  hover:text-gray-400" onClick={handleClearFilters}>
            Favorites
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0 w-full lg:w-auto">
        <Search
          placeholder="Search for a candidate..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          enterButton
          prefix={<SearchOutlined />}
          className="bg-gray-700 text-white w-full lg:w-64"
        />

        <div className="flex flex-wrap gap-4 items-center">
          <Dropdown overlay={interestsMenu} trigger={['click']}>
            <Button className="text-white bg-gray-700 hover:bg-gray-600">
              Interest <DownOutlined />
            </Button>
          </Dropdown>

          <Dropdown overlay={ageMenu} trigger={['click']}>
            <Button className="text-white bg-gray-700 hover:bg-gray-600">
              Age <DownOutlined />
            </Button>
          </Dropdown>

          <Dropdown overlay={sexMenu} trigger={['click']}>
            <Button className="text-white bg-gray-700 hover:bg-gray-600">
              Sex <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        {(selectedInterest.length > 0 || selectedAge || selectedSex) && (
          <Button className="bg-red-600 text-white flex items-center space-x-2 hover:bg-red-500" icon={<ClearOutlined />} onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
