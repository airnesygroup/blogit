
import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PopularItem = ({ post }) => {
  // Truncate title based on screen size

  return (
    <div className="flex flex-col mt-8 md:mt-12">
  
  
   
      <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
          <div
            className="flex flex-col  flex-shrink-0 w-[100px] sm:w-[150px] lg:w-[200px]"
          >
            <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: "150%" }}>
              <Image
                src={post.img}
                className="absolute top-0  left-0 w-full h-full object-cover rounded-md"
              />
            </Link>
          
            <Link
              to={`/posts?category=${post.category}`}
              className="text-[var(--textColor)] text-xs font-semibold"
            >
              {post.category}
            </Link>
          </div>
      </div>
  </div>
  );
};

export default PopularItem;