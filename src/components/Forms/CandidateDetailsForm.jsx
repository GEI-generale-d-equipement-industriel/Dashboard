import React from 'react';
import { Form, Select, Input, Tag } from 'antd';
import {
  ManOutlined,
  WomanOutlined,
  CalendarOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BgColorsOutlined,
  SkinOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

// A clean stat/info card
const InfoItem = ({ icon, label, value, color = '#6366f1' }) => (
  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
    <div
      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white text-base shadow-sm"
      style={{ background: color }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide m-0 leading-none mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-800 m-0 truncate">{value || <span className="text-slate-300 font-normal italic">—</span>}</p>
    </div>
  </div>
);

// Section header
const SectionLabel = ({ children }) => (
  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-5 first:mt-0">{children}</h3>
);

const CandidateDetailsForm = ({ candidate, isEditing, form, bmi, role }) => {
  const year = parseInt(candidate?.birthDate?.substring(0, 4));
  const currentYear = new Date().getFullYear();
  const age = currentYear - (candidate.birthYear ? candidate.birthYear : year || 2000);

  const canEdit = role === 'admin' && isEditing;
  const formattedHeight = parseFloat(candidate.height).toFixed(2);
  const formattedWeight = parseFloat(candidate.weight).toFixed();
  const bmiValue = bmi ? bmi.toFixed(1) : null;

  const isFemme = candidate.gender?.toLowerCase() === 'femme';

  return (
    <div className="flex flex-col gap-1">
      {/* Name + Gender badge */}
      <div className="flex flex-col items-center gap-2 pb-4 border-b border-slate-100 mb-1">
        <h2 className="text-2xl font-extrabold text-slate-800 m-0 tracking-tight">
          {candidate.firstName} {candidate.name}
        </h2>
        <div className="flex items-center gap-2">
          {isFemme ? (
            <Tag color="pink" icon={<WomanOutlined />} className="rounded-full px-3 font-semibold">
              Femme
            </Tag>
          ) : (
            <Tag color="blue" icon={<ManOutlined />} className="rounded-full px-3 font-semibold">
              Homme
            </Tag>
          )}
          {candidate.town && (
            <Tag icon={<EnvironmentOutlined />} className="rounded-full px-3 font-semibold text-slate-600 border-slate-200 bg-white">
              {candidate.town}
            </Tag>
          )}
        </div>
      </div>

      <Form form={form} initialValues={candidate} layout="vertical">
        {/* --- Identity --- */}
        <SectionLabel>Identité</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            icon={<CalendarOutlined />}
            label="Âge"
            value={`${age} ans`}
            color="#f59e0b"
          />
          <InfoItem
            icon={<PhoneOutlined />}
            label="Téléphone"
            value={canEdit ? <Input size="small" defaultValue={candidate.phone} /> : candidate.phone}
            color="#10b981"
          />
          <InfoItem
            icon={<EnvironmentOutlined />}
            label="Ville"
            value={canEdit ? <Input size="small" defaultValue={candidate.town} /> : candidate.town}
            color="#3b82f6"
          />
          <InfoItem
            icon={<DatabaseOutlined />}
            label="Source"
            value={candidate.source ?? 'N/A'}
            color="#8b5cf6"
          />
        </div>

        {/* --- Physical --- */}
        <SectionLabel>Caractéristiques Physiques</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            icon={<span className="text-xs font-bold">↕</span>}
            label="Taille"
            value={`${formattedHeight} m`}
            color="#06b6d4"
          />
          <InfoItem
            icon={<span className="text-xs font-bold">⚖</span>}
            label="Poids"
            value={`${formattedWeight} kg`}
            color="#ec4899"
          />
          {bmiValue && (
            <InfoItem
              icon={<span className="text-xs font-bold">BMI</span>}
              label="IMC"
              value={bmiValue}
              color={parseFloat(bmiValue) < 18.5 ? '#f59e0b' : parseFloat(bmiValue) < 25 ? '#10b981' : '#ef4444'}
            />
          )}
          <InfoItem
            icon={<SkinOutlined />}
            label="Couleur de peau"
            value={candidate.skinColor?.[0]}
            color="#d97706"
          />
        </div>

        {/* --- Appearance --- */}
        <SectionLabel>Apparence</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            icon={<BgColorsOutlined />}
            label="Couleur des cheveux"
            value={candidate.hairColor?.[0]}
            color="#7c3aed"
          />
          <InfoItem
            icon={<BgColorsOutlined />}
            label="Type de cheveux"
            value={candidate.hairType?.[0]}
            color="#db2777"
          />
          {candidate.eyeColor?.length > 0 && (
            <InfoItem
              icon={<span className="text-xs font-bold">👁</span>}
              label="Couleur des yeux"
              value={candidate.eyeColor?.[0]}
              color="#0284c7"
            />
          )}
          {candidate.facialHair && (
            <InfoItem
              icon={<span className="text-xs font-bold">🧔</span>}
              label="Pilosité faciale"
              value={candidate.facialHair?.[0]}
              color="#57534e"
            />
          )}
        </div>

        {/* --- Interests/Signs --- */}
        {(candidate.interests?.length > 0 || candidate.signs?.length > 0) && (
          <>
            <SectionLabel>Profil</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {candidate.interests?.map((interest, i) => (
                <Tag key={i} color="geekblue" className="rounded-full px-3 text-xs font-medium">
                  {interest}
                </Tag>
              ))}
              {candidate.signs?.map((sign, i) => (
                <Tag key={i} color="purple" className="rounded-full px-3 text-xs font-medium">
                  {sign}
                </Tag>
              ))}
              {candidate.selectedVeilStatus && (
                <Tag color="gold" className="rounded-full px-3 text-xs font-medium">Voilée</Tag>
              )}
              {candidate.selectedPregnancyStatus && (
                <Tag color="green" className="rounded-full px-3 text-xs font-medium">Enceinte</Tag>
              )}
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default CandidateDetailsForm;
