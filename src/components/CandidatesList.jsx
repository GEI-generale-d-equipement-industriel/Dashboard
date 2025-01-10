import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Typography, Row, Col, Skeleton, Select, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";

import useToggleFavorite from "../Hooks/useToggleFavorite";
import useFetchFileLinks from "../Hooks/useFetchFileLinks";
import useInfiniteScroll from "react-infinite-scroll-hook";
import useCandidates from "../Hooks/useCandidates";
import { useFetchFavorites } from "../services/api/favoritesService";
import CandidateCard from "./CandidateCard";
import BackToTopButton from "../components/button/BackToTopButton";

const { Title } = Typography;
const { Option } = Select;

const pageSize = 10;

const CandidateList = () => {
  const userId = useSelector((state) => state.auth.id);
  const location = useLocation();
  const navigate = useNavigate();
  // const queryClient = useQueryClient();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialSortBy = queryParams.get("sortBy") || "createdAt";
  const initialSortOrder = queryParams.get("sortOrder") || "desc";

  const [sortBy, setSortBy] = React.useState(initialSortBy);
  const [sortOrder, setSortOrder] = React.useState(initialSortOrder);

  // const parseRange = (str, defaultMin, defaultMax) => {
  //   if (!str) return [defaultMin, defaultMax];
  //   const [minStr, maxStr] = str.split("-");
  //   return [Number(minStr), Number(maxStr)];
  // };
  
  const filters = useMemo(() => {
    return {
      searchTerm: queryParams.get('searchTerm') || '',
      sortBy,
      sortOrder,
      selectedAgeRange: queryParams.get('ageRange') ? queryParams.get('ageRange').split('-').map(Number) : [0, 60],
      selectedHeightRange: queryParams.get('heightRange') ? queryParams.get('heightRange').split('-').map(Number) : [0, 2.5],
      selectedWeightRange: queryParams.get('weightRange') ? queryParams.get('weightRange').split('-').map(Number) : [0, 120],
      selectedInterests: queryParams.get('interests') ? queryParams.get('interests').split(',') : [],
      selectedSex: queryParams.get('sex') ? queryParams.get('sex').split(',') : [],
      selectedTown: queryParams.get('town') || '',
      selectedEyeColor: queryParams.get('eyeColor') ? queryParams.get('eyeColor').split(',') : [],
      selectedHairColor: queryParams.get('hairColor') ? queryParams.get('hairColor').split(',') : [],
      selectedHairType: queryParams.get('hairType') ? queryParams.get('hairType').split(',') : [],
      selectedSkinColor: queryParams.get('skinColor') ? queryParams.get('skinColor').split(',') : [],
      selectedFacialHair: queryParams.get('facialHair') ? queryParams.get('facialHair').split(',') : [],
      selectedPregnancyStatus: queryParams.get('pregnant') === 'true',
      selectedVeilStatus: queryParams.get('veiled') === 'true',
      selectedSign: queryParams.get('signs') ? queryParams.get('signs').split(',') : [],
      selectedRegistrationType: queryParams.get('registrationType') || '',
      selectedSource: queryParams.get('source') || '',
    };
  }, [queryParams, sortBy, sortOrder]);

  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useCandidates(filters, pageSize);

  const { data: favorites = [] } = useFetchFavorites(userId);
  const toggleFavorite = useToggleFavorite(userId, favorites);

  const candidatesForCurrentPage = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Map(
        data.pages.flatMap((page) => page.candidates).map((candidate) => [candidate._id, candidate])
      ).values()
    );
  }, [data]);

  const fileLinks = useFetchFileLinks(candidatesForCurrentPage);

  const favoriteIds = useMemo(() => favorites.map((fav) => fav._id), [favorites]);

  const tagColors = ["orange", "red", "purple", "gold"];

  const handleSortByChange = (value) => {
    setSortBy(value);
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("sortBy", value);
    } else {
      params.delete("sortBy");
    }
    navigate({ search: params.toString() });
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("sortOrder", value);
    } else {
      params.delete("sortOrder");
    }
    navigate({ search: params.toString() });
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage,
    onLoadMore: fetchNextPage,
    rootMargin: "0px 0px 400px 0px",
  });

  useEffect(() => {
    const scrollPositionKey = `scrollPosition_${location.pathname}`;
    const restoreScrollPosition = () => {
      const scrollY = parseInt(localStorage.getItem(scrollPositionKey), 10);
      if (!isNaN(scrollY)) {
        window.scrollTo(0, scrollY);
      }
    };

    const handleScroll = () => {
      const scrollPositionKey = `scrollPosition_${location.pathname}`;
      localStorage.setItem(scrollPositionKey, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    restoreScrollPosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen py-6" style={{ background: "#fcfcfc" }}>
      <div className="container mx-auto px-4">
        {/* Sorting Controls */}
        <Row gutter={[16, 24]} className="mb-4" justify="end">
          <Col>
            <Select
              value={sortBy}
              onChange={handleSortByChange}
              style={{ width: 120 }}
              placeholder="Sort By"
            >
              <Option value="">None</Option>
              <Option value="name">Name</Option>
              <Option value="createdAt">Date</Option>
            </Select>
          </Col>
          <Col>
            <Select
              value={sortOrder}
              onChange={handleSortOrderChange}
              style={{ width: 120 }}
            >
              <Option value="asc">Ascending</Option>
              <Option value="desc">Descending</Option>
            </Select>
          </Col>
          <Col>
            <Button
              onClick={() => {
                setSortBy("");
                setSortOrder("asc");
                navigate({ search: "" });
              }}
            >
              Reset Sorting
            </Button>
          </Col>
        </Row>

        {/* Title */}
        <Title level={2} className="text-gray-500 text-center mb-8">
          Candidates List
        </Title>

        {/* Candidate Grid */}
        <Row gutter={[16, 24]}>
          {candidatesForCurrentPage.map((candidate) => (
            <Col xs={12} sm={12} md={8} lg={6} key={candidate._id}>
              <CandidateCard
                candidate={candidate}
                fileLink={fileLinks[candidate._id]}
                isFavorite={favoriteIds.includes(candidate._id)}
                onToggleFavorite={(args) => toggleFavorite(args)}
                tagColors={tagColors}
              />
            </Col>
          ))}
          {isFetchingNextPage &&
            [...Array(pageSize)].map((_, index) => (
              <Col xs={12} sm={12} md={8} lg={6} key={`loading-${index}`}>
                <Skeleton active />
              </Col>
            ))}
        </Row>
        <div ref={sentryRef}></div>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default React.memo(CandidateList);
