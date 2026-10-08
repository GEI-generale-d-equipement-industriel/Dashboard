import React, { useEffect, useRef, useState } from "react";
import { Collapse, Input, Select, Slider, Switch } from "antd";
import { ManOutlined, WomanOutlined } from "@ant-design/icons";
import { Search, SlidersHorizontal, X } from "lucide-react";

import BmTheme from "./ui/BmTheme";
import ChipGroup from "./ui/ChipGroup";
import useCandidateFilters, { DEFAULT_RANGES } from "../Hooks/useCandidateFilters";
import { SWATCHES } from "../utils/candidate";

const interests = ["Modèle pour shooting en studio", "Créateur UGC", "Voix-off"];
const sexes = ["Homme", "Femme"];
const sexIcons = {
  Homme: <ManOutlined />,
  Femme: <WomanOutlined />,
};
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

const Field = ({ label, aside, children }) => (
  <div className="bm-field">
    <div className="bm-field__head">
      <span className="bm-field__label">{label}</span>
      {aside && <span className="bm-field__aside">{aside}</span>}
    </div>
    {children}
  </div>
);

// A range slider that keeps the pointer fluid and only writes to the URL on release.
const RangeField = ({ label, unit, range, min, max, step = 1, format = (n) => n, onCommit }) => {
  const [draft, setDraft] = useState(range);

  useEffect(() => {
    setDraft(range);
  }, [range]);

  const isDefault = draft[0] === min && draft[1] === max;

  return (
    <Field
      label={label}
      aside={isDefault ? "Tous" : `${format(draft[0])} – ${format(draft[1])} ${unit}`}
    >
      <Slider
        range
        min={min}
        max={max}
        step={step}
        value={draft}
        onChange={setDraft}
        onChangeComplete={onCommit}
        tooltip={{ formatter: (value) => `${format(value)} ${unit}` }}
      />
    </Field>
  );
};

const SectionTitle = ({ children, count }) => (
  <span className="bm-acc__title">
    {children}
    {count > 0 && <span className="bm-count">{count}</span>}
  </span>
);

const FiltersSidebar = ({ onClose }) => {
  const { filters, update, clearAll, activeCount, countByGroup } = useCandidateFilters();

  // Typing is debounced into the URL; external changes (chips, reset) flow back in.
  const [term, setTerm] = useState(filters.searchTerm);
  const pushedTerm = useRef(filters.searchTerm);

  useEffect(() => {
    if (filters.searchTerm !== pushedTerm.current) {
      pushedTerm.current = filters.searchTerm;
      setTerm(filters.searchTerm);
    }
  }, [filters.searchTerm]);

  useEffect(() => {
    if (term === pushedTerm.current) return undefined;
    const timer = setTimeout(() => {
      pushedTerm.current = term;
      update({ searchTerm: term });
    }, 350);
    return () => clearTimeout(timer);
  }, [term, update]);

  const hasMale = filters.sex.includes("Homme");
  const hasFemale = filters.sex.includes("Femme");

  const sections = [
    {
      key: "profile",
      label: <SectionTitle count={countByGroup.profile}>Profil</SectionTitle>,
      children: (
        <>
          <Field label="Type de prestation">
            <ChipGroup
              options={interests}
              value={filters.interests}
              onChange={(value) => update({ interests: value })}
            />
          </Field>
          <Field label="Sexe">
            <ChipGroup
              options={sexes}
              icons={sexIcons}
              value={filters.sex}
              onChange={(value) => update({ sex: value })}
            />
          </Field>
        </>
      ),
    },
    {
      key: "body",
      label: <SectionTitle count={countByGroup.body}>Âge, taille & poids</SectionTitle>,
      children: (
        <>
          <RangeField
            label="Âge"
            unit="ans"
            range={filters.ageRange}
            min={DEFAULT_RANGES.ageRange[0]}
            max={DEFAULT_RANGES.ageRange[1]}
            onCommit={(value) => update({ ageRange: value })}
          />
          <RangeField
            label="Taille"
            unit="m"
            range={filters.heightRange}
            min={DEFAULT_RANGES.heightRange[0]}
            max={DEFAULT_RANGES.heightRange[1]}
            step={0.01}
            format={(n) => Number(n).toFixed(2)}
            onCommit={(value) => update({ heightRange: value })}
          />
          <RangeField
            label="Poids"
            unit="kg"
            range={filters.weightRange}
            min={DEFAULT_RANGES.weightRange[0]}
            max={DEFAULT_RANGES.weightRange[1]}
            onCommit={(value) => update({ weightRange: value })}
          />
        </>
      ),
    },
    {
      key: "look",
      label: <SectionTitle count={countByGroup.look}>Apparence</SectionTitle>,
      children: (
        <>
          <Field label="Cheveux">
            <ChipGroup
              options={hairColors}
              swatches={SWATCHES.hair}
              value={filters.hairColor}
              onChange={(value) => update({ hairColor: value })}
            />
          </Field>
          <Field label="Type de cheveux">
            <ChipGroup
              options={hairTypes}
              value={filters.hairType}
              onChange={(value) => update({ hairType: value })}
            />
          </Field>
          <Field label="Yeux">
            <ChipGroup
              options={eyeColors}
              swatches={SWATCHES.eye}
              value={filters.eyeColor}
              onChange={(value) => update({ eyeColor: value })}
            />
          </Field>
          <Field label="Peau">
            <ChipGroup
              options={skinColors}
              swatches={SWATCHES.skin}
              value={filters.skinColor}
              onChange={(value) => update({ skinColor: value })}
            />
          </Field>
        </>
      ),
    },
    {
      key: "more",
      label: <SectionTitle count={countByGroup.more}>Particularités</SectionTitle>,
      children: (
        <>
          <Field label="Signes distinctifs">
            <ChipGroup
              options={signs}
              value={filters.signs}
              onChange={(value) => update({ signs: value })}
            />
          </Field>
          {hasMale && (
            <Field label="Pilosité faciale">
              <ChipGroup
                options={facialHairOptions}
                value={filters.facialHair}
                onChange={(value) => update({ facialHair: value })}
              />
            </Field>
          )}
          {hasFemale && (
            <>
              <label className="bm-switch-row">
                <span>Femme voilée</span>
                <Switch
                  size="small"
                  checked={filters.veiled}
                  onChange={(checked) => update({ veiled: checked })}
                />
              </label>
              <label className="bm-switch-row">
                <span>Femme enceinte</span>
                <Switch
                  size="small"
                  checked={filters.pregnant}
                  onChange={(checked) => update({ pregnant: checked })}
                />
              </label>
            </>
          )}
          {!hasMale && !hasFemale && (
            <p className="bm-hint">
              Sélectionnez un sexe dans « Profil » pour afficher les filtres associés.
            </p>
          )}
        </>
      ),
    },
    {
      key: "where",
      label: <SectionTitle count={countByGroup.where}>Ville & source</SectionTitle>,
      children: (
        <>
          <Field label="Ville">
            <Select
              mode="multiple"
              allowClear
              showSearch
              maxTagCount="responsive"
              placeholder="Toutes les villes"
              value={filters.town}
              onChange={(value) => update({ town: value })}
              options={towns.map((town) => ({ value: town, label: town }))}
              style={{ width: "100%" }}
            />
          </Field>
          <Field label="Source">
            <Select
              allowClear
              placeholder="Toutes les sources"
              value={filters.source || undefined}
              onChange={(value) => update({ source: value || "" })}
              options={knownSources.map((source) => ({ value: source, label: source }))}
              style={{ width: "100%" }}
            />
          </Field>
        </>
      ),
    },
  ];

  return (
    <BmTheme>
      <aside className="bm-filters" aria-label="Filtres">
        <header className="bm-filters__head">
          <div className="bm-filters__title">
            <SlidersHorizontal size={18} />
            <h2>Filtres</h2>
            {activeCount > 0 && <span className="bm-count bm-count--gold">{activeCount}</span>}
          </div>
          <div className="bm-filters__head-actions">
            {activeCount > 0 && (
              <button type="button" className="bm-link" onClick={clearAll}>
                Réinitialiser
              </button>
            )}
            {onClose && (
              <button
                type="button"
                className="bm-icon-btn"
                onClick={onClose}
                aria-label="Fermer les filtres"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </header>

        <div className="bm-filters__body">
          <div className="bm-filters__search">
            <Input
              size="large"
              allowClear
              prefix={<Search size={16} className="bm-muted-icon" />}
              placeholder="Rechercher un talent…"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              aria-label="Rechercher un talent"
            />
          </div>

          <Collapse
            ghost
            className="bm-acc"
            defaultActiveKey={["profile"]}
            expandIconPosition="end"
            items={sections}
          />
        </div>

        {onClose && (
          <footer className="bm-filters__foot">
            <button type="button" className="bm-btn bm-btn--primary bm-btn--block" onClick={onClose}>
              Afficher les résultats
            </button>
          </footer>
        )}
      </aside>
    </BmTheme>
  );
};

export default FiltersSidebar;
