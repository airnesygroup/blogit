import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import FeaturedItem from "./FeaturedItem";
import React, { useRef, useState, useEffect } from "react";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=30&sort=newest`,
    {
      params: { page: pageParam, limit: 30, ...searchParamsObj },
    }
  );
  return res.data;
};
const FeaturedPosts = ({ setOpen }) => {
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true); // Always true initially

  const scroll = (direction) => {
    const scrollAmount = 200; // Adjust this value based on how much you want to scroll
    if (direction === "left") {
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollPosition = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    // Show or hide left button
    setShowLeftButton(scrollLeft > 0);

    // Ensure the right button is only hidden when scrolled to the end
    if (scrollWidth > clientWidth) {
      setShowRightButton(scrollLeft + clientWidth < scrollWidth);
    } else {
      setShowRightButton(true); // Ensure it's visible when there's no overflow
    }
  };

  useEffect(() => {
    // Check scroll position initially
    checkScrollPosition();

    // Add scroll event listener to container
    const container = containerRef.current;
    container.addEventListener("scroll", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);




  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", "newest", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-5 rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&lt;</span>
        </button>
      )}
      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-50 
          rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&gt;</span>
        </button>
      )}

      {/* Categories Container */}
      <div
        ref={containerRef}
        className="flex scrollbar-hide overflow-x-auto"
        style={{ whiteSpace: "nowrap" }}
      >
        <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<h4>Loading more posts...</h4>}
          className="flex gap-2 md:gap-6 scrollbar-hide"
        >
          {allPosts.length > 0 ? (
            allPosts.map((post) => <FeaturedItem key={post._id} post={post} />)
          ) : (
            <p> </p>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default FeaturedPosts;
