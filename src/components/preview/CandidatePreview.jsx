import React, { useState } from "react";

// Example candidate data (you can replace these with real data or fetch from an API)
const candidatesData = [
  {
    id: 1,
    name: "Alice Johnson",
    category: "Creator",
    image: "/assets/candidate1.jpg",
    description: "Expert in digital content creation.",
  },
  {
    id: 2,
    name: "Brand X",
    category: "Brand",
    image: "/assets/candidate2.jpg",
    description: "Leading innovative tech brand.",
  },
  {
    id: 3,
    name: "Bob Smith",
    category: "Creator",
    image: "/assets/candidate3.jpg",
    description: "Passionate about visual storytelling.",
  },
  {
    id: 4,
    name: "Brand Y",
    category: "Brand",
    image: "/assets/candidate4.jpg",
    description: "Renowned for creative campaigns.",
  },
  {
    id: 5,
    name: "Carol White",
    category: "Creator",
    image: "/assets/candidate5.jpg",
    description: "Social media influencer and stylist.",
  },
  {
    id: 6,
    name: "Brand Z",
    category: "Brand",
    image: "/assets/candidate6.jpg",
    description: "Top-tier fashion brand.",
  },
  {
    id: 7,
    name: "David Lee",
    category: "Creator",
    image: "/assets/candidate7.jpg",
    description: "Videographer with a creative edge.",
  },
  {
    id: 8,
    name: "Brand A",
    category: "Brand",
    image: "/assets/candidate8.jpg",
    description: "Innovative in digital marketing.",
  },
];

const CandidatePreview = () => {
  // Set up a state to filter candidates. Default is "All".
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter candidates based on the selected category
  const filteredCandidates =
    selectedCategory === "All"
      ? candidatesData
      : candidatesData.filter((c) => c.category === selectedCategory);

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            Sneak Peek of Our Platform
          </h2>
          <p className="text-gray-400 mt-2">
            Explore a preview of the top candidates available on our platform.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          {["All", "Creator", "Brand"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded transition duration-300 ${
                selectedCategory === category
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-white hover:bg-yellow-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-4 text-white">
                {candidate.name}
              </h3>
              <p className="text-gray-400 mt-2">{candidate.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CandidatePreview;
