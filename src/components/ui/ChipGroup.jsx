import React from "react";

// Multi-select toggle chips. Optionally renders a colour swatch per option.
const ChipGroup = ({ options, value = [], onChange, swatches, icons }) => {
  const toggle = (option) => {
    onChange(
      value.includes(option) ? value.filter((item) => item !== option) : [...value, option]
    );
  };

  return (
    <div className="bm-chips" role="group">
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            className={`bm-chip${active ? " is-active" : ""}`}
            aria-pressed={active}
            onClick={() => toggle(option)}
          >
            {swatches?.[option] && (
              <span className="bm-chip__swatch" style={{ background: swatches[option] }} />
            )}
            {icons?.[option]}
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default ChipGroup;
