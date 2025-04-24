import React, { useState } from "react";
import { Select, Button, Drawer } from "antd";
import { FilterOutlined, MenuOutlined } from "@ant-design/icons";
import FiltersSidebar from "./Filters";

// Example candidate data (you can replace these with real data or fetch from an API)
const candidatesData = [
  {
    id: "0",
    name: "Ines ",
    category: "Creator",
    image: ["https://res.cloudinary.com/dqtwi6rca/image/upload/v1743056286/users/ines/6A2F5E0B-E252-4FC8-9B21-189988A0B6D0.jpeg.webp"],
    description: "Expert in digital content creation.",

    specialties: [
      "Modèle pour shooting"
    ],
    age: 25,
    sex: "Femme",
    height: 1.70,
    weight: 58,
    town: "Tunis",
    eyeColor: "Noisette",
    hairColor:  "Roux",
    hairType: "Ondulés",
    skinColor: "Clair",

    
  },
  {
    id: 1,
    name: "Mohammed",
    category: "Creator",
    image: "https://res.cloudinary.com/dqtwi6rca/image/upload/v1743053164/users/larbi/received_1279601456794899.jpeg.webp",
    description: "Professional model with 5 years of experience.",
    specialties: ["Modèle pour shooting en studio", "Créateur UGC"],
    age: 28,
    sex: "Homme",
    height: 1.85,
    weight: 75,
    town: "Sfax",
    eyeColor: "Marron",
    hairColor: "Brun",
    hairType: "Lisses",
    skinColor: "Moyen",
    
  },
  {
    id: 2,
    name: "Sarah",
    category: "Creator",
    image: "https://res.cloudinary.com/dqtwi6rca/image/upload/v1742676145/users/leila/1000036907.jpg.webp",
    description: "Voice-over artist and content creator.",
    specialties: ["Voix-off", "Créateur UGC"],
    age: 23,
    sex: "Femme",
    height: 1.65,
    weight: 55,
    town: "Sousse",
    eyeColor: "Vert",
    hairColor: "Chatain",
    hairType: "Bouclés",
    skinColor: "Pâle",
    
  },
  {
    id: 3,
    name: "Karim",
    category: "Creator",
    image: "https://res.cloudinary.com/dqtwi6rca/image/upload/v1740188959/users/houssem/IMG_8884.jpeg.webp",
    description: "Professional model and content creator.",
    specialties: ["Modèle pour shooting en studio", "Créateur UGC"],
    age: 27,
    sex: "Homme",
    height: 1.80,
    weight: 70,
    town: "Tunis",
    eyeColor: "Marron foncé",
    hairColor: "Noir",
    hairType: "Lisses",
    skinColor: "Olive",
   
  },
  {
    id: 5,
    name: "Asma",
    category: "Creator",
    image: "https://res.cloudinary.com/dqtwi6rca/image/upload/v1741624710/users/sara/IMG_7628.jpeg.webp",
    description: "Expert in digital content creation.",
    specialties: ["Photography", "Videography", "Social Media"],
    age: 25,
    sex: "Femme",
    height: 1.70,
    weight: 58,
    town: "Tunis",
    eyeColor: "Bleu",
    hairColor: "Blond",
    hairType: "Ondulés",
    skinColor: "Clair",
    signs: ["Lunettes"],
    source: "techwood",
    createdAt: "2024-03-10"
  },
  {
    id: 6,
    name: "Ahmed",
    category: "Creator",
    image: "https://res.cloudinary.com/dqtwi6rca/image/upload/v1740651708/users/elbech/IMG_7954.jpeg.webp",
    description: "Professional model with 5 years of experience.",
    specialties: ["Modèle pour shooting en studio", "Créateur UGC"],
    age: 28,
    sex: "Homme",
    height: 1.85,
    weight: 75,
    town: "Sfax",
    eyeColor: "Marron",
    hairColor: "Brun",
    hairType: "Lisses",
    skinColor: "Moyen",

  },
  {
    id: 7,
    name: "Yasmine",
    category: "Creator",
    image: "https://res.cloudinary.com/dqtwi6rca/image/upload/v1740607786/users/cyrine/IMG_2808.jpeg.jpg",
    description: "Voice-over artist and content creator.",
    specialties: ["Voix-off", "Créateur UGC"],
    age: 23,
    sex: "Femme",
    height: 1.65,
    weight: 55,
    town: "Sousse",
    eyeColor: "Vert",
    hairColor: "Chatain",
    hairType: "Bouclés",
    skinColor: "Pâle",
  },
  {
    id: 8,
    name: "Mariem",
    category: "Creator",
    image: "https://res.cloudinary.com/dqtwi6rca/image/upload/v1738742851/IMG_0738.webp.webp",
    description: "Professional model and content creator.",
    specialties: ["Modèle pour shooting en studio", "Créateur UGC"],
    age: 27,
    sex: "Homme",
    height: 1.80,
    weight: 70,
    town: "Tunis",
    eyeColor: "Marron foncé",
    hairColor: "Noir",
    hairType: "Lisses",
    skinColor: "Olive",
  },
  
];

const CandidatePreview = () => {
  const [sortBy, setSortBy] = useState("Date");
  const [sortOrder, setSortOrder] = useState("Descending");
  const [filters, setFilters] = useState({});
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);

  // Apply filters and sorting to candidates
  const getFilteredAndSortedCandidates = () => {
    let filtered = [...candidatesData];

    // Text search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.description.toLowerCase().includes(searchLower) ||
        candidate.town?.toLowerCase().includes(searchLower)
      );
    }

    // Interest filter
    if (filters.selectedInterests?.length) {
      filtered = filtered.filter(candidate =>
        candidate.specialties?.some(specialty => 
          filters.selectedInterests.includes(specialty)
        )
      );
    }

    // Age filter
    if (filters.selectedAgeRange) {
      filtered = filtered.filter(candidate => {
        const age = candidate.age;
        return age >= filters.selectedAgeRange[0] && age <= filters.selectedAgeRange[1];
      });
    }

    // Sex filter
    if (filters.selectedSex?.length) {
      filtered = filtered.filter(candidate =>
        filters.selectedSex.includes(candidate.sex)
      );
    }

    // Height filter
    if (filters.selectedHeightRange) {
      filtered = filtered.filter(candidate => {
        const height = candidate.height;
        return height >= filters.selectedHeightRange[0] && height <= filters.selectedHeightRange[1];
      });
    }

    // Weight filter
    if (filters.selectedWeightRange) {
      filtered = filtered.filter(candidate => {
        const weight = candidate.weight;
        return weight >= filters.selectedWeightRange[0] && weight <= filters.selectedWeightRange[1];
      });
    }

    // Town filter
    if (filters.selectedTown) {
      filtered = filtered.filter(candidate =>
        candidate.town?.toLowerCase().includes(filters.selectedTown.toLowerCase())
      );
    }

    // Eye Color filter
    if (filters.selectedEyeColor?.length) {
      filtered = filtered.filter(candidate =>
        filters.selectedEyeColor.includes(candidate.eyeColor)
      );
    }

    // Hair Color filter
    if (filters.selectedHairColor?.length) {
      filtered = filtered.filter(candidate =>
        filters.selectedHairColor.includes(candidate.hairColor)
      );
    }

    // Hair Type filter
    if (filters.selectedHairType?.length) {
      filtered = filtered.filter(candidate =>
        filters.selectedHairType.includes(candidate.hairType)
      );
    }

    // Skin Color filter
    if (filters.selectedSkinColor?.length) {
      filtered = filtered.filter(candidate =>
        filters.selectedSkinColor.includes(candidate.skinColor)
      );
    }

    // Signs filter
    if (filters.selectedSign?.length) {
      filtered = filtered.filter(candidate =>
        candidate.signs?.some(sign => filters.selectedSign.includes(sign))
      );
    }

    // Source filter
    if (filters.selectedSource) {
      filtered = filtered.filter(candidate =>
        candidate.source === filters.selectedSource
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "Date") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "Ascending" ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === "Name") {
        return sortOrder === "Ascending" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "Relevance") {
        // Add your relevance sorting logic here
        return 0;
      }
      return 0;
    });

    return filtered;
  };

  const filteredCandidates = getFilteredAndSortedCandidates();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Filters Sidebar */}
      <div className="hidden lg:block w-80 bg-white rounded-lg">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <FiltersSidebar onFiltersChange={setFilters} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 rounded-xl">
        <div className="bg-white min-h-screen">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu for Mobile */}
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setIsFilterDrawerVisible(true)}
                className="lg:hidden"
              />
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-semibold text-gray-800">Candidates List</h1>
                <span className="text-gray-500 text-sm">({filteredCandidates.length} results)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                defaultValue="Date"
                style={{ width: 100 }}
                onChange={(value) => setSortBy(value)}
                options={[
                  { value: 'Date', label: 'Date' },
                  { value: 'Name', label: 'Name' },
                  { value: 'Relevance', label: 'Relevance' },
                ]}
                size="middle"
              />
              <Select
                defaultValue="Descending"
                style={{ width: 110 }}
                onChange={(value) => setSortOrder(value)}
                options={[
                  { value: 'Descending', label: 'Descending' },
                  { value: 'Ascending', label: 'Ascending' },
                ]}
                size="middle"
              />
              <Button 
                onClick={() => {
                  setSortBy('Date');
                  setSortOrder('Descending');
                }}
                size="middle"
              >
                Reset Sorting
              </Button>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          <Drawer
            title="Filters"
            placement="left"
            onClose={() => setIsFilterDrawerVisible(false)}
            open={isFilterDrawerVisible}
            width={280}
            className="lg:hidden"
          >
            <FiltersSidebar onFiltersChange={setFilters} />
          </Drawer>

          {/* Candidates Grid */}
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-64 h-48 object-cover blur-[11px]"
                    />
                    <div className="absolute top-4 right-4">
                      {/* <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {candidate.category}
                      </span> */}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {candidate.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{candidate.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      {candidate.followers && <span>👥 {candidate.followers}</span>}
                      {candidate.engagement && <span>📈 {candidate.engagement}</span>}
                    </div>
                    {candidate.specialties && (
                      <div className="flex flex-wrap gap-2">
                        {candidate.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {filteredCandidates.length === 0 && (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-600">No candidates found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePreview;

