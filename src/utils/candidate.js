// Shared helpers for reading candidate records consistently across the
// list, the cards and the detail page.

export const toArray = (value) => {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
};

// Values can be arrays, comma-joined strings, or arrays of comma-joined strings.
export const splitList = (value) => {
  const items = toArray(value)
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(items)];
};

export const capitalize = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

// Names are stored lowercase by the backend ("ines ben salah" -> "Ines Ben Salah").
export const titleCase = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/(^|[\s'-])(\p{L})/gu, (_, sep, letter) => sep + letter.toUpperCase());

export const getFullName = (candidate) =>
  `${titleCase(candidate?.firstName)} ${titleCase(candidate?.name)}`.trim();

export const getAge =(candidate) => {
  const fromDate = parseInt(candidate?.birthDate?.substring(0, 4), 10);
  const year = Number(candidate?.birthYear) || fromDate;
  return year ? new Date().getFullYear() - year : null;
};

export const getHeight = (candidate) => {
  const value = parseFloat(candidate?.height);
  return Number.isFinite(value) && value > 0 ? value : null;
};

export const getWeight = (candidate) => {
  const value = parseFloat(candidate?.weight);
  return Number.isFinite(value) && value > 0 ? value : null;
};

export const getBmi = (candidate) => {
  const height = getHeight(candidate);
  const weight = getWeight(candidate);
  return height && weight ? weight / height ** 2 : null;
};

// The model has used both `interest` and `interests` over time.
export const getInterests = (candidate) =>
  splitList([...toArray(candidate?.interest), ...toArray(candidate?.interests)]);

export const INTEREST_SHORT_NAMES = {
  "Modèle pour shooting": "Modèle",
  "Modèle pour shooting en studio": "Modèle studio",
  "Créateur UGC": "UGC",
  "Voix-off": "Voix-off",
};

// Colour swatches used by the filters sidebar and the detail page.
export const SWATCHES = {
  hair: {
    Blond: "#e6c27a",
    Brun: "#6b4a2f",
    Chatain: "#8a5a3b",
    Noir: "#1a1a1a",
    Roux: "#b5532a",
    Gris: "#9aa0a6",
  },
  eye: {
    Bleu: "#4a90d9",
    Vert: "#5a9e6f",
    Marron: "#7a4b2a",
    Noir: "#1a1a1a",
    "Marron foncé": "#3e2616",
    Noisette: "#a9743d",
  },
  skin: {
    Clair: "#f3d9c4",
    Pâle: "#f8e8dc",
    Moyen: "#d9a982",
    Olive: "#b98d62",
    Foncé: "#8a5a3a",
    Noir: "#4a2e20",
  },
};

export const BMI_ZONES = [
  { key: "under", label: "Insuffisance pondérale", max: 18.5, color: "#5b9bd5" },
  { key: "normal", label: "Corpulence normale", max: 25, color: "#3fa56b" },
  { key: "over", label: "Surpoids", max: 30, color: "#f0b71d" },
  { key: "obese", label: "Obésité", max: Infinity, color: "#d9534f" },
];

export const getBmiZone = (bmi) =>
  BMI_ZONES.find((zone) => bmi < zone.max) || BMI_ZONES[BMI_ZONES.length - 1];
