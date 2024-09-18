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
  filterByHeight,
  filterByWeight,
  clearFilters,
  restPages,
} from '../store/candidatesSlice';
import "../styles/FilterSidebar.css"
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
    selectedHeightRange, // Height
    selectedWeightRange,
  } = useSelector((state) => state.candidates);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isInterestVisible, setIsInterestVisible] = useState(false);
  const [isAgeVisible, setIsAgeVisible] = useState(false);
  const [isSexVisible, setIsSexVisible] = useState(false);
  const [isHeightVisible, setIsHeightVisible] = useState(false); // For height
  const [isWeightVisible, setIsWeightVisible] = useState(false);
  
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
  const handleHeightChange = (heightRange) => {
    dispatch(filterByHeight(heightRange));
    dispatch(restPages());
  };

  const handleWeightChange = (weightRange) => {
    dispatch(filterByWeight(weightRange));
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
    <div className="filters-sidebar">
      <h2 className="filters-title">Filters</h2>

      {isFilterActive && (
        <div className="clear-filters-container">
          <Button
            onClick={handleClearFilters}
            icon={<ClearOutlined />}
            danger
            className="clear-filters-button"
          >
            Clear All Filters
          </Button>
          <Divider />
        </div>
      )}

      {/* Search Filter */}
      <div className="filter-section">
        <h4
          className="filter-title"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
        >
          Search{' '}
          {isSearchVisible ? (
            <CaretUpOutlined className="caret-icon" />
          ) : (
            <CaretDownOutlined className="caret-icon" />
          )}
        </h4>
        {isSearchVisible && (
          <Input.Search
            placeholder="Search for a candidate..."
            value={searchTerm}
            onChange={handleSearch}
            enterButton
            className="search-input"
          />
        )}
      </div>

      {/* Interest Filter */}
      <div className="filter-section">
        <h4
          className="filter-title"
          onClick={() => setIsInterestVisible(!isInterestVisible)}
        >
          Interest{' '}
          {isInterestVisible ? (
            <CaretUpOutlined className="caret-icon" />
          ) : (
            <CaretDownOutlined className="caret-icon" />
          )}
        </h4>
        {isInterestVisible && (
          <Checkbox.Group
            options={interests}
            value={selectedInterests}
            onChange={handleInterestChange}
            className="checkbox-group"
          />
        )}
      </div>

      {/* Age Filter */}
      <div className="filter-section">
        <h4
          className="filter-title"
          onClick={() => setIsAgeVisible(!isAgeVisible)}
        >
          Age{' '}
          {isAgeVisible ? (
            <CaretUpOutlined className="caret-icon" />
          ) : (
            <CaretDownOutlined className="caret-icon" />
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
              className="age-slider"
            />
            <div className="age-range">
              <span>{selectedAgeRange[0]}</span>
              <span>{selectedAgeRange[1]}</span>
            </div>
          </>
        )}
      </div>
      <div className="filter-section">
        <h4 className="filter-title" onClick={() => setIsHeightVisible(!isHeightVisible)}>
          Height {' '} {isHeightVisible ? <CaretUpOutlined className="caret-icon" /> : <CaretDownOutlined className="caret-icon" />}
        </h4>
        {isHeightVisible && (
          <>
            <Slider range min={1.0} max={2.5} step={0.01} value={selectedHeightRange} onChange={handleHeightChange} className="age-slider" />
            <div className="age-range">
              <span>{selectedHeightRange[0]}m </span>
              <span>{selectedHeightRange[1]}m</span>
            </div>
          </>
        )}
      </div>

      {/* Weight Filter */}
      <div className="filter-section">
        <h4 className="filter-title" onClick={() => setIsWeightVisible(!isWeightVisible)}>
          Weight {isWeightVisible ? <CaretUpOutlined className="caret-icon" /> : <CaretDownOutlined className="caret-icon" />}
        </h4>
        {isWeightVisible && (
          <>
            <Slider range min={40} max={120} value={selectedWeightRange} onChange={handleWeightChange} className="age-slider" />
            <div className="age-range">
              <span>{selectedWeightRange[0]} kg</span>
              <span>{selectedWeightRange[1]} kg</span>
            </div>
          </>
        )}
      </div>

      {/* Sex Filter */}
      <div className="filter-section">
        <h4
          className="filter-title"
          onClick={() => setIsSexVisible(!isSexVisible)}
        >
          Sex{' '}
          {isSexVisible ? (
            <CaretUpOutlined className="caret-icon" />
          ) : (
            <CaretDownOutlined className="caret-icon" />
          )}
        </h4>
        {isSexVisible && (
          <Checkbox.Group
            options={sexes}
            value={selectedSex}
            onChange={handleSexChange}
            className="checkbox-group"
          />
        )}
      </div>
    </div>
  );
};

export default FiltersSidebar;
