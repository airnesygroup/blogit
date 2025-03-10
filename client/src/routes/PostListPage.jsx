
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import CategoriesScroll from "../components/CategoriesScroll";
import Discover from "../components/Discover";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PopularPosts from "../components/PopularPosts";
import LatestPosts from "../components/LatestPosts";
import TrendingPosts from "../components/TrendingPosts";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

import { useEffect } from "react";

const PostListPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);
  
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
    .join(" | ") || "All summaries"; // Default to "All Books" if no filters are applied

  return (
    <div  className=" bg-[var(--bg)] mb-[80px]  ">
       <Navbar/>
       
       <div className="px-3 pt-4 md:pt-6 md:px-9 ">
       <h3 className="text-4xl md:text-6xl ml-1 mb-1  font-bold text-[var(--textColor)]">
         Book Summaries Library
        </h3>
        <div className="max-w-[700px] mb-5 md:mb-9">
        <h3 className="text-sm md:text-lg ml-1 mb-5 md:mb-9 text-[var(--textColor)]">
         Dive into 15-minute nonfiction book summaries crafted for the curious mind. Insights in minutes, wisdom for a lifetime.
         Are you ready to make Somaway? Get started!
        </h3>
        </div>
      
        <div className="mb-4 md:mb-9">
        <CategoriesScroll/>

        </div>

       </div>

       
  

      <div className="flex  flex-row  justify-between">
      <div className="w-full bg-[#7a00da]   p-3 md:p-9   ">
     
      <div className="flex hidden md:flex mb-[30px] justify-between ">

<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-[30px] text-xl ml-2 text-[#f8f8ff] font-bold">
        {`Book liblary - ${displayText}`}
      </h1>
      <Search />

</div>


<div className="flex flex-col md:hidden block  items-center justify-center mb-5 pl-1  pr-1 ">

  
<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-2  md:mb-[30px] text-xl ml-2 text-[#f8f8ff] font-bold">
        {`Book Library - ${displayText}`}
      </h1>
      <Search />

</div>   
<PostList />

    </div>

</div>

<div className=" mt-2 md:mt-4  p-3 md:p-8">
 
</div>



 

      {/* Recent Posts */}
      <div>
      <div className="flex justify-between mb-10 md:mb-[75px] pt-5 overflow-x-hidden  bg-[var(--textLogo)] 
        items-center gap-5 flex-col md:flex-row">
      <div>
      <h1 className="my-8 lg:text-6xl text-3xl ml-2 pl-2 md:pl-0 mb-2 mt-4 lg:mb-5 lg:mt-8 text-[var(--textColore2)] font-bold"> Book summaries library</h1>
      <p className="text-[var(--textColore2)] pl-2 md:pl-0 ml-2 text-md mb-5 md:mb-7 md:text-xl">Enjoy summarized nonfiction bestsellers</p>
      <Link
            to="/discover"
            className="w-full ml-4 md:ml-2 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3 bg-[#0062e3]   text-white font-semibold 
            rounded-md hover:bg-[#0053bf]   "
          >
            Discover    
                  </Link>
    </div>

     <img
            src="/summary.svg"
            className="w-100 md:w-180  h-40 md:h-80 mr-0  md:mr-[-100px] object-cover "
          />   
          
          </div>


</div>
<Footer/>

 </div>
  );
};

export default PostListPage;
