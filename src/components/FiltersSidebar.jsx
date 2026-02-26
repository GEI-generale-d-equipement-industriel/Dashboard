import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input, Slider, Divider, Select, Grid, InputNumber } from "antd";
import {
  ClearOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CloseOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  ColumnHeightOutlined,
  GlobalOutlined,
  FilterOutlined
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
const knownSources = ["techwood", "canpol", "naturtint"];
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
    selectedTown: queryParams.get("town")
      ? queryParams.get("town").split(",")
      : [],


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
      filters.selectedWeightRange[0] !== 0 ||
      filters.selectedWeightRange[1] !== 120
    ) {
      params.set(
        "weightRange",
        `${filters.selectedWeightRange[0]}-${filters.selectedWeightRange[1]}`
      );
    }

    if (filters.selectedTown.length)
      params.set("town", filters.selectedTown.join(","));
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


  // Premium Tailwind CSS classes for structure
  const sidebarClasses = "h-full bg-slate-50 flex flex-col relative border-r border-slate-200";
  const headerClasses = "sticky top-0 bg-white/80 backdrop-blur-xl px-6 py-5 border-b border-slate-200 flex justify-between items-center z-20 shadow-sm";
  const contentClasses = `flex-1 overflow-y-auto px-6 py-6 ${!screens.lg ? 'pb-24' : 'pb-6'} space-y-5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent`;
  const filterSectionClasses = "bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300";
  const filterHeaderClasses = "px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors group";
  const filterHeaderTitleClasses = "text-[15px] font-bold text-slate-800 m-0 flex items-center gap-2 group-hover:text-blue-600 transition-colors";
  const filterBodyClasses = "px-5 pb-5 pt-2";

  return (
    <div className={sidebarClasses}>
      <div >
        {/* <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 m-0 flex items-center gap-2">
          <FilterOutlined className="text-blue-600" /> Filtres
        </h2> */}
        {!screens.lg && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors focus:outline-none"
          >
            <CloseOutlined className="text-lg" />
          </button>
        )}
      </div>

      <div className={contentClasses}>
        {isFilterActive && (
          <div className="mb-2">
            <Button
              onClick={handleClearFilters}
              icon={<ClearOutlined />}
              type="primary"
              danger
              block
              className="rounded-xl font-semibold h-10 shadow-sm shadow-red-100 hover:shadow-red-200"
            >
              Effacer les filtres
            </Button>
          </div>
        )}

        {/* Search Filter */}
        <div className={filterSectionClasses}>
          <div
            className={filterHeaderClasses}
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <h4 className={filterHeaderTitleClasses}>
              <SearchOutlined className="text-blue-500 text-lg" /> Recherche
            </h4>
            {isSearchVisible ? <CaretUpOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" /> : <CaretDownOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
          </div>
          {isSearchVisible && (
            <div className={filterBodyClasses}>
              <Input.Search
                placeholder="Rechercher un candidat..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                className="w-full"
                size="large"
                allowClear
              />
            </div>
          )}
        </div>

        {/* Interest Filter */}
        <div className={filterSectionClasses}>
          <div
            className={filterHeaderClasses}
            onClick={() => setIsInterestVisible(!isInterestVisible)}
          >
            <h4 className={filterHeaderTitleClasses}>
              <StarOutlined className="text-amber-500 text-lg" /> Intérêts
            </h4>
            {isInterestVisible ? <CaretUpOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" /> : <CaretDownOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
          </div>
          {isInterestVisible && (
            <div className={filterBodyClasses}>
              <Checkbox.Group
                options={interests}
                value={filters.selectedInterests}
                onChange={(checkedValues) =>
                  handleFilterChange("selectedInterests", checkedValues)
                }
                className="flex flex-col gap-3 font-medium text-gray-700"
              />
            </div>
          )}
        </div>

        {/* Grouped Filters: Demographics */}
        {/* <div className="filter-section" style={{ marginBottom: '16px' }}>
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
        </div> */}

        {/* Grouped Filters: Demographics */}
        <div className={filterSectionClasses}>
          <div
            className={filterHeaderClasses}
            onClick={() => setIsAgeVisible(!isAgeVisible)}
          >
            <h4 className={filterHeaderTitleClasses}>
              <UserOutlined className="text-emerald-500 text-lg" /> Démographie
            </h4>
            {isAgeVisible ? <CaretUpOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" /> : <CaretDownOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
          </div>
          {isAgeVisible && (
            <div className={filterBodyClasses}>
              <div className="space-y-6">
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Âge (ans)</h5>
                  <div className="flex items-center gap-3">
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
                      className="w-16 rounded-md"
                    />
                    <Slider
                      range
                      min={0}
                      max={60}
                      value={filters.selectedAgeRange}
                      onChange={(newRange) =>
                        handleFilterChange("selectedAgeRange", newRange)
                      }
                      className="flex-1 m-0 mx-2"
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
                      className="w-16 rounded-md"
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-400 font-medium px-1">
                    <span>{filters.selectedAgeRange[0]}</span>
                    <span>{filters.selectedAgeRange[1]}</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sexe</h5>
                  <Checkbox.Group
                    options={sexes}
                    value={filters.selectedSex}
                    onChange={(checkedValues) =>
                      handleFilterChange("selectedSex", checkedValues)
                    }
                    className="flex flex-col gap-2 font-medium text-gray-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Grouped Filters: Physical Characteristics */}
        <div className={filterSectionClasses}>
          <div
            className={filterHeaderClasses}
            onClick={() => setIsEyeColorVisible(!isEyeColorVisible)}
          >
            <h4 className={filterHeaderTitleClasses}>
              <EyeOutlined className="text-purple-500 text-lg" /> Caractéristiques Physiques
            </h4>
            {isEyeColorVisible ? <CaretUpOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" /> : <CaretDownOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
          </div>
          {isEyeColorVisible && (
            <div className={filterBodyClasses}>
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Couleur des yeux</h5>
                  <Select
                    mode="multiple"
                    placeholder="Sélectionner..."
                    value={filters.selectedEyeColor}
                    onChange={(value) =>
                      handleFilterChange("selectedEyeColor", value)
                    }
                    className="w-full"
                    allowClear
                  >
                    {eyeColors.map((color) => (
                      <Select.Option key={color} value={color}>
                        {color}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Couleur des cheveux</h5>
                  <Select
                    mode="multiple"
                    placeholder="Sélectionner..."
                    value={filters.selectedHairColor}
                    onChange={(value) =>
                      handleFilterChange("selectedHairColor", value)
                    }
                    className="w-full"
                    allowClear
                  >
                    {hairColors.map((color) => (
                      <Select.Option key={color} value={color}>
                        {color}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type de cheveux</h5>
                  <Select
                    mode="multiple"
                    placeholder="Sélectionner..."
                    value={filters.selectedHairType}
                    onChange={(value) => handleFilterChange("selectedHairType", value)}
                    className="w-full"
                    allowClear
                  >
                    {hairTypes.map((type) => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Couleur de peau</h5>
                  <Select
                    mode="multiple"
                    placeholder="Sélectionner..."
                    value={filters.selectedSkinColor}
                    onChange={(value) =>
                      handleFilterChange("selectedSkinColor", value)
                    }
                    className="w-full"
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
        <div className={filterSectionClasses}>
          <div
            className={filterHeaderClasses}
            onClick={() => setIsSignVisible(!isSignVisible)}
          >
            <h4 className={filterHeaderTitleClasses}>
              <InfoCircleOutlined className="text-sky-500 text-lg" /> Informations Avancées
            </h4>
            {isSignVisible ? <CaretUpOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" /> : <CaretDownOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
          </div>
          {isSignVisible && (
            <div className={filterBodyClasses}>
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Signes distinctifs</h5>
                  <Checkbox.Group
                    options={signs}
                    value={filters.selectedSign}
                    onChange={(checkedValues) =>
                      handleFilterChange("selectedSign", checkedValues)
                    }
                    className="flex flex-col gap-2 font-medium text-gray-700"
                  />
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ville</h5>
                  <Select
                    mode="multiple"
                    placeholder="Sélectionner..."
                    value={filters.selectedTown}
                    onChange={(value) => handleFilterChange("selectedTown", value)}
                    className="w-full"
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
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pilosité faciale</h5>
                    <Select
                      mode="multiple"
                      placeholder="Sélectionner..."
                      value={filters.selectedFacialHair}
                      onChange={(value) =>
                        handleFilterChange("selectedFacialHair", value)
                      }
                      className="w-full"
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
                    <div className="pt-2 border-t border-gray-100">
                      <Checkbox
                        checked={filters.selectedVeilStatus}
                        onChange={(e) => handleFilterChange('selectedVeilStatus', e.target.checked)}
                        className="font-medium text-gray-700"
                      >
                        Femme voilée
                      </Checkbox>
                    </div>

                    <div>
                      <Checkbox
                        checked={filters.selectedPregnancyStatus}
                        onChange={(e) => handleFilterChange('selectedPregnancyStatus', e.target.checked)}
                        className="font-medium text-gray-700"
                      >
                        Femme enceinte
                      </Checkbox>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Grouped Filters: Physical Dimensions */}
        <div className={filterSectionClasses}>
          <div
            className={filterHeaderClasses}
            onClick={() => setIsHeightVisible(!isHeightVisible)}
          >
            <h4 className={filterHeaderTitleClasses}>
              <ColumnHeightOutlined className="text-rose-500 text-lg" /> Dimensions Physiques
            </h4>
            {isHeightVisible ? <CaretUpOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" /> : <CaretDownOutlined className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
          </div>
          {isHeightVisible && (
            <div className={filterBodyClasses}>
              <div className="space-y-6">
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Taille (m)</h5>
                  <div className="px-2">
                    <Slider
                      range
                      min={0}
                      max={2.5}
                      step={0.01}
                      value={filters.selectedHeightRange}
                      onChange={(heightRange) =>
                        handleFilterChange("selectedHeightRange", heightRange)
                      }
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-400 font-medium px-1">
                      <span>{filters.selectedHeightRange[0]}m</span>
                      <span>{filters.selectedHeightRange[1]}m</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Poids (kg)</h5>
                  <div className="px-2">
                    <Slider
                      range
                      min={0}
                      max={120}
                      value={filters.selectedWeightRange}
                      onChange={(weightRange) =>
                        handleFilterChange("selectedWeightRange", weightRange)
                      }
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-400 font-medium px-1">
                      <span>{filters.selectedWeightRange[0]}kg</span>
                      <span>{filters.selectedWeightRange[1]}kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={filterSectionClasses}>
          <div className="px-4 py-3">
            <h4 className="text-[15px] font-bold text-slate-800 m-0 flex items-center gap-2 mb-3">
              <GlobalOutlined className="text-indigo-500 text-lg" /> Source
            </h4>
            <div className="mt-2">
              <Select
                placeholder="Sélectionner une source"
                value={filters.selectedSource || undefined}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedSource: value,
                  }))
                }
                allowClear
                className="w-full"
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
      </div>


    </div>
  );
};

export default FiltersSidebar;