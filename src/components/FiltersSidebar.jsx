import React, { useState } from 'react';
import { Button, Checkbox, Input, Slider, Divider, Select } from 'antd';
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
  filterByEyeColor,
  filterByHairColor,
  filterByHairType,
  filterByFacialHair,
  filterBySkinColor,
  filterByPregnancyStatus,
  filterByTown,
  filterBySign,
  filterByVeilStatus,
  clearFilters,
  restPages,
} from '../store/candidatesSlice';
import "../styles/FilterSidebar.css"

const interests = ['Modèle pour shooting en studio', 'Créateur UGC', 'Voix-off'];
const sexes = ['Homme', 'Femme'];
const facialHairOptions = ['Aucun', 'Barbe', 'Moustache', 'Barbe et Moustache'];
const towns = ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Gabès', 'Bizerte', 'Nabeul', 'Monastir', 'Mahdia', 'Hammamet'];
const eyeColors = ['Bleu', 'Vert', 'Marron', 'Noir', 'Gris'];
const hairTypes = ['Lisses', 'Ondulés', 'Bouclés', 'Crépus'];
const hairColors = ['Blond', 'Brun', 'Chatain', 'Noir', 'Roux', 'Gris'];
const skinColors = ['Clair', 'Pâle', 'Moyen', 'Olive', 'Foncé', 'Noir'];
const signs = ['Appareil dentaire', 'Lunettes', 'Tatouage'];

const FiltersSidebar = () => {
  const dispatch = useDispatch();

  const {
    searchTerm,
    selectedInterests,
    selectedAgeRange,
    selectedSex,
    selectedHeightRange,
    selectedWeightRange,
    selectedFacialHair,
    selectedPregnancyStatus,
    selectedVeilStatus,
    selectedTown,
    selectedEyeColor,
    selectedHairColor,
    selectedHairType,
    selectedSkinColor,
    selectedSign,
  } = useSelector((state) => state.candidates);

  // Visibility States
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isInterestVisible, setIsInterestVisible] = useState(false);
  const [isAgeVisible, setIsAgeVisible] = useState(false);
  const [isSexVisible, setIsSexVisible] = useState(false);
  const [isHeightVisible, setIsHeightVisible] = useState(false);
  const [isWeightVisible, setIsWeightVisible] = useState(false);
  const [isFacialHairVisible, setIsFacialHairVisible] = useState(false);
  const [isPregnancyStatusVisible, setIsPregnancyStatusVisible] = useState(false);
  const [isVeilStatusVisible, setIsVeilStatusVisible] = useState(false);
  const [isTownVisible, setIsTownVisible] = useState(false);
  const [isEyeColorVisible, setIsEyeColorVisible] = useState(false);
  const [isHairColorVisible, setIsHairColorVisible] = useState(false);
  const [isHairTypeVisible, setIsHairTypeVisible] = useState(false);
  const [isSkinColorVisible, setIsSkinColorVisible] = useState(false);
  const [isSignVisible, setIsSignVisible] = useState(false);

  // Handlers for Filters
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

  const handleFacialHairChange = (value) => {
    dispatch(filterByFacialHair(value));
    dispatch(restPages());
  };

  const handlePregnancyStatusChange = (checkedValues) => {
    dispatch(filterByPregnancyStatus(checkedValues.includes("Pregnant")));
    dispatch(restPages());
  };

  const handleVeilStatusChange = (checkedValues) => {
    dispatch(filterByVeilStatus(checkedValues.includes("Veiled")));
    dispatch(restPages());
  };

  const handleTownChange = (value) => {
    dispatch(filterByTown(value));
    dispatch(restPages());
  };

  const handleEyeColorChange = (value) => {
    dispatch(filterByEyeColor(value));
    dispatch(restPages());
  };

  const handleHairColorChange = (value) => {
    dispatch(filterByHairColor(value));
    dispatch(restPages());
  };

  const handleHairTypeChange = (value) => {
    dispatch(filterByHairType(value));
    dispatch(restPages());
  };

  const handleSkinColorChange = (value) => {
    dispatch(filterBySkinColor(value));
    dispatch(restPages());
  };

  const handleSignChange = (checkedValues) => {
    dispatch(filterBySign(checkedValues));
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

      {/* Grouped Filters: Demographics */}
      <div className="filter-section">
        <h4
          className="filter-title"
          onClick={() => setIsAgeVisible(!isAgeVisible)}
        >
          Demographics
          {isAgeVisible ? (
            <CaretUpOutlined className="caret-icon" />
          ) : (
            <CaretDownOutlined className="caret-icon" />
          )}
        </h4>
        {isAgeVisible && (
          <div className="pl-4">
            <div className="mb-4">
              <h5 className="text-md">Age</h5>
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
            </div>

            <div className="mb-4">
              <h5 className="text-md">Sex</h5>
              <Checkbox.Group
                options={sexes}
                value={selectedSex}
                onChange={handleSexChange}
                className="checkbox-group"
              />
            </div>
          </div>
        )}
      </div>

      {/* Grouped Filters: Physical Characteristics */}
      <div className="filter-section">
        <h4
          className="filter-title"
          onClick={() => setIsEyeColorVisible(!isEyeColorVisible)}
        >
          Physical Characteristics
          {isEyeColorVisible ? (
            <CaretUpOutlined className="caret-icon" />
          ) : (
            <CaretDownOutlined className="caret-icon" />
          )}
        </h4>
        {isEyeColorVisible && (
          <div className="pl-4">
            <div className="mb-4">
              <h5 className="text-md">Eye Color</h5>
              <Select
                placeholder="Select Eye Color"
                value={selectedEyeColor}
                onChange={handleEyeColorChange}
                className="filter-select w-full"
                allowClear
              >
                {eyeColors.map(color => (
                  <Select.Option key={color} value={color}>
                    {color}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="mb-4">
              <h5 className="text-md">Hair Color</h5>
              <Select
                placeholder="Select Hair Color"
                value={selectedHairColor}
                onChange={handleHairColorChange}
                className="filter-select w-full"
                allowClear
              >
                {hairColors.map(color => (
                  <Select.Option key={color} value={color}>
                    {color}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="mb-4">
              <h5 className="text-md">Hair Type</h5>
              <Select
                placeholder="Select Hair Type"
                value={selectedHairType}
                onChange={handleHairTypeChange}
                className="filter-select w-full"
                allowClear
              >
                {hairTypes.map(type => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="mb-4">
              <h5 className="text-md">Skin Color</h5>
              <Select
                placeholder="Select Skin Color"
                value={selectedSkinColor}
                onChange={handleSkinColorChange}
                className="filter-select w-full"
                allowClear
              >
                {skinColors.map(color => (
                  <Select.Option key={color} value={color}>
                    {color}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Grouped Filters: Additional Information */}
      <div className="filter-section">
        <h4
          className="filter-title"
          onClick={() => setIsSignVisible(!isSignVisible)}
        >
          Additional Information
          {isSignVisible ? (
            <CaretUpOutlined className="caret-icon" />
          ) : (
            <CaretDownOutlined className="caret-icon" />
          )}
        </h4>
        {isSignVisible && (
          <div className="pl-4">
            <div className="mb-4">
              <h5 className="text-md">Signs</h5>
              <Checkbox.Group
                options={signs}
                value={selectedSign}
                onChange={handleSignChange}
                className="checkbox-group"
              />
            </div>

            <div className="mb-4">
              <h5 className="text-md">Town</h5>
              <Select
                placeholder="Select Town"
                value={selectedTown}
                onChange={handleTownChange}
                className="filter-select w-full"
                allowClear
              >
                {towns.map(town => (
                  <Select.Option key={town} value={town}>
                    {town}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {selectedSex.includes('Homme') && (
              <div className="mb-4">
                <h5 className="text-md">Facial Hair</h5>
                <Select
                  placeholder="Select Facial Hair"
                  value={selectedFacialHair}
                  onChange={handleFacialHairChange}
                  className="filter-select w-full"
                  allowClear
                >
                  {facialHairOptions.map(option => (
                    <Select.Option key={option} value={option}>
                      {option}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            {selectedSex.includes('Femme') && (
              <>
                <div className="mb-4">
                  <h5 className="text-md">Veil Status</h5>
                  <Checkbox.Group
                    options={['Veiled']}
                    value={selectedVeilStatus ? ['Veiled'] : []}
                    onChange={handleVeilStatusChange}
                    className="checkbox-group"
                  />
                </div>

                <div className="mb-4">
                  <h5 className="text-md">Pregnancy Status</h5>
                  <Checkbox.Group
                    options={['Pregnant']}
                    value={selectedPregnancyStatus ? ['Pregnant'] : []}
                    onChange={handlePregnancyStatusChange}
                    className="checkbox-group"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Grouped Filters: Physical Dimensions */}
      <div className="filter-section">
        <h4
          className="filter-title"
          onClick={() => setIsHeightVisible(!isHeightVisible)}
        >
          Physical Dimensions
          {isHeightVisible ? (
            <CaretUpOutlined className="caret-icon" />
          ) : (
            <CaretDownOutlined className="caret-icon" />
          )}
        </h4>
        {isHeightVisible && (
          <div className="pl-4">
            <div className="mb-4">
              <h5 className="text-md">Height</h5>
              <Slider
                range
                min={1.0}
                max={2.5}
                step={0.01}
                value={selectedHeightRange}
                onChange={handleHeightChange}
                className="age-slider"
              />
              <div className="age-range">
                <span>{selectedHeightRange[0]}m </span>
                <span>{selectedHeightRange[1]}m</span>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-md">Weight</h5>
              <Slider
                range
                min={40}
                max={120}
                value={selectedWeightRange}
                onChange={handleWeightChange}
                className="age-slider"
              />
              <div className="age-range">
                <span>{selectedWeightRange[0]} kg</span>
                <span>{selectedWeightRange[1]} kg</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersSidebar;
