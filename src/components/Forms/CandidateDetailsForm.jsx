import React from 'react';
import { message } from 'antd';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import { Calendar, Check, Copy, Database, MapPin, Phone } from 'lucide-react';

import {
  BMI_ZONES,
  SWATCHES,
  getAge,
  getBmiZone,
  getHeight,
  getInterests,
  getWeight,
  splitList,
  titleCase,
} from '../../utils/candidate';

const EMPTY = <span className="bm-dl__empty">Non renseigné</span>;

const Stat = ({ label, value, unit, hint }) => (
  <div className="bm-stat">
    <span className="bm-stat__label">{label}</span>
    <span className="bm-stat__value">
      {value ?? '—'}
      {value != null && unit && <small>{unit}</small>}
    </span>
    {hint && <span className="bm-stat__hint">{hint}</span>}
  </div>
);

const Row = ({ label, children }) => (
  <div className="bm-dl__row">
    <dt>{label}</dt>
    <dd>{children || EMPTY}</dd>
  </div>
);

const Section = ({ title, children }) => (
  <section className="bm-section">
    <h2 className="bm-section__title">{title}</h2>
    <dl className="bm-dl">{children}</dl>
  </section>
);

// Values with an optional colour swatch, e.g. hair or eye colour.
const Swatched = ({ values, palette }) => {
  if (!values.length) return EMPTY;
  return (
    <span className="bm-swatched">
      {values.map((value) => (
        <span key={value} className="bm-swatched__item">
          {palette?.[value] && (
            <span className="bm-chip__swatch" style={{ background: palette[value] }} />
          )}
          {value}
        </span>
      ))}
    </span>
  );
};

const BmiScale = ({ bmi }) => {
  const zone = getBmiZone(bmi);
  // Map 14 → 38 onto 0 → 100% of the bar.
  const position = Math.min(100, Math.max(0, ((bmi - 14) / (38 - 14)) * 100));

  return (
    <div className="bm-bmi" aria-label={`IMC ${bmi.toFixed(1)} : ${zone.label}`}>
      <div className="bm-bmi__bar">
        {BMI_ZONES.map((z) => (
          <span key={z.key} style={{ background: z.color }} />
        ))}
        <i className="bm-bmi__marker" style={{ left: `${position}%` }} />
      </div>
      <span className="bm-bmi__label" style={{ color: zone.color }}>
        {zone.label}
      </span>
    </div>
  );
};

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
};

const CandidateDetailsForm = ({ candidate, bmi, actions }) => {
  const [copied, setCopied] = React.useState(false);

  const age = getAge(candidate);
  const height = getHeight(candidate);
  const weight = getWeight(candidate);
  const bmiValue = Number.isFinite(bmi) ? bmi : null;

  const isFemme = candidate.gender?.toLowerCase() === 'femme';
  const interests = getInterests(candidate);
  const signs = splitList(candidate.signs);
  const facialHair = splitList(candidate.facialHair);
  const memberSince = formatDate(candidate.createdAt);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(candidate.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      message.error('Impossible de copier le numéro.');
    }
  };

  return (
    <div className="bm-profile">
      {/* ── Identity ─────────────────────────────────────────────────────── */}
      <header className="bm-identity">
        <div className="bm-identity__badges">
          <span className={`bm-badge ${isFemme ? 'bm-badge--female' : 'bm-badge--male'}`}>
            {isFemme ? <WomanOutlined /> : <ManOutlined />}
            {isFemme ? 'Femme' : 'Homme'}
          </span>
          {candidate.town && (
            <span className="bm-badge">
              <MapPin size={13} />
              {candidate.town}
            </span>
          )}
        </div>

        <h1 className="bm-identity__name">
          {titleCase(candidate.firstName)} <span>{titleCase(candidate.name)}</span>
        </h1>

        {interests.length > 0 && (
          <div className="bm-identity__tags">
            {interests.map((interest) => (
              <span key={interest} className="bm-tag bm-tag--lg">
                {interest}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── Key figures ──────────────────────────────────────────────────── */}
      <div className="bm-stats">
        <Stat label="Âge" value={age} unit=" ans" />
        <Stat label="Taille" value={height?.toFixed(2)} unit=" m" />
        <Stat label="Poids" value={weight && Math.round(weight)} unit=" kg" />
        <Stat label="IMC" value={bmiValue?.toFixed(1)} />
      </div>
      {bmiValue && <BmiScale bmi={bmiValue} />}

      {/* ── Actions (message, campaign, admin tools) ─────────────────────── */}
      {actions && <div className="bm-profile__actions">{actions}</div>}

      {/* ── Details ──────────────────────────────────────────────────────── */}
      <div className="bm-sections">
        <Section title="Contact & origine">
          <Row label="Téléphone">
            {candidate.phone && (
              <span className="bm-phone">
                <a href={`tel:${candidate.phone}`}>
                  <Phone size={14} />
                  {candidate.phone}
                </a>
                <button
                  type="button"
                  className="bm-icon-btn bm-icon-btn--sm"
                  onClick={copyPhone}
                  aria-label="Copier le numéro"
                  title="Copier le numéro"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </span>
            )}
          </Row>
          <Row label="Ville">{candidate.town}</Row>
          <Row label="Source">
            {candidate.source && (
              <span className="bm-inline-icon">
                <Database size={14} />
                {candidate.source}
              </span>
            )}
          </Row>
          <Row label="Membre depuis">
            {memberSince && (
              <span className="bm-inline-icon">
                <Calendar size={14} />
                {memberSince}
              </span>
            )}
          </Row>
        </Section>

        <Section title="Apparence">
          <Row label="Cheveux">
            <Swatched values={splitList(candidate.hairColor)} palette={SWATCHES.hair} />
          </Row>
          <Row label="Type de cheveux">{splitList(candidate.hairType).join(', ')}</Row>
          <Row label="Yeux">
            <Swatched values={splitList(candidate.eyeColor)} palette={SWATCHES.eye} />
          </Row>
          <Row label="Peau">
            <Swatched values={splitList(candidate.skinColor)} palette={SWATCHES.skin} />
          </Row>
          {!isFemme && <Row label="Pilosité faciale">{facialHair.join(', ')}</Row>}
        </Section>

        {(signs.length > 0 || candidate.veiled || candidate.pregnant) && (
          <Section title="Particularités">
            <Row label="Signes distinctifs">
              {signs.length > 0 && (
                <span className="bm-identity__tags">
                  {signs.map((sign) => (
                    <span key={sign} className="bm-tag">
                      {sign}
                    </span>
                  ))}
                </span>
              )}
            </Row>
            {isFemme && (
              <>
                <Row label="Voilée">{candidate.veiled ? 'Oui' : 'Non'}</Row>
                <Row label="Enceinte">{candidate.pregnant ? 'Oui' : 'Non'}</Row>
              </>
            )}
          </Section>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailsForm;
