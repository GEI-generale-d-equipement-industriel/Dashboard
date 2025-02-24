import React from "react";
import { Tag } from "antd"; // Import Ant Design Tag component for interests
import InfoItem from "./InfoItems"; // This should render a label/value pair

export default function DisplayMode({ candidate, user }) {
  return (
    <div className="space-y-8">
      {/* Candidate Profile Section */}
      <div className="p-4 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Informations Candidat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Prénom" value={candidate.firstName} />
          <InfoItem label="Nom" value={candidate.name} />
          <InfoItem label="Genre" value={candidate.gender} />
          <InfoItem
            label="Année de naissance"
            value={
              candidate.birthDate
                ? candidate.birthDate.substring(0, 10)
                : candidate.birthYear
            }
          />
          <InfoItem label="Taille" value={`${candidate.height} m`} />
          <InfoItem label="Poids" value={`${candidate.weight} kg`} />
          <InfoItem label="Téléphone" value={candidate.phone} />
          <InfoItem label="Ville" value={candidate.town} />
          <InfoItem
            label="Couleur des yeux"
            value={candidate.eyeColor ? candidate.eyeColor.join(", ") : ""}
          />
          <InfoItem
            label="Couleur des cheveux"
            value={candidate.hairColor ? candidate.hairColor.join(", ") : ""}
          />
          <InfoItem
            label="Type de cheveux"
            value={candidate.hairType ? candidate.hairType.join(", ") : ""}
          />
          <InfoItem
            label="Couleur de peau"
            value={candidate.skinColor ? candidate.skinColor.join(", ") : ""}
          />
          <InfoItem label="Pilosité faciale" value={candidate.facialHair || "-"} />

          {/* Conditionally Render Based on Gender */}
          {candidate.gender === "Femme" && (
            <>
              <InfoItem label="Voilée" value={candidate.veiled ? "Oui" : "Non"} />
              <InfoItem label="Enceinte" value={candidate.pregnant ? "Oui" : "Non"} />
            </>
          )}

          {/* Display Interests as Tags */}
          <div className="col-span-2">
            <h3 className="text-md font-semibold">Intérêts</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.interest && candidate.interest.length > 0 ? (
                candidate.interest.map((item, index) => (
                  <Tag key={index} color="blue">
                    {item}
                  </Tag>
                ))
              ) : (
                <span>-</span>
              )}
            </div>
          </div>

          {/* Display Signes Particuliers */}
          <InfoItem
            label="Signes particuliers"
            value={candidate.sign ? candidate.sign.join(", ") : "-"}
          />
        </div>

        {/* Audio Recording */}
       
      </div>
    </div>
  );
}
