import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input, Slider,  Select, InputNumber } from "antd";
import {
  ClearOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

// import "../styles/FilterSidebar.css";
// const { useBreakpoint } = Grid;
const interests = [
  "Modèle pour shooting en studio",
  "Créateur UGC",
  "Voix-off",
];
const sexes = ["Homme", "Femme"];

const eyeColors = ["Bleu", "Vert", "Marron", "Noir", "Marron foncé"];
const hairTypes = ["Lisses", "Ondulés", "Bouclés", "Crépus"];
const hairColors = ["Blond", "Brun", "Chatain", "Noir", "Roux", "Gris"];
const skinColors = ["Clair", "Pâle", "Moyen", "Olive", "Foncé", "Noir"];

// const registrationTypes = ["Enfant", "Adulte"];

const FiltersSidebar = ({ onFiltersChange }) => {
  // const screens = useBreakpoint();
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
  // const [isSignVisible, setIsSignVisible] = useState(false);
 

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

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


  const isFilterActive =
    filters.searchTerm ||
    filters.selectedInterests.length > 0 ||
    filters.selectedAgeRange[0] !== 0 ||
    filters.selectedAgeRange[1] !== 60 ||
    filters.selectedSex.length > 0 ||
    filters.selectedRegistrationType;


  
    
    
  return (
    <div className="h-full bg-gray-100">
      {/* Clear Filters Button */}
      {isFilterActive && (
        <div className="p-4 border-b">
          <Button
            onClick={handleClearFilters}
            icon={<ClearOutlined />}
            danger
            className="w-full"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      <div className="p-4 space-y-6 ">
        {/* Search Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-lg font-semibold text-gray-800">Search</h4>
            <Button
              type="text"
              icon={isSearchVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            />
          </div>
          {isSearchVisible && (
            <Input.Search
              placeholder="Search for a candidate..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              enterButton={<SearchOutlined />}
              className="w-full"
            />
          )}
        </div>

        {/* Interest Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-lg font-semibold text-gray-800">Interest</h4>
            <Button
              type="text"
              icon={isInterestVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
              onClick={() => setIsInterestVisible(!isInterestVisible)}
            />
          </div>
          {isInterestVisible && (
            <Checkbox.Group
              options={interests}
              value={filters.selectedInterests}
              onChange={(checkedValues) => handleFilterChange("selectedInterests", checkedValues)}
              className="flex flex-col space-y-2"
            />
          )}
        </div>

        {/* Demographics Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-lg font-semibold text-gray-800">Demographics</h4>
            <Button
              type="text"
              icon={isAgeVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
              onClick={() => setIsAgeVisible(!isAgeVisible)}
            />
          </div>
          {isAgeVisible && (
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Age</h5>
                <div className="flex items-center space-x-2">
                  <InputNumber
                    min={0}
                    max={60}
                    value={filters.selectedAgeRange[0]}
                    onChange={(val) => {
                      if (typeof val !== "number" || isNaN(val)) return;
                      const maxAge = filters.selectedAgeRange[1];
                      const newMin = Math.min(val, maxAge);
                      handleFilterChange("selectedAgeRange", [newMin, maxAge]);
                    }}
                    className="w-20"
                  />
                  <Slider
                    range
                    min={0}
                    max={60}
                    value={filters.selectedAgeRange}
                    onChange={(newRange) => handleFilterChange("selectedAgeRange", newRange)}
                    className="flex-1"
                  />
                  <InputNumber
                    min={0}
                    max={60}
                    value={filters.selectedAgeRange[1]}
                    onChange={(val) => {
                      if (typeof val !== "number" || isNaN(val)) return;
                      const minAge = filters.selectedAgeRange[0];
                      const newMax = Math.max(val, minAge);
                      handleFilterChange("selectedAgeRange", [minAge, newMax]);
                    }}
                    className="w-20"
                  />
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Sex</h5>
                <Checkbox.Group
                  options={sexes}
                  value={filters.selectedSex}
                  onChange={(checkedValues) => handleFilterChange("selectedSex", checkedValues)}
                  className="flex flex-col space-y-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Physical Characteristics Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-lg font-semibold text-gray-800">Physical Characteristics</h4>
            <Button
              type="text"
              icon={isEyeColorVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
              onClick={() => setIsEyeColorVisible(!isEyeColorVisible)}
            />
          </div>
          {isEyeColorVisible && (
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Eye Color</h5>
                <Select
                  mode="multiple"
                  placeholder="Select Eye Color"
                  value={filters.selectedEyeColor}
                  onChange={(value) => handleFilterChange("selectedEyeColor", value)}
                  className="w-full"
                  allowClear
                >
                  {eyeColors.map((color) => (
                    <Select.Option key={color} value={color}>{color}</Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Hair Color</h5>
                <Select
                  mode="multiple"
                  placeholder="Select Hair Color"
                  value={filters.selectedHairColor}
                  onChange={(value) => handleFilterChange("selectedHairColor", value)}
                  className="w-full"
                  allowClear
                >
                  {hairColors.map((color) => (
                    <Select.Option key={color} value={color}>{color}</Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Hair Type</h5>
                <Select
                  mode="multiple"
                  placeholder="Select Hair Type"
                  value={filters.selectedHairType}
                  onChange={(value) => handleFilterChange("selectedHairType", value)}
                  className="w-full"
                  allowClear
                >
                  {hairTypes.map((type) => (
                    <Select.Option key={type} value={type}>{type}</Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Skin Color</h5>
                <Select
                  mode="multiple"
                  placeholder="Select Skin Color"
                  value={filters.selectedSkinColor}
                  onChange={(value) => handleFilterChange("selectedSkinColor", value)}
                  className="w-full"
                  allowClear
                >
                  {skinColors.map((color) => (
                    <Select.Option key={color} value={color}>{color}</Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Physical Dimensions Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">Physical Dimensions</h4>
            <Button
              type="text"
              icon={isHeightVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
              onClick={() => setIsHeightVisible(!isHeightVisible)}
            />
          </div>
          {isHeightVisible && (
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Height (m)</h5>
                <Slider
                  range
                  min={0}
                  max={2.5}
                  step={0.01}
                  value={filters.selectedHeightRange}
                  onChange={(heightRange) => handleFilterChange("selectedHeightRange", heightRange)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{filters.selectedHeightRange[0]}m</span>
                  <span>{filters.selectedHeightRange[1]}m</span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Weight (kg)</h5>
                <Slider
                  range
                  min={0}
                  max={120}
                  value={filters.selectedWeightRange}
                  onChange={(weightRange) => handleFilterChange("selectedWeightRange", weightRange)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{filters.selectedWeightRange[0]}kg</span>
                  <span>{filters.selectedWeightRange[1]}kg</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information Filter */}
       

        {/* Source Filter */}
        
      </div>
    </div>
  );
};

export default FiltersSidebar;