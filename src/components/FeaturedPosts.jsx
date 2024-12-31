import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`
  );
  return res.data;
};

const truncateText = (text, length) =>
  text.length > length ? text.substring(0, length) + "..." : text;

const FeaturedPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: () => fetchPost(),
  });

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;

  const posts = data.posts;
  if (!posts || posts.length < 3) {
    return; // Ensure there are at least 3 posts
  }

  return (
    <>{/* Layout for large screens only */}
{/* Layout for large screens only */}
<div className=" lg:grid grid-cols-12 gap-6 mt-4">

{/* First column: First post (takes half the width, spans 6 out of 12) */}
<div className="col-span-6 flex flex-col gap-6 lg:gap-[3] lg:mb-[15px] mb-[30px] relative rounded-none sm:rounded-tl-lg sm:rounded-bl-lg">
  {posts[0].img && (
    <Link to={`/${posts[0].slug}`} className="relative">
      <div className="relative w-full" style={{ paddingTop: '100%' }}> {/* Square container */}
        <Image
          src={posts[0].img}

          
          className="absolute top-0 left-0 w-full h-full object-cover rounded-none sm:rounded-tl-2xl sm:rounded-bl-2xl" 
       />
       <div 
          className="absolute inset-0 bg-black opacity-30 rounded-none sm:rounded-tl-2xl sm:rounded-bl-2xl" 
       />
       


        <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">

          <Link
              to={`/posts?category=${posts[0].category}`}
              className="text-md font-semibold uppercase"
              >
              {posts[0].category}
              </Link>
          <br />
          <Link
            to={`/${posts[0].slug}`}
            className="text-2xl lg:text-4xl font-bold leading-snug mt-2 block"
          >
            {window.innerWidth > 1024
              ? posts[0].title
              : truncateText(posts[0].title, 130)}
          </Link>


          <br />
          <Link
    className="text-md text-gray-300 font-base "
    to={`/posts?author=${posts[0].user.username}`}
    onClick={(e) => e.stopPropagation()}
  >
    { posts[0].user.username}
  </Link>
  <span     className="text-md p-1 text-gray-300 font-base "
  >-</span>
 
  <span     className="text-md text-gray-300 font-base "
  >{format( posts[0].createdAt)}</span>
        </div>
      </div>
    </Link>


  )}
</div>




{/* Second column: Second and third post (stacked vertically, takes half the width, spans 3 out of 12) */}
<div className="col-span-3 flex mb-[25px] lg:mb-[0px] flex-col gap-6 lg-gap:[3]">
  {[posts[1], posts[2]].map((post, index) => post && (
    <div key={index} className="w-full relative">
      <Link to={`/${post.slug}`} className="relative">
        <div className="relative w-full" style={{ paddingTop: '100%' }}> {/* Square container */}
          <Image
            src={post.img}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30" /> {/* Dark overlay */}
          {/* Post title on top of the image */}
          <div className="absolute bg-black bg-opacity-25 top-0 left-0 right-0 bottom-0 flex flex-col justify-end p-4"> {/* Align text at bottom */}
            <div className="text-white text-left">
            <Link
                to={`/posts?category=${post.category}`}
                className="text-md font-semibold uppercase"
                >
                {post.category}
              </Link>
              <br />
              <Link
                to={`/${post.slug}`}
                className=" text-lg lg:text-md font-bold leading-snug"
              >
                {truncateText(post.title, 75)}
              </Link>
<br className="mt-5" /> 
              <Link
    className="text-md text-gray-300 font-base"
    to={`/posts?author=${post.user.username}`}
    onClick={(e) => e.stopPropagation()}
  >
    { post.user.username}
  </Link>
  <span     className="text-md p-1 text-gray-300 font-base "
  >-</span>
 
  <span     className="text-md text-gray-300 font-base "
  >{format( post.createdAt)}</span>
             
            </div>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-1">
        {/* Empty for now, can add more details if needed */}
      </div>
    </div>
  ))}
</div>

<div className="hidden md:flex relative col-span-3 justify-end items-center text-xl 
font-semibold bg-gradient-to-r from-black via-gray-500 to-gray-700 
rounded-none lg:rounded-tr-2xl lg:rounded-br-2xl p-4">

  {/* White Overlay */}
  <div
    className="absolute  lg:bg-[var(--bg)] rounded-none  lg:rounded-tr-2xl lg:rounded-br-2xl"
    style={{
      top: '2px',
      right: '2px',
      bottom: '2px',
      left: '0',
      zIndex: 1,
    }}
  ></div>

  {/* Original Content */}
  <div className="relative  text-right" style={{ zIndex: 2 }}>
  <p className="text-[var(--TextColor)]" style={{ fontSize: '1rem' }}>
      BY THE <br />
      <span className="underline">NUMBERS</span>
    </p>
    <p className="text-5xl font-extrabold bg-clip-text text-transparent  bg-gradient-to-r from-[var(--TextColor)]  to-[#1DA1F2] ">
      <span style={{ fontSize: '1.2rem' }}>OVER</span> 100K+
    </p>
    <p className="text-[var(--TextColor)]" style={{ fontSize: '1rem' }}>
      USERS READ THIS
    </p>
    <p className="text-[var(--TextColor)]" style={{ fontSize: '1rem' }}>
      ARTICLES EVERYDAY 
    </p>
    <Link to="/about" >

    <div className="flex items-center justify-end mt-2">
      <p className="text-xs text-[var(--TextColor)]">READ MORE</p>
      <span className="ml-2 bg-black text-white rounded-full p-2 border border-[var(--TextColor)]">
  {/* Content */}
        <img 
             src="/arrow.png"
              alt="Arrow"
              className="w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3"
            />
      </span>
    </div>
    </Link>
  </div>
</div>



 
      </div>
    </>
  );
};

export default FeaturedPosts;
