import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import PopularItem from "./PopularItem";



const fetchPosts = async (pageParam, searchParams) => {
    const searchParamsObj = Object.fromEntries([...searchParams]);
  
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?sort=popular`, {
      params: { page: pageParam, limit: 30, ...searchParamsObj }, // Changed limit to 30
    });
    return res.data;
  };
  


const PopularPosts = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", "popular", searchParams.toString()], // Add "popular" to the queryKey
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 10, // Data stays fresh for 10 minutes
    cacheTime: 1000 * 60 * 30, // Cache remains available for 30 minutes
  });
  if (status === "loading") return <p>Loading...</p>; // Show a loading spinner or message
  if (error) return <p>Something went wrong!</p>; // Handle errors gracefully
  
  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
  
  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more posts...</h4>}
      endMessage={<p>No more posts to show.</p>}
      className="flex gap-3 md:gap-4 scrollbar-hide"
    >
      {allPosts.length > 0 ? (
        allPosts.map((post) => <PopularItem key={post._id} post={post} />)
      ) : (
        <p>No posts found.</p>
      )}
    </InfiniteScroll>
  );
  
};



export default PopularPosts;
