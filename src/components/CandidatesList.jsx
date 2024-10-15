import React, { useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Row,
  Col,
  Skeleton,
  notification,
  Select,
  Button,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { toggleFavorite } from "../services/api/favoritesService";
import CandidateCard from "./CandidateCard";
import useFetchFileLinks from "../Hooks/useFetchFileLinks";
import useInfiniteScroll from "react-infinite-scroll-hook";
import useCandidates from "../Hooks/useCandidates";

const { Title } = Typography;
const { Option } = Select;
const pageSize = 10;

function CandidateList() {
  const [notificationApi, contextHolder] = notification.useNotification();
  const favorites = useSelector((state) => state.favorites.favorites);
  const userId = useSelector((state) => state.auth.id);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const initialSortBy = queryParams.get("sortBy") || "createdAt";
const initialSortOrder = queryParams.get("sortOrder") || "desc";


  const [sortBy, setSortBy] = React.useState(initialSortBy);
  const [sortOrder, setSortOrder] = React.useState(initialSortOrder);

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
    };
  }, [queryParams, sortBy, sortOrder]);
  

  const dispatch = useDispatch();

  const scrollPositionKey = `scrollPosition_${location.pathname}`;

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
  } = useCandidates(filters, pageSize);

  const candidatesForCurrentPage = useMemo(() => {
    if (!data) return [];
    const allCandidates = data.pages.flatMap((page) => page.candidates);
    const uniqueCandidates = Array.from(
      new Map(allCandidates.map((candidate) => [candidate._id, candidate])).values()
    );
    console.log(allCandidates.length);
    
    return uniqueCandidates;
  }, [data]);
  console.log(`Total candidates displayed: ${candidatesForCurrentPage.length}`);

  const fileLinks = useFetchFileLinks(candidatesForCurrentPage);

  const favoriteIds = useMemo(() => {
    return Array.isArray(favorites)
      ? favorites.map((fav) => fav._id || fav)
      : [];
  }, [favorites]);

  const handleLikeToggle = useCallback(
    async (candidateId) => {
      try {
        await dispatch(toggleFavorite(userId, candidateId));
        const isFavorite = favoriteIds.includes(candidateId);
        notificationApi.success({
          message: isFavorite
            ? "Removed from Favorites"
            : "Added to Favorites",
          description: isFavorite
            ? "This candidate has been removed from your favorites list."
            : "This candidate has been added to your favorites list.",
          placement: "topRight",
          duration: 2,
        });
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        notificationApi.error({
          message: "Action Failed",
          description:
            "There was an error while updating favorites. Please try again.",
          placement: "topRight",
          duration: 2,
        });
      }
    },
    [dispatch, userId, favoriteIds, notificationApi]
  );

  const tagColors = ["orange", "red", "purple", "gold"];
  useEffect(() => {
    console.log("Sorting by:", sortBy, "Order:", sortOrder);
  }, [sortBy, sortOrder]);
  
  // Update URL when sortBy or sortOrder changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    if (sortOrder) {
      params.set("sortOrder", sortOrder);
    } else {
      params.delete("sortOrder");
    }

    navigate({ search: params.toString() }, { replace: true });
  }, [sortBy, sortOrder, navigate]);

  // Infinite Scroll Hook
  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage,
    onLoadMore: fetchNextPage,
    rootMargin: "0px 0px 400px 0px",
  });

  // Scroll Restoration
  const [hasRestoredScroll, setHasRestoredScroll] = React.useState(false);

  useEffect(() => {
    const restoreScrollPosition = async () => {
      let scrollYString = localStorage.getItem(scrollPositionKey);
      if (scrollYString === null) {
        setHasRestoredScroll(true);
        return;
      }
      let scrollY = parseInt(scrollYString, 10);
      if (isNaN(scrollY)) {
        setHasRestoredScroll(true);
        return;
      }

      const averageItemHeight = 300; // Adjust based on your UI
      const itemsPerRow = 4; // Adjust based on your grid layout
      const totalItemsNeeded = Math.ceil(scrollY / averageItemHeight) * itemsPerRow;
      const pagesToLoad = Math.ceil(totalItemsNeeded / pageSize);

      for (let i = 1; i <= pagesToLoad; i++) {
        if (hasNextPage && data?.pages.length < i) {
          await fetchNextPage();
        }
      }

      window.scrollTo(0, scrollY);
      setHasRestoredScroll(true);
    };

    if (!hasRestoredScroll && !isFetching) {
      restoreScrollPosition();
    }
  }, [
    hasRestoredScroll,
    isFetching,
    hasNextPage,
    fetchNextPage,
    data?.pages.length,
    scrollPositionKey,
  ]);

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem(scrollPositionKey, window.scrollY);
    };

    const debouncedHandleScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [scrollPositionKey]);
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

  // Update sortOrder in URL when it changes
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
  return (
    <div className="min-h-screen py-6" style={{ background: "#fcfcfc" }}>
      {contextHolder}
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-700 flex items-center mb-4 sm:mb-0">
        Showing <span className="font-medium ml-1">{candidatesForCurrentPage.length > 0 ? 1 : 0}</span> to{" "}
        <span className="font-medium ml-1">
    {candidatesForCurrentPage.length}
  </span>{" "}
  of{" "}
  <span className="font-medium ml-1">
    {data?.pages[0]?.meta.total || 0}
  </span>{" "}
          results
        </div>
        <Row gutter={[16, 24]} className="mb-4" justify="end">
          <Col>
          <Select
          value={sortBy}
          onChange={handleSortByChange}
          style={{ width: 120 }}
          placeholder="Sort By"
          dropdownStyle={{ zIndex: 1000 }}
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
          dropdownStyle={{ zIndex: 1000 }}
        >
              <Option value="asc">Ascending</Option>
              <Option value="desc">Descending</Option>
            </Select>
          </Col>
          <Col>
          <Button
          onClick={() => {
            const params = new URLSearchParams(location.search);
            params.delete("sortBy");
            params.delete("sortOrder");
            navigate({ search: params.toString() });
            // Optionally reset the local state
            setSortBy("");
            setSortOrder("asc"); // or your default sort order
          }}
          style={{ marginLeft: 8 }}
        >
              Reset Sorting
            </Button>
          </Col>
        </Row>
        <Title
          level={2}
          className="text-gray-500 text-center mb-8 underline decoration-1"
        >
          Candidates List
        </Title>

        <Row gutter={[16, 24]}>
          {candidatesForCurrentPage.map((candidate) => (
            <Col xs={24} sm={12} md={8} lg={6} key={candidate._id}>
              <CandidateCard
                candidate={candidate}
                fileLink={
                  fileLinks[candidate._id]?.fileStreamUrl ||
                  fileLinks[candidate._id]?.link
                }
                isFavorite={favoriteIds.includes(candidate._id)}
                onToggleFavorite={handleLikeToggle}
                tagColors={tagColors}
              />
            </Col>
          ))}
          {isFetchingNextPage && (
            <>
              {[...Array(pageSize)].map((_, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={`loading-${index}`}>
                  <Skeleton active>
                    <CandidateCard loading />
                  </Skeleton>
                </Col>
              ))}
            </>
          )}
        </Row>
        <div ref={sentryRef}></div>
      </div>
    </div>
  );
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default React.memo(CandidateList);
