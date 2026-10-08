import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// The URL query string is the single source of truth for the talent filters.
// Both the sidebar and the list read from / write to it through this hook.

export const DEFAULT_RANGES = {
  ageRange: [0, 60],
  heightRange: [0, 2.5],
  weightRange: [0, 120],
};

export const DEFAULT_SORT = { sortBy: "createdAt", sortOrder: "desc" };

const LIST_KEYS = [
  "interests",
  "sex",
  "town",
  "eyeColor",
  "hairColor",
  "hairType",
  "skinColor",
  "facialHair",
  "signs",
];
const FLAG_KEYS = ["pregnant", "veiled"];
const TEXT_KEYS = ["searchTerm", "source", "registrationType"];
const RANGE_KEYS = Object.keys(DEFAULT_RANGES);

const parseList = (raw) => (raw ? raw.split(",").filter(Boolean) : []);

const parseRange = (raw, fallback) => {
  if (!raw) return fallback;
  const parts = raw.split("-").map(Number);
  return parts.length === 2 && parts.every(Number.isFinite) ? parts : fallback;
};

const isDefaultRange = (range, fallback) =>
  range[0] === fallback[0] && range[1] === fallback[1];

const parseFilters = (search) => {
  const params = new URLSearchParams(search);
  const filters = {};

  TEXT_KEYS.forEach((key) => {
    filters[key] = params.get(key) || "";
  });
  LIST_KEYS.forEach((key) => {
    filters[key] = parseList(params.get(key));
  });
  FLAG_KEYS.forEach((key) => {
    filters[key] = params.get(key) === "true";
  });
  RANGE_KEYS.forEach((key) => {
    filters[key] = parseRange(params.get(key), DEFAULT_RANGES[key]);
  });
  filters.sortBy = params.get("sortBy") || DEFAULT_SORT.sortBy;
  filters.sortOrder = params.get("sortOrder") || DEFAULT_SORT.sortOrder;

  return filters;
};

// Writes one filter into the query string, dropping it when it is empty/default.
const writeParam = (params, key, value) => {
  if (RANGE_KEYS.includes(key)) {
    if (!value || isDefaultRange(value, DEFAULT_RANGES[key])) params.delete(key);
    else params.set(key, `${value[0]}-${value[1]}`);
  } else if (LIST_KEYS.includes(key)) {
    if (!value?.length) params.delete(key);
    else params.set(key, value.join(","));
  } else if (FLAG_KEYS.includes(key)) {
    if (value) params.set(key, "true");
    else params.delete(key);
  } else if (key === "sortBy" || key === "sortOrder") {
    if (!value || value === DEFAULT_SORT[key]) params.delete(key);
    else params.set(key, value);
  } else if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
};

const formatRange = (range, unit) => `${range[0]}–${range[1]} ${unit}`;

// Builds the removable "chips" shown above the results.
const buildChips = (filters) => {
  const chips = [];
  const push = (id, group, label, patch) => chips.push({ id, group, label, patch });

  if (filters.searchTerm.trim()) {
    push("search", "search", `“${filters.searchTerm.trim()}”`, { searchTerm: "" });
  }

  const listGroups = [
    ["interests", "profile"],
    ["sex", "profile"],
    ["hairColor", "look"],
    ["eyeColor", "look"],
    ["hairType", "look"],
    ["skinColor", "look"],
    ["signs", "more"],
    ["facialHair", "more"],
    ["town", "where"],
  ];
  listGroups.forEach(([key, group]) => {
    filters[key].forEach((value) => {
      push(`${key}:${value}`, group, value, {
        [key]: filters[key].filter((item) => item !== value),
      });
    });
  });

  if (filters.veiled) push("veiled", "more", "Voilée", { veiled: false });
  if (filters.pregnant) push("pregnant", "more", "Enceinte", { pregnant: false });
  if (filters.source) push("source", "where", `Source : ${filters.source}`, { source: "" });

  if (!isDefaultRange(filters.ageRange, DEFAULT_RANGES.ageRange)) {
    push("ageRange", "body", formatRange(filters.ageRange, "ans"), { ageRange: null });
  }
  if (!isDefaultRange(filters.heightRange, DEFAULT_RANGES.heightRange)) {
    push("heightRange", "body", formatRange(filters.heightRange, "m"), { heightRange: null });
  }
  if (!isDefaultRange(filters.weightRange, DEFAULT_RANGES.weightRange)) {
    push("weightRange", "body", formatRange(filters.weightRange, "kg"), { weightRange: null });
  }

  return chips;
};

const useCandidateFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const filters = useMemo(() => parseFilters(location.search), [location.search]);
  const chips = useMemo(() => buildChips(filters), [filters]);

  // Merge a partial set of filters into the URL. Keys not mentioned are kept.
  const update = useCallback(
    (patch) => {
      const params = new URLSearchParams(location.search);
      Object.entries(patch).forEach(([key, value]) => writeParam(params, key, value));
      navigate({ search: params.toString() }, { replace: true });
    },
    [location.search, navigate]
  );

  // Remove every filter but keep the current sort order.
  const clearAll = useCallback(() => {
    const params = new URLSearchParams();
    ["sortBy", "sortOrder"].forEach((key) => {
      const value = new URLSearchParams(location.search).get(key);
      if (value) params.set(key, value);
    });
    navigate({ search: params.toString() }, { replace: true });
  }, [location.search, navigate]);

  // Number of filters per sidebar section, used for the badges.
  const countByGroup = useMemo(
    () =>
      chips.reduce((acc, chip) => {
        acc[chip.group] = (acc[chip.group] || 0) + 1;
        return acc;
      }, {}),
    [chips]
  );

  return { filters, chips, countByGroup, activeCount: chips.length, update, clearAll };
};

export default useCandidateFilters;
