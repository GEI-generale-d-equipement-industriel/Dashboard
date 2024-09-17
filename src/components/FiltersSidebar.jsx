// src/components/FiltersSidebar.jsx
import React, { useState } from 'react';
import { Button, Checkbox, Input, Slider, Divider } from 'antd';
import {
  ClearOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterByInterest,
  filterByName,
  filterByAge,
  filterBySex,
  clearFilters,
  restPages,
} from '../store/candidatesSlice';
import {debounce} from "lodash"
const interests = ['Modèle pour shooting en studio', 'Créateur UGC', 'Voix-off'];
const sexes = ['Homme', 'Femme'];

const FiltersSidebar = () => {
  const dispatch = useDispatch();

  const {
    searchTerm,
    selectedInterests,
    selectedAgeRange,
    selectedSex,
  } = useSelector((state) => state.candidates);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isInterestVisible, setIsInterestVisible] = useState(false);
  const [isAgeVisible, setIsAgeVisible] = useState(false);
  const [isSexVisible, setIsSexVisible] = useState(false);
  
  const handleSearch = (e) => {
    dispatch(filterByName(e.target.value));
    dispatch(restPages());
  };

  const handleInterestChange = (checkedValues) => {
    dispatch(filterByInterest(checkedValues));
    dispatch(restPages());
  };

  const handleAgeChange = (ageRange) => {
    dispatch(filterByAge(ageRange));
    dispatch(restPages());
  };

  const handleSexChange = (checkedValues) => {
    dispatch(filterBySex(checkedValues));
    dispatch(restPages());
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
      <span className="p-4 font-mono text-xl text-center block mb-4 border-b">
        Filters
      </span>
      {isFilterActive && (
        <div className="transition-opacity duration-300 mb-6">
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

      {/* Search Filter */}
      <div className="mb-6">
        <h4
          className="text-lg font-semibold font-mono text-gray-700 mb-3 flex hover:text-blue-500 cursor-pointer border-b pb-2"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
        >
          Search{' '}
          {isSearchVisible ? (
            <CaretUpOutlined className="text-sm ml-2" />
          ) : (
            <CaretDownOutlined className="text-sm ml-2" />
          )}
        </h4>
        {isSearchVisible && (
          <Input.Search
            placeholder="Search for a candidate..."
            value={searchTerm}
            onChange={handleSearch}
            enterButton
            className="rounded"
          />
        )}
      </div>

      {/* Interest Filter */}
      <div className="mb-6">
        <h4
          className="text-lg font-semibold font-mono text-gray-700 mb-3 flex hover:text-blue-500 cursor-pointer border-b pb-2"
          onClick={() => setIsInterestVisible(!isInterestVisible)}
        >
          Interest{' '}
          {isInterestVisible ? (
            <CaretUpOutlined className="text-sm ml-2" />
          ) : (
            <CaretDownOutlined className="text-sm ml-2" />
          )}
        </h4>
        {isInterestVisible && (
          <Checkbox.Group
            options={interests}
            value={selectedInterests}
            onChange={handleInterestChange}
            className="flex flex-col"
          />
        )}
      </div>

      {/* Age Filter */}
      <div className="mb-6">
        <h4
          className="text-lg font-semibold font-mono text-gray-700 mb-3 flex hover:text-blue-500 cursor-pointer border-b pb-2"
          onClick={() => setIsAgeVisible(!isAgeVisible)}
        >
          Age{' '}
          {isAgeVisible ? (
            <CaretUpOutlined className="text-sm ml-2" />
          ) : (
            <CaretDownOutlined className="text-sm ml-2" />
          )}
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

      {/* Sex Filter */}
      <div className="mb-6">
        <h4
          className="text-lg font-semibold font-mono text-gray-700 mb-3 flex hover:text-blue-500 cursor-pointer border-b pb-2"
          onClick={() => setIsSexVisible(!isSexVisible)}
        >
          Sex{' '}
          {isSexVisible ? (
            <CaretUpOutlined className="text-sm ml-2" />
          ) : (
            <CaretDownOutlined className="text-sm ml-2" />
          )}
        </h4>
        {isSexVisible && (
          <Checkbox.Group
            options={sexes}
            value={selectedSex}
            onChange={handleSexChange}
            className="flex flex-col"
          />
        )}
      </div>
    </div>
  );
};

export default FiltersSidebar;
