import React, { useState } from 'react';
import { Button, Checkbox, Input, Slider, Divider } from 'antd';
import { ClearOutlined, SearchOutlined, DownOutlined, UpOutlined,CaretDownOutlined,CaretUpOutlined  } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterByInterest,
  filterByName,
  filterByAge,
  filterBySex,
  clearFilters,
  restPages,
} from '../store/candidatesSlice';

const interests = ['Modèle pour shooting en studio', 'Créateur UGC', 'Voix-off'];
const sexes = ['Homme', 'Femme'];

const FiltersSidebar = () => {
  const dispatch = useDispatch();

  const { searchTerm, selectedInterests, selectedAgeRange, selectedSex } = useSelector(
    (state) => state.candidates
  );

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isInterestVisible, setIsInterestVisible] = useState(false);
  const [isAgeVisible, setIsAgeVisible] = useState(false);
  const [isSexVisible, setIsSexVisible] = useState(false);

  const handleSearch = (value) => {
    dispatch(filterByName(value));
  };

  const handleInterestChange = (interest) => {
    dispatch(filterByInterest(interest));
  };

  const handleAgeChange = (ageRange) => {
    dispatch(filterByAge(ageRange));
  };

  const handleSexChange = (sex) => {
    dispatch(filterBySex(sex));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(restPages());
  };
  const isFilterActive = 
  searchTerm || 
  selectedInterests.length > 0 || 
  selectedAgeRange[0] !== 0 || 
  selectedAgeRange[1] !== 60 || 
  selectedSex.length > 0;
  return (
    <div className="p-4 bg-white h-full overflow-auto rounded font-mono border rounded shadow-xl">
    <span className="p-4 font-mono text-xl text-center block mb-4 border-b">Filters</span>
    {isFilterActive && (
      <div
        className={`transition-opacity duration-300 mb-6 ${isFilterActive ? 'opacity-100' : 'opacity-0'}`}
      >
        <Button
          onClick={handleClearFilters}
          icon={<ClearOutlined className="text-sm" />}
          danger
          className="w-full rounded"
        >
          Clear All Filters
        </Button>
        <Divider />
      </div>
    )}

    <div className="mb-6">
      <h4
        className="text-lg font-semibold font-mono text-gray-700 mb-3 flex hover:text-blue-500 cursor-pointer border-b pb-2"
        onClick={() => setIsSearchVisible(!isSearchVisible)}
      >
        Search {isSearchVisible ? <CaretUpOutlined className="text-sm ml-2" /> : <CaretDownOutlined className="text-sm ml-2" />}
      </h4>
      {isSearchVisible && (
        <Input.Search
          placeholder="Search for a candidate..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          enterButton
          prefix={<SearchOutlined className="text-sm" />}
          className="rounded"
        />
      )}
    </div>
    
    <div className="mb-6">
      <h4
        className="text-lg font-semibold font-mono text-gray-700 mb-3 flex  hover:text-blue-500 cursor-pointer border-b pb-2"
        onClick={() => setIsInterestVisible(!isInterestVisible)}
      >
        Interest {isInterestVisible ? <CaretUpOutlined className="text-sm ml-2" /> : <CaretDownOutlined className="text-sm ml-2" />}
      </h4>
      {isInterestVisible && interests.map((interest) => (
        <Checkbox
          key={interest}
          checked={selectedInterests?.includes(interest)}
          onChange={(e) => {
            const isChecked = e.target.checked;
            const updatedInterests = isChecked
              ? [...selectedInterests, interest]
              : selectedInterests.filter((i) => i !== interest);
            handleInterestChange(updatedInterests);
          }}
          className="flex mb-2 text-sm font-semibold font-mono text-gray-700"
        >
          {interest}
        </Checkbox>
      ))}
    </div>
    
    <div className="mb-6">
      <h4
        className="text-lg font-semibold font-mono text-gray-700 mb-3 flex  hover:text-blue-500 cursor-pointer border-b pb-2"
        onClick={() => setIsAgeVisible(!isAgeVisible)}
      >
        Age {isAgeVisible ? <CaretUpOutlined className="text-sm ml-2" /> : <CaretDownOutlined className="text-sm ml-2" />}
      </h4>
      {isAgeVisible && (
        <>
          <Slider
            range
            min={0}
            max={60}
            value={selectedAgeRange}
            onChange={handleAgeChange}
            className="mb-4"
          />
          <div className="flex justify-between text-gray-600">
            <span>{selectedAgeRange[0]}</span>
            <span>{selectedAgeRange[1]}</span>
          </div>
        </>
      )}
    </div>
    
    <div className="mb-6">
      <h4
        className="text-lg font-semibold font-mono text-gray-700 mb-3 flex  hover:text-blue-500 cursor-pointer border-b pb-2"
        onClick={() => setIsSexVisible(!isSexVisible)}
      >
        Sex {isSexVisible ? <CaretUpOutlined className="text-sm ml-2" /> : <CaretDownOutlined className="text-sm ml-2" />}
      </h4>
      {isSexVisible && sexes.map((sex) => (
        <Checkbox
          key={sex}
          checked={selectedSex?.includes(sex)}
          onChange={(e) => {
            const isChecked = e.target.checked;
            const updatedSex = isChecked
              ? [...selectedSex, sex]
              : selectedSex.filter((s) => s !== sex);
            handleSexChange(updatedSex);
          }}
          className="flex mb-2 text-sm font-semibold font-mono text-gray-700"
        >
          {sex}
        </Checkbox>
      ))}
    </div>
  </div>
  );
};

export default FiltersSidebar;
