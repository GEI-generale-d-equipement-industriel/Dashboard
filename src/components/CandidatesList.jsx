import React, { useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Select, message } from "antd";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { AlertTriangle, SearchX, SlidersHorizontal, X } from "lucide-react";

import BmTheme from "./ui/BmTheme";
import CandidateCard from "./CandidateCard";
import BackToTopButton from "./button/BackToTopButton";
import useCandidates from "../Hooks/useCandidates";
import useCandidateFilters from "../Hooks/useCandidateFilters";
import useFetchFileLinks from "../Hooks/useFetchFileLinks";
import FiltersDrawerContext from "../context/FiltersDrawerContext";
import { useGetCampaigns, useCreateCampaign } from "../services/api/campaignService";

const PAGE_SIZE = 12;
const NO_CAMPAIGNS = [];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Plus récents" },
  { value: "createdAt:asc", label: "Plus anciens" },
  { value: "name:asc", label: "Nom (A → Z)" },
  { value: "name:desc", label: "Nom (Z → A)" },
];

const SkeletonCard = () => (
  <div className="bm-card bm-card--skeleton" aria-hidden="true">
    <div className="bm-card__media bm-skeleton" />
    <div className="bm-card__tags">
      <span className="bm-skeleton bm-skeleton--tag" />
      <span className="bm-skeleton bm-skeleton--tag" />
    </div>
  </div>
);

const CandidateList = () => {
  const userId = useSelector((state) => state.auth.id);
  const location = useLocation();
  const { open: openFilters } = useContext(FiltersDrawerContext);
  const { filters, chips, activeCount, update, clearAll } = useCandidateFilters();

  // Shape expected by useCandidates / the API.
  const queryFilters = useMemo(
    () => ({
      searchTerm: filters.searchTerm.trim(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      selectedAgeRange: filters.ageRange,
      selectedHeightRange: filters.heightRange,
      selectedWeightRange: filters.weightRange,
      selectedInterests: filters.interests,
      selectedSex: filters.sex,
      selectedTown: filters.town.join(","),
      selectedEyeColor: filters.eyeColor,
      selectedHairColor: filters.hairColor,
      selectedHairType: filters.hairType,
      selectedSkinColor: filters.skinColor,
      selectedFacialHair: filters.facialHair,
      selectedPregnancyStatus: filters.pregnant,
      selectedVeilStatus: filters.veiled,
      selectedSign: filters.signs,
      selectedRegistrationType: filters.registrationType,
      selectedSource: filters.source,
    }),
    [filters]
  );

  const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useCandidates(queryFilters, PAGE_SIZE);

  const { data: campaigns = NO_CAMPAIGNS } = useGetCampaigns(userId);
  const { mutate: createCampaign } = useCreateCampaign();

  const campaignProfileIds = useMemo(() => {
    const ids = new Set();
    campaigns.forEach((campaign) => {
      campaign?.profiles?.forEach((profileId) => ids.add(profileId));
    });
    return ids;
  }, [campaigns]);

  const candidates = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Map(
        data.pages.flatMap((page) => page.candidates).map((candidate) => [candidate._id, candidate])
      ).values()
    );
  }, [data]);

  const total = Number(data?.pages?.[0]?.meta?.total ?? candidates.length);
  const fileLinks = useFetchFileLinks(candidates);

  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    onLoadMore: fetchNextPage,
    disabled: isError,
    rootMargin: "0px 0px 400px 0px",
  });

  const handleCreateCampaign = (name, callback) => {
    createCampaign(
      { userId, name },
      {
        onSuccess: (newCampaign) => {
          message.success("Campagne créée avec succès !");
          if (callback && newCampaign?._id) callback(newCampaign._id);
        },
        onError: () => message.error("Échec de la création de la campagne"),
      }
    );
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split(":");
    window.scrollTo(0, 0);
    update({ sortBy, sortOrder });
  };

  useEffect(() => {
    const scrollPositionKey = `scrollPosition_${location.pathname}`;
    const scrollY = parseInt(localStorage.getItem(scrollPositionKey), 10);
    if (!isNaN(scrollY)) window.scrollTo(0, scrollY);

    const handleScroll = () => localStorage.setItem(scrollPositionKey, window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isEmpty = !isLoading && !isError && candidates.length === 0;

  return (
    <BmTheme>
      <div className="bm-page bm-list">
        <Helmet>
          <title>Candidates List - BeModel</title>
          <meta
            name="description"
            content="Explore a diverse list of candidates, including professional models and influencers, ready for collaboration."
          />
          <meta name="keywords" content="candidates, models, influencers, collaborations" />
          <meta property="og:title" content="Candidates List - BeModel" />
          <meta
            property="og:description"
            content="Explore a diverse list of candidates, including professional models and influencers, ready for collaboration."
          />
          <meta property="og:url" content={`${window.location.origin}/candidates`} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Candidates List",
              description:
                "Explore a diverse list of candidates, including professional models and influencers.",
              url: `${window.location.origin}/candidates`,
              numberOfItems: candidates.length,
              itemListElement: candidates.map((candidate, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Person",
                  name: candidate.name,
                  url: `${window.location.origin}/candidate/${candidate._id}`,
                  image: fileLinks[candidate._id],
                },
              })),
            })}
          </script>
        </Helmet>

        <div className="bm-container">
          <header className="bm-list__intro">
            <p className="bm-eyebrow">Catalogue</p>
            <h1 className="bm-display">Découvrez nos talents</h1>
            <p className="bm-lead">
              Modèles, créateurs UGC et voix-off. Filtrez, comparez et ajoutez les profils qui
              vous plaisent à vos campagnes.
            </p>
          </header>

          <div className="bm-toolbar">
            <div className="bm-toolbar__count" aria-live="polite">
              {isLoading ? (
                <span className="bm-skeleton bm-skeleton--text" />
              ) : (
                <>
                  <strong>{total}</strong> talent{total > 1 ? "s" : ""}
                  {activeCount > 0 && <span className="bm-toolbar__sub"> · résultats filtrés</span>}
                </>
              )}
            </div>

            <div className="bm-toolbar__actions">
              <button
                type="button"
                className="bm-btn bm-btn--ghost bm-toolbar__filters-btn"
                onClick={openFilters}
              >
                <SlidersHorizontal size={16} />
                <span className="bm-hide-sm">Filtres</span>
                {activeCount > 0 && <span className="bm-count bm-count--gold">{activeCount}</span>}
              </button>
              <Select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={handleSortChange}
                options={SORT_OPTIONS}
                size="large"
                className="bm-toolbar__sort"
                popupMatchSelectWidth={false}
                aria-label="Trier par"
              />
            </div>
          </div>

          {chips.length > 0 && (
            <div className="bm-active" role="list" aria-label="Filtres actifs">
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  role="listitem"
                  className="bm-pill"
                  onClick={() => update(chip.patch)}
                  aria-label={`Retirer le filtre ${chip.label}`}
                >
                  {chip.label}
                  <X size={13} />
                </button>
              ))}
              <button type="button" className="bm-link" onClick={clearAll}>
                Tout effacer
              </button>
            </div>
          )}

          {isError && (
            <div className="bm-state" role="alert">
              <span className="bm-state__icon bm-state__icon--danger">
                <AlertTriangle size={26} />
              </span>
              <h2>Impossible de charger les talents</h2>
              <p>Vérifiez votre connexion puis réessayez.</p>
              <button type="button" className="bm-btn bm-btn--primary" onClick={() => refetch()}>
                Réessayer
              </button>
            </div>
          )}

          {isEmpty && (
            <div className="bm-state">
              <span className="bm-state__icon">
                <SearchX size={26} />
              </span>
              <h2>Aucun talent ne correspond</h2>
              <p>Essayez d'élargir votre recherche ou de retirer certains filtres.</p>
              {activeCount > 0 && (
                <button type="button" className="bm-btn bm-btn--primary" onClick={clearAll}>
                  Effacer les filtres
                </button>
              )}
            </div>
          )}

          {!isError && !isEmpty && (
            <div className="bm-grid">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate._id}
                  candidate={candidate}
                  fileLink={fileLinks[candidate._id]}
                  isFavorite={campaignProfileIds.has(candidate._id)}
                  campaigns={campaigns}
                  onCreateCampaign={handleCreateCampaign}
                />
              ))}
              {(isLoading || isFetchingNextPage) &&
                [...Array(isLoading ? PAGE_SIZE : 4)].map((_, index) => (
                  <SkeletonCard key={`loading-${index}`} />
                ))}
            </div>
          )}

          <div ref={sentryRef} />

          {!hasNextPage && !isLoading && candidates.length > 0 && (
            <p className="bm-list__end">Vous avez tout vu · {total} talents</p>
          )}
        </div>

        <BackToTopButton />
      </div>
    </BmTheme>
  );
};

export default React.memo(CandidateList);
