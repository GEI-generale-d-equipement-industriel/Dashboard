import React from 'react';
import { Menu, Button, Checkbox, Input } from 'antd';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
  filterByInterest,
  filterByName,
  filterByAge,
  filterBySex,
  clearFilters,
  restPages,
} from '../store/candidatesSlice';

const interests = ['Modèle pour shooting en studio', 'Créateur UGC', 'Voix-off'];
const ages = ['18-25', '26-35', '36-45', '46-60', '60+'];
const sexes = ['Homme', 'Femme'];

const FiltersSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedInterest,
  setSelectedInterest,
  selectedAge,
  setSelectedAge,
  selectedSex,
  setSelectedSex,
}) => {
  const dispatch = useDispatch();

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
    setSelectedAge([]);
    setSelectedSex([]);
  };

  const resetPage = () => dispatch(restPages());

  const clearAll = () => {
    handleClearFilters();
    resetPage();
  };

  return (
    <Menu
  mode="inline"
  style={{
    padding: '10px',
    borderRight: 0,
  }}
>
  <Menu.Item key="1" style={{ marginBottom: '20px' }}>
    <h4>Search</h4>
    <Input.Search
      placeholder="Search for a candidate..."
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      enterButton
      prefix={<SearchOutlined />}
      style={{ width: '100%' }}
    />
  </Menu.Item>

  <Menu.Item key="2" style={{ marginBottom: '20px' }}>
    <h4>Interest</h4>
    {interests.map((interest) => (
      <Checkbox
        key={interest}
        checked={selectedInterest.includes(interest)}
        onChange={(e) => {
          const checked = e.target.checked;
          const newInterests = checked
            ? [...selectedInterest, interest]
            : selectedInterest.filter((i) => i !== interest);
          handleInterestChange(newInterests);
        }}
        style={{ display: 'block', marginBottom: '5px' }}
      >
        {interest}
      </Checkbox>
    ))}
  </Menu.Item>

  <Menu.Item key="3" style={{ marginBottom: '20px' }}>
    <h4>Age</h4>
    {ages.map((age) => (
      <Checkbox
        key={age}
        checked={selectedAge.includes(age)}
        onChange={(e) => {
          const checked = e.target.checked;
          const newAges = checked
            ? [...selectedAge, age]
            : selectedAge.filter((a) => a !== age);
          handleAgeChange(newAges);
        }}
        style={{ display: 'block', marginBottom: '5px' }}
      >
        {age}
      </Checkbox>
    ))}
  </Menu.Item>

  <Menu.Item key="4" style={{ marginBottom: '20px' }}>
    <h4>Sex</h4>
    {sexes.map((sex) => (
      <Checkbox
        key={sex}
        checked={selectedSex.includes(sex)}
        onChange={(e) => {
          const checked = e.target.checked;
          const newSexes = checked
            ? [...selectedSex, sex]
            : selectedSex.filter((s) => s !== sex);
          handleSexChange(newSexes);
        }}
        style={{ display: 'block', marginBottom: '5px' }}
      >
        {sex}
      </Checkbox>
    ))}
  </Menu.Item>

  <Menu.Item key="5">
    <Button onClick={clearAll} icon={<ClearOutlined />} danger>
      Clear All Filters
    </Button>
  </Menu.Item>
</Menu>

  );
};

export default FiltersSidebar;
