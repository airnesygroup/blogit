import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import MainCategories from "../components/MainCategories";
import Navbar from "../components/Navbar";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  return (
<div>
  <Navbar/>   
<div className="relative mx-auto p-0 md:p-4 flex flex-col items-center gap-4 md:gap-8">
  <div className="absolute top-0 left-0 mb-4 md:mb-0 w-full h-[1px] bg-gradient-to-r from-[var(--bg)] via-[var(--softTextColor7)]  via-[var(--softTextColor7)] to-[var(--bg)]"></div>



      {/* Content container */}
      <div className="w-full  max-w-[700px]">
        {/* Title */}
        <h1 className="text-[15px] md:text-2xl mt-3 md:mt-[6] font-semibold">{data.title}</h1>
      </div>

      {/* Image */}
      {data.img && (
        <div className="w-full max-h-[700px]  sm:block md:hidden   max-w-[900px]">
          <Image src={data.img} w="900"  h={"700"} />
        </div>
      )}

      {/* Image */}
      {data.img && (
        <div className="w-full max-h-[500px] hidden sm:hidden md:block   max-w-[900px]">
          <Image src={data.img} w="900"  h={"500"} />
        </div>
      )}


      {/* Author Info and Other Content */}
      <div className="w-full max-w-[700px]">
        <div className="flex items-center gap-4 text-sm text-[var(--softTextColor)] mt-4">
          {data.user.img && (
            <Image
              src={data.user.img}
              className="w-10 h-10 object-cover rounded-full"
              w="40"
              h="40"
            />
          )}
          <div className="flex flex-col">
            <span>
              Written by <Link className="text-[#1DA1F2]">{data.user.username}</Link>
           
              <Link className="text-[#1DA1F2]">{data.category}</Link> -{" "}
              {format(data.createdAt)}
            </span>

            <PostMenuActions post={data} />

          </div>
        </div>


        {/* Description */}
        <p className="text-[var(--textColor)] text-[14px] md:text-[16px] text-justify mt-4">
          {data.desc}
        </p>
      </div>

      {/* Comments */}
      <div className="w-full max-w-[700px]">
        <Comments postId={data._id} />
      </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
