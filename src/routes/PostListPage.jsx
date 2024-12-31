
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import Search from "../components/Search";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar2";
import MainCategories from "../components/MainCategories";

const PostListPage = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation(); // Get the current location object

  // Use URLSearchParams to extract query parameters from the URL
  const params = new URLSearchParams(location.search);

  // Extract the 'category', 'sort', 'author', 'search', and 'cat' parameters (if available)
  const sort = params.get("sort");
  const author = params.get("author");
  const search = params.get("search");
  const cat = params.get("cat"); // Extract 'cat' parameter

  // Build the display string based on available parameters
  const displayText = [
    search ? `Search: ${search}` : "",
    sort ? `Sort: ${sort}` : "",
    author ? `Author: ${author}` : "",
    cat ? `Category: ${cat}` : "", // Display 'cat' if present
  ]
    .filter(Boolean) // Remove empty strings
    .join(" | ") || "All Posts"; // Default to "All Posts" if no filters are applied

  return (
    <div  className="  ">
<div  style={{ zIndex: 100004 }} className="mb-[22px] md:mb-[25px] mt-[15px] md:mt-[20px] sticky top-0.5 md:top-2 ">
 <MainCategories/>

</div>
      <div className="flex flex-row  text-[var(--textColor)] justify-between">
      <div className="w-full md:w-3/4 pr-0  text-[var(--textColor)] md:pr-10">
     

    <h1 style={{  zIndex: "10000"}} className="mb-5  md:mb-[30px] lg:text-[30px] text-xl ml-2   text-[#1da1f2] font-bold">
        {`Blog - ${displayText}`}
      </h1>

      <PostList />
    </div>
    <div className={`${open ? "block" : "hidden"} lg:mt-[30px] md:block w-1/4`}>
        <SideMenu />

    </div>
</div>
 </div>
  );
};

export default PostListPage;
