import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("cat") || "general");
  const navigate = useNavigate(); // Add navigate to programmatically change the route


  const handleFilterChange = (e) => {
    const newSort = e.target.value;
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("sort", newSort); // Set the new sort filter
    setSearchParams(currentParams, { replace: true }); // Update URL
    navigate(`/posts?${currentParams.toString()}`); // Navigate to the new URL
  };
  
  const handleCategoryChange = (category) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("cat", category); // Set the new category
    setSearchParams(currentParams, { replace: true }); // Update URL
    navigate(`/posts?${currentParams.toString()}`); // Navigate to the new URL
    setSelectedCategory(category); // Update the selected category state
  };
  
  return (
    <div
      style={{
        zIndex: "10000",
        maxHeight: "100vh",
        overflowY: "auto", // Make it scrollable if content overflows
      }}
      className="px-6  py-4 bg-[var(--bg)]  border-2 border-[var(--softTextColor7)]  rounded-lg  sticky top-[120px] flex flex-col gap-4 text-[var(--textColor)] shadow-md"
    >
      <div>
        <h1 className="mt-2 mb-4 text-md font-semibold text-[var(--textColor)]">Filter</h1>
        <div className="flex flex-col gap-3 text-sm">
          {[
            { label: "Newest", value: "newest" },
            { label: "Most Popular", value: "popular" },
            { label: "Trending", value: "trending" },
            { label: "Oldest", value: "oldest" },
          ].map((filter) => (
            <label
              key={filter.value}
              className="flex items-center gap-2 cursor-pointer hover:text-[#1da1f2]"
            >
              <input
                type="radio"
                name="sort"
                value={filter.value}
                onChange={handleFilterChange}
                className="appearance-none w-4 h-4 border-2 font-extrabold border-gray-300 cursor-pointer rounded-sm bg-white 
                checked:bg-[#1DA1F2] checked:border-[#1DA1F2] focus:ring-2 focus:ring-[#1DA1F2]"
              />
              {filter.label}
            </label>
          ))}
        </div>
      </div>

      <div className=""> {/* Align categories to the right */}
        <h1 className="mt-2 mb-4 text-md font-semibold text-[var(--textColor)] text-left">Categories</h1>
        <div className="flex pb-9 flex-col gap-3 text-sm text-left">
          {[
            { label: "All Posts", category: "general" },
            { label: "Web Design", category: "web-design" },
            { label: "Development", category: "development" },
            { label: "Databases", category: "databases" },
            { label: "Search Engines", category: "seo" },
            { label: "Marketing", category: "marketing" },
          ].map((cat) => (
            <span
            key={cat.category}
            className={`cursor-pointer hover:text-[#1da1f2] ${
              selectedCategory === cat.category
                ? "text-[#1da1f2] font-extrabold"
                : "text-[var(--textColor)]"
            }`}
            onClick={() => handleCategoryChange(cat.category)}
          >
          
              {cat.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


export default SideMenu;
