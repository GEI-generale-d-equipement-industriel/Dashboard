import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CandidateHeader = ({ candidateName }) => {
  const navigate = useNavigate();

  return (
    <nav className="bm-crumbs" aria-label="Fil d'Ariane">
      <button type="button" className="bm-btn bm-btn--ghost bm-btn--sm" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Retour
      </button>
      <ol className="bm-crumbs__trail">
        <li>
          <Link to="/candidates">Talents</Link>
        </li>
        {candidateName && (
          <>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page">{candidateName}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default CandidateHeader;
