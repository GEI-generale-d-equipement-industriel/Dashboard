import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input, Slider, Divider, Select, Grid, InputNumber } from "antd";
import {
  ClearOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/FilterSidebar.css";

const { useBreakpoint } = Grid;
const interests = [
  "Modèle pour shooting en studio",
  "Créateur UGC",
  "Voix-off",
];
const sexes = ["Homme", "Femme"];
const facialHairOptions = ["Aucun", "Barbe", "Moustache", "Barbe et Moustache"];
const towns = [
  "Tunis",
  "Sfax",
  "Sousse",
  "Kairouan",
  "Gabès",
  "Bizerte",
  "Nabeul",
  "Monastir",
  "Mahdia",
  "Hammamet",
];
const eyeColors = ["Bleu", "Vert", "Marron", "Noir", "Marron foncé"];
const hairTypes = ["Lisses", "Ondulés", "Bouclés", "Crépus"];
const hairColors = ["Blond", "Brun", "Chatain", "Noir", "Roux", "Gris"];
const skinColors = ["Clair", "Pâle", "Moyen", "Olive", "Foncé", "Noir"];
const signs = ["Appareil dentaire", "Lunettes", "Tatouage"];
const knownSources = ["techwood", "canpol","naturtint"];
// const registrationTypes = ["Enfant", "Adulte"];

const FiltersSidebar = ({ onClose }) => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [filters, setFilters] = useState({
    searchTerm: queryParams.get("searchTerm") || "",
    selectedInterests: queryParams.get("interests")
      ? queryParams.get("interests").split(",")
      : [],
    selectedAgeRange: queryParams.get("ageRange")
      ? queryParams.get("ageRange").split("-").map(Number)
      : [0, 60],
    selectedSex: queryParams.get("sex")
      ? queryParams.get("sex").split(",")
      : [],
    selectedHeightRange: queryParams.get("heightRange")
      ? queryParams.get("heightRange").split("-").map(Number)
      : [0, 2.5],
    selectedWeightRange: queryParams.get("weightRange")
      ? queryParams.get("weightRange").split("-").map(Number)
      : [0, 120],
    selectedTown: queryParams.get("town") || "",


    selectedEyeColor: queryParams.get("eyeColor")
      ? queryParams.get("eyeColor").split(",")
      : [],
    selectedHairColor: queryParams.get("hairColor")
      ? queryParams.get("hairColor").split(",")
      : [],
    selectedHairType: queryParams.get("hairType")
      ? queryParams.get("hairType").split(",")
      : [],
    selectedSkinColor: queryParams.get("skinColor")
      ? queryParams.get("skinColor").split(",")
      : [],
    selectedFacialHair: queryParams.get("facialHair")
      ? queryParams.get("facialHair").split(",")
      : [],
    selectedVeilStatus: queryParams.get("veiled") === "true",
    selectedPregnancyStatus: queryParams.get("pregnant") === "true",
    selectedSign: queryParams.get("signs")
      ? queryParams.get("signs").split(",")
      : [],
    selectedRegistrationType: queryParams.get("registrationType") || "",
    selectedSource: queryParams.get("source") || "",
  });

  // Visibility States
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isInterestVisible, setIsInterestVisible] = useState(false);
  const [isAgeVisible, setIsAgeVisible] = useState(false);
  const [isHeightVisible, setIsHeightVisible] = useState(false);
  const [isEyeColorVisible, setIsEyeColorVisible] = useState(false);
  const [isSignVisible, setIsSignVisible] = useState(false);
 

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.selectedInterests.length)
      params.set("interests", filters.selectedInterests.join(","));
    if (filters.selectedSex.length)
      params.set("sex", filters.selectedSex.join(","));

    if (
      filters.selectedAgeRange[0] !== 0 ||
      filters.selectedAgeRange[1] !== 60
    ) {
      params.set(
        "ageRange",
        `${filters.selectedAgeRange[0]}-${filters.selectedAgeRange[1]}`
      );
    }

    if (
      filters.selectedHeightRange[0] !== 0 ||
      filters.selectedHeightRange[1] !== 2.5
    ) {
      params.set(
        "heightRange",
        `${filters.selectedHeightRange[0]}-${filters.selectedHeightRange[1]}`
      );
    }

    if (
      filters.selectedWeightRange[0] !== 0||
      filters.selectedWeightRange[1] !== 120
    ) {
      params.set(
        "weightRange",
        `${filters.selectedWeightRange[0]}-${filters.selectedWeightRange[1]}`
      );
    }

    if (filters.selectedTown) params.set("town", filters.selectedTown);
    if (filters.selectedEyeColor.length)
      params.set("eyeColor", filters.selectedEyeColor.join(","));
    if (filters.selectedHairColor.length)
      params.set("hairColor", filters.selectedHairColor.join(","));
    if (filters.selectedHairType.length)
      params.set("hairType", filters.selectedHairType.join(","));
    if (filters.selectedSkinColor.length)
      params.set("skinColor", filters.selectedSkinColor.join(","));
    if (filters.selectedFacialHair.length)
      params.set("facialHair", filters.selectedFacialHair.join(","));
    if (filters.selectedPregnancyStatus) params.set("pregnant", "true");
    if (filters.selectedVeilStatus) params.set("veiled", "true");
    if (filters.selectedSign.length)
      params.set("signs", filters.selectedSign.join(","));
    if (filters.selectedRegistrationType)
      params.set("registrationType", filters.selectedRegistrationType);
    if (filters.selectedSource) params.set("source", filters.selectedSource);

    navigate({ search: params.toString() });
  }, [filters, navigate]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  // Handlers for Filters

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedInterests: [],
      selectedAgeRange: [0, 60],
      selectedSex: [],
      selectedHeightRange: [0, 2.5],
      selectedWeightRange: [0, 120],
      selectedTown: "",
      selectedEyeColor: [],
      selectedHairColor: [],
      selectedHairType: [],
      selectedSkinColor: [],
      selectedFacialHair: [],
      selectedPregnancyStatus: false,
      selectedVeilStatus: false,
      selectedSign: [],
      selectedRegistrationType: "",
    });
  };

  // const handleMinAgeChange = (value) => {
  //   // Safely parse the new value
  //   if (typeof value !== "number" || isNaN(value)) return;

  //   // Clamps user input so min doesn't exceed the current max
  //   const currentMax = filters.selectedAgeRange[1];
  //   const newMin = Math.min(value, currentMax);

  //   setFilters((prev) => ({
  //     ...prev,
  //     selectedAgeRange: [newMin, currentMax],
  //   }));
  // };

  // const handleMaxAgeChange = (value) => {
  //   if (typeof value !== "number" || isNaN(value)) return;

  //   const currentMin = filters.selectedAgeRange[0];
  //   const newMax = Math.max(value, currentMin);

  //   setFilters((prev) => ({
  //     ...prev,
  //     selectedAgeRange: [currentMin, newMax],
  //   }));
  // };
  const isFilterActive =
    filters.searchTerm ||
    filters.selectedInterests.length > 0 ||
    filters.selectedAgeRange[0] !== 0 ||
    filters.selectedAgeRange[1] !== 60 ||
    filters.selectedSex.length > 0 ||
    filters.selectedRegistrationType;


    const handleVeilStatusChange = (checkedValues) => {
      handleFilterChange('selectedVeilStatus', checkedValues.includes('Veiled'));
    };
    
    const handlePregnancyStatusChange = (checkedValues) => {
      handleFilterChange('selectedPregnancyStatus', checkedValues.includes('Pregnant'));
    };
    
    
  // Add new styles for mobile sidebar
  const sidebarStyle = {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    background: '#fff',
    position: 'relative',
  };

  const headerStyle = {
    position: 'sticky',
    top: 0,
    background: '#fff',
    padding: '16px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  };

  const contentStyle = {
    padding: '16px',
    paddingBottom: !screens.lg ? '80px' : '16px',
  };

  const bottomBarStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12px 16px',
    background: '#fff',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    zIndex: 11,
  };

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600,color:'#eeb720' }}>Filters</h2>
        {!screens.lg && (
          <Button
            icon={<CloseOutlined />}
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
      </div>

      <div style={contentStyle}>
        {isFilterActive && (
          <div style={{ marginBottom: '16px' }}>
            <Button
              onClick={handleClearFilters}
              icon={<ClearOutlined />}
              danger
              block
            >
              Clear All Filters
            </Button>
            <Divider style={{ margin: '16px 0' }} />
          </div>
        )}

        {/* Search Filter */}
        <div className="filter-section" style={{ marginBottom: '16px' }}>
          <h4
            className="filter-title"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            style={{ 
              padding: '12px 0',
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Search</span>
            {isSearchVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </h4>
          {isSearchVisible && (
            <div style={{ padding: '8px 0' }}>
              <Input.Search
                placeholder="Search for a candidate..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>

        {/* Interest Filter */}
        <div className="filter-section" style={{ marginBottom: '16px' }}>
          <h4
            className="filter-title"
            onClick={() => setIsInterestVisible(!isInterestVisible)}
            style={{ 
              padding: '12px 0',
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Interest</span>
            {isInterestVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </h4>
          {isInterestVisible && (
            <div style={{ padding: '8px 0' }}>
              <Checkbox.Group
                options={interests}
                value={filters.selectedInterests}
                onChange={(checkedValues) =>
                  handleFilterChange("selectedInterests", checkedValues)
                }
                className="checkbox-group"
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              />
            </div>
          )}
        </div>

        {/* Grouped Filters: Demographics */}
        <div className="filter-section" style={{ marginBottom: '16px' }}>
          <h4
            className="filter-title"
            onClick={() => setIsAgeVisible(!isAgeVisible)}
            style={{ 
              padding: '12px 0',
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Demographics</span>
            {isAgeVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </h4>
          {isAgeVisible && (
            <div style={{ padding: '8px 0' }}>
              <div className="pl-4">
                <div className="mb-4">
                  <h5 className="text-md">Age</h5>
                  <div className="flex items-center space-x-2">
                    {/* InputNumber for min age */}
                    <InputNumber
                      min={0}
                      max={60}
                      value={filters.selectedAgeRange[0]}
                      onChange={(val) => {
                        if (typeof val !== "number" || isNaN(val)) return; // Validate input
                        const maxAge = filters.selectedAgeRange[1];
                        const newMin = Math.min(val, maxAge); // Clamp value
                        handleFilterChange("selectedAgeRange", [newMin, maxAge]);
                      }}
                      style={{ width: 70 }}
                    />

                    {/* Age Slider */}
                    <Slider
                      range
                      min={0}
                      max={60}
                      value={filters.selectedAgeRange}
                      onChange={(newRange) =>
                        handleFilterChange("selectedAgeRange", newRange)
                      }
                      className="age-slider"
                      style={{ flex: 1 }}
                    />

                    {/* InputNumber for Maximum Age */}
                    <InputNumber
                      min={0}
                      max={60}
                      value={filters.selectedAgeRange[1]}
                      onChange={(val) => {
                        if (typeof val !== "number" || isNaN(val)) return; // Validate input
                        const minAge = filters.selectedAgeRange[0];
                        const newMax = Math.max(val, minAge); // Clamp value
                        handleFilterChange("selectedAgeRange", [minAge, newMax]);
                      }}
                      style={{ width: 70 }}
                    />
                  </div>

                  {/* Optional: show values under the slider */}
                  <div className="age-range">
                    <span>{filters.selectedAgeRange[0]}</span>
                    <span>{filters.selectedAgeRange[1]}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="text-md">Sex</h5>
                  <Checkbox.Group
                    options={sexes}
                    value={filters.selectedSex}
                    onChange={(checkedValues) =>
                      handleFilterChange("selectedSex", checkedValues)
                    }
                    className="checkbox-group"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grouped Filters: Physical Characteristics */}
        <div className="filter-section" style={{ marginBottom: '16px' }}>
          <h4
            className="filter-title"
            onClick={() => setIsEyeColorVisible(!isEyeColorVisible)}
            style={{ 
              padding: '12px 0',
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Physical Characteristics</span>
            {isEyeColorVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </h4>
          {isEyeColorVisible && (
            <div style={{ padding: '8px 0' }}>
              <div className="pl-4">
                <div className="mb-4">
                  <h5 className="text-md">Eye Color</h5>
                  <Select
                    mode="multiple"
                    placeholder="Select Eye Color"
                    value={filters.selectedEyeColor}
                    onChange={(value) =>
                      handleFilterChange("selectedEyeColor", value)
                    }
                    className="filter-select w-full"
                    allowClear
                  >
                    {eyeColors.map((color) => (
                      <Select.Option key={color} value={color}>
                        {color}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div className="mb-4">
                  <h5 className="text-md">Hair Color</h5>
                  <Select
                    mode="multiple"
                    placeholder="Select Hair Color"
                    value={filters.selectedHairColor}
                    onChange={(value) =>
                      handleFilterChange("selectedHairColor", value)
                    }
                    className="filter-select w-full"
                    allowClear
                  >
                    {hairColors.map((color) => (
                      <Select.Option key={color} value={color}>
                        {color}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div className="mb-4">
                  <h5 className="text-md">Hair Type</h5>
                  <Select
                    mode="multiple"
                    placeholder="Select Hair Type"
                    value={filters.selectedHairType}
                    onChange={(value) => handleFilterChange("selectedHairType", value)}
                    className="filter-select w-full"
                    allowClear
                  >
                    {hairTypes.map((type) => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div className="mb-4">
                  <h5 className="text-md">Skin Color</h5>
                  <Select
                    mode="multiple"
                    placeholder="Select Skin Color"
                    value={filters.selectedSkinColor}
                    onChange={(value) =>
                      handleFilterChange("selectedSkinColor", value)
                    }
                    className="filter-select w-full"
                    allowClear
                  >
                    {skinColors.map((color) => (
                      <Select.Option key={color} value={color}>
                        {color}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grouped Filters: Additional Information */}
        <div className="filter-section" style={{ marginBottom: '16px' }}>
          <h4
            className="filter-title"
            onClick={() => setIsSignVisible(!isSignVisible)}
            style={{ 
              padding: '12px 0',
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Additional Information</span>
            {isSignVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </h4>
          {isSignVisible && (
            <div style={{ padding: '8px 0' }}>
              <div className="pl-4">
                <div className="mb-4">
                  <h5 className="text-md">Signs</h5>
                  <Checkbox.Group
                    options={signs}
                    value={filters.selectedSign}
                    onChange={(checkedValues) =>
                      handleFilterChange("selectedSign", checkedValues)
                    }
                    className="checkbox-group"
                  />
                </div>

                <div className="mb-4">
                  <h5 className="text-md">Town</h5>
                  <Select
                    mode="multiple"
                    placeholder="Select Town"
                    value={filters.selectedTown}
                    onChange={(value) => handleFilterChange("selectedTown", value)}
                    className="filter-select w-full"
                    allowClear
                  >
                    {towns.map((town) => (
                      <Select.Option key={town} value={town}>
                        {town}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                {filters.selectedSex.includes("Homme") && (
                  <div className="mb-4">
                    <h5 className="text-md">Facial Hair</h5>
                    <Select
                      mode="multiple"
                      placeholder="Select Facial Hair"
                      value={filters.selectedFacialHair}
                      onChange={(value) =>
                        handleFilterChange("selectedFacialHair", value)
                      }
                      className="filter-select w-full"
                      allowClear
                    >
                      {facialHairOptions.map((option) => (
                        <Select.Option key={option} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                )}

                {filters.selectedSex.includes('Femme') && (
                  <>
                    <div className="mb-4">
                      <h5 className="text-md">Veil Status</h5>
                      <Checkbox.Group
                        options={['Veiled']}
                        value={filters.selectedVeilStatus ? ['Veiled'] : []}
                        onChange={handleVeilStatusChange}
                        className="checkbox-group"
                      />
                    </div>

                    <div className="mb-4">
                      <h5 className="text-md">Pregnancy Status</h5>
                      <Checkbox.Group
                        options={['Pregnant']}
                        value={filters.selectedPregnancyStatus ? ['Pregnant'] : []}
                        onChange={handlePregnancyStatusChange}
                        className="checkbox-group"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Grouped Filters: Physical Dimensions */}
        <div className="filter-section" style={{ marginBottom: '16px' }}>
          <h4
            className="filter-title"
            onClick={() => setIsHeightVisible(!isHeightVisible)}
            style={{ 
              padding: '12px 0',
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Physical Dimensions</span>
            {isHeightVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </h4>
          {isHeightVisible && (
            <div style={{ padding: '2px 0' }}>
              <div className="pl-4">
                <div className="mb-4">
                  <h5 className="text-md">Height</h5>
                  <Slider
                    range
                    min={0}
                    max={2.5}
                    step={0.01}
                    value={filters.selectedHeightRange}
                    onChange={(heightRange) =>
                      handleFilterChange("selectedHeightRange", heightRange)
                    }
                    className="height-slider"
                  />
                  <div className="age-range">
                    <span>{filters.selectedHeightRange[0]}m </span>
                    <span>{filters.selectedHeightRange[1]}m</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-md">Weight</h5>
                  <Slider
                    range
                    min={0}
                    max={120}
                    value={filters.selectedWeightRange}
                    onChange={(weightRange) =>
                      handleFilterChange("selectedWeightRange", weightRange)
                    }
                    className="weight-slider"
                  />
                  <div className="age-range">
                    <span>{filters.selectedWeightRange[0]} kg</span>
                    <span>{filters.selectedWeightRange[1]} kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="filter-section" style={{ marginBottom: '16px' }}>
          <h4 className="filter-title">Source</h4>
          <Select
            placeholder="Select source"
            value={filters.selectedSource || undefined}
            onChange={(value) => 
              setFilters((prev) => ({
                ...prev,
                selectedSource: value,
              }))
            }
            allowClear
            style={{ width: "100%" }}
          >
            {knownSources.map((src) => (
              <Select.Option key={src} value={src}>
                {src}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      
    </div>
  );
};

export default FiltersSidebar;