// src/components/CandidateProfile/EditMode.jsx
import React, { useState, useEffect } from "react";
import { Input, Radio, Select, Switch,DatePicker ,Checkbox,Button} from "antd";
import dayjs from "dayjs";
const { TextArea } = Input;
const { Option } = Select;

export default function EditMode({
  candidate,
  handleInputChange,
  handleSelectChange,
  handleSwitchChange,
}) {

  const [initialCandidate, setInitialCandidate] = useState(candidate);
  const [currentCandidate, setCurrentCandidate] = useState(candidate);

  // Update initial state when candidate changes (useful for dynamic data loading)
  useEffect(() => {
    setInitialCandidate(candidate);
    setCurrentCandidate(candidate);
  }, [candidate]);

  // Reset to initial state when cancel is clicked
  const handleCancel = () => {
    setCurrentCandidate(initialCandidate);
    handleSelectChange("all", initialCandidate); // Pass initial state to parent function
  };


  const tunisianTowns = [
    "Tunis", "Sfax", "Sousse", "Kairouan", "Gabès", "Bizerte", "Nabeul",
    "Monastir", "Mahdia", "Hammamet", "Tozeur", "Tataouine", "Gafsa", 
    "Médenine", "Kebili", "Siliana", "Jendouba", "El Kef", "Kasserine",
    "Zaghouan", "Beja", "Ben Arous", "Manouba", "Ariana"
  ];

  const interestOptions = [
    { label: "Modèle pour shooting", value: "Modèle pour shooting" },
    { label: "Créateur UGC", value: "Créateur UGC" },
    { label: "Voix-off", value: "Voix-off" },
  ];

  const signOptions = [
    { label: "Appareil dentaire", value: "Appareil dentaire" },
    { label: "Lunettes", value: "Lunettes" },
    { label: "Tatouage", value: "Tatouage" },
    { label: "Cicatrice visible", value: "Cicatrice visible" },
    { label: "Gros grain de beauté", value: "Gros grain de beauté" },
    { label: "Tache de naissance", value: "Tache de naissance" },
    { label: "Taches claires ou foncées sur la peau", value: "Taches claires ou foncées sur la peau" },
    { label: "Yeux de couleurs différentes", value: "Yeux de couleurs différentes" },
    { label: "Calvitie partielle", value: "Calvitie partielle" },
    { label: "Piercing visible", value: "Piercing visible" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block font-medium">
            Prénom
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={candidate.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="name" className="block font-medium">
            Nom
          </label>
          <Input
            id="name"
            name="name"
            value={candidate.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium">Genre</label>
          <Radio.Group
            defaultValue={candidate.gender}
            onChange={(e) => handleSelectChange("gender", e.target.value)}
          >
            <Radio value="Homme">Homme</Radio>
            <Radio value="Femme">Femme</Radio>
          </Radio.Group>
        </div>
        <div>
          <label htmlFor="birthYear" className="block font-medium">
            Année de naissance
          </label>
          <DatePicker
            format="DD/MM/YYYY"
            value={candidate.birthDate ? dayjs(candidate.birthDate) : null}
            onChange={(date, dateString) => handleSelectChange("birthDate", dateString)}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label htmlFor="height" className="block font-medium">
            Taille (m)
          </label>
          <Input
            id="height"
            name="height"
            type="number"
            step="0.01"
            value={candidate.height}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="weight" className="block font-medium">
            Poids (kg)
          </label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            value={candidate.weight}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-medium">
            Téléphone
          </label>
          <Input
            id="phone"
            name="phone"
            value={candidate.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="town" className="block font-medium">
            Ville
          </label>
          <Select
            value={candidate.town}
            onChange={(value) => handleSelectChange("town", value)}
            style={{ width: "100%" }}
            placeholder="Sélectionnez une ville"
          >
            {tunisianTowns.map((town) => (
              <Option key={town} value={town}>{town}</Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Couleur des yeux</label>
          <Select
            defaultValue={candidate.eyeColor[0]}
            onChange={(value) => handleSelectChange("eyeColor", [value])}
            style={{ width: "100%" }}
          >
            <Option value="Bleu">Bleu</Option>
            <Option value="Marron foncé">Marron foncé</Option>
            <Option value="Noisette">Noisette</Option>
            <Option value="Vert">Vert</Option>
          </Select>
        </div>
        <div>
          <label className="block font-medium">Couleur des cheveux</label>
          <Select
            defaultValue={candidate.hairColor[0]}
            onChange={(value) => handleSelectChange("hairColor", [value])}
            style={{ width: "100%" }}
          >
            <Option value="Blond">Blond</Option>
            <Option value="Brun">Brun</Option>
            <Option value="Chatain">Chatain</Option>
            <Option value="Gris">Gris</Option>
            <Option value="Noir">Noir</Option>
            <Option value="Roux">Roux</Option>
            <Option value="Rouge">Rouge</Option>
          </Select>
        </div>
        <div>
          <label className="block font-medium">Type de cheveux</label>
          <Select
            defaultValue={candidate.hairType[0]}
            onChange={(value) => handleSelectChange("hairType", [value])}
            style={{ width: "100%" }}
          >
            <Option value="straight">Lisses</Option>
            <Option value="wavy">Ondulés</Option>
            <Option value="curly">Bouclés</Option>
            <Option value="kinky">Crépus</Option>
          </Select>
        </div>
        <div>
          <label className="block font-medium">Couleur de peau</label>
          <Select
            defaultValue={candidate.skinColor[0]}
            onChange={(value) => handleSelectChange("skinColor", [value])}
            style={{ width: "100%" }}
          >
            <Option value="black">Noire</Option>
            <Option value="brown">Brune</Option>
            <Option value="white">Blanche</Option>
          </Select>
        </div>
        {candidate.gender === "Homme" && (
          <div>
            <label className="block font-medium">Pilosité faciale</label>
            <Radio.Group 
              value={candidate.facialHair}
              onChange={(e) => handleSelectChange("facialHair", e.target.value)}
            >
              <Radio value="mustache">Moustache</Radio>
              <Radio value="beard">Barbe</Radio>
              <Radio value="goatee">Bouc</Radio>
              <Radio value="none">Aucune</Radio>
            </Radio.Group>
          </div>
        )}
        {candidate.gender === "Femme" && (
          <>
            <div className="flex items-center space-x-2">
              <Switch checked={candidate.veiled} onChange={(checked) => handleSwitchChange("veiled", checked)} />
              <span className="font-medium">Voilée</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={candidate.pregnant} onChange={(checked) => handleSwitchChange("pregnant", checked)} />
              <span className="font-medium">Enceinte</span>
            </div>
          </>
        )}
      </div>

      {/* Full-width fields */}
      <div className="col-span-">
        <label className="block font-medium">Intérêts</label>
        <Select
          mode="multiple"
          allowClear
          value={candidate.interest}
          onChange={(values) => handleSelectChange("interest", values)}
          style={{ width: "100%" }}
          placeholder="Sélectionnez vos intérêts"
        >
          {interestOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className="col-span-full">
        <label className="block font-medium">Signes particuliers</label>
        <Checkbox.Group
          value={candidate.sign}
          onChange={(values) => handleSelectChange("sign", values)}
        >
          <div className="grid grid-cols-2 gap-2 mt-1">
            {signOptions.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </div>

     
    </div>
  );
}
