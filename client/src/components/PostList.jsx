import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import SpinnerMini from "./Loader";

const fetchPosts = async ({ pageParam = 0, searchParams }) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { ...searchParamsObj, skip: pageParam, limit: pageParam === 0 ? 1 : pageParam < 3 ? 2 : 3 },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { 
    data, 
    error, 
    status, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, searchParams }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.posts.length === 0) return undefined; 
      return allPages.flat().length; 
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 15,
  });

  if (error) return <p>Something went wrong!</p>;

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 flex flex-col rounded-xl border border-[var(--softBg4)] text-[var(--softTextColor)] hover:shadow-md"
        >
          <p className="mb-4 text-[var(--softTextColor)]">No posts found</p>
          <p className="mb-4 font-semibold text-[var(--softTextColor)]">Go Back Home</p>
        </button>
      </div>
    );
  }

  return (
    <div className="gap-3 md:gap-6 grid grid-cols-1 md:grid-cols-4 scrollbar-hide">
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}

      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()} 
          disabled={isFetchingNextPage} 
          className="col-span-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default PostList;
