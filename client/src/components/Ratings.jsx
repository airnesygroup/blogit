import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Ratings = ({ postId }) => {
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hover, setHover] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [totalComments, setTotalComments] = useState(0);


  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/ratings/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setRating(parseFloat(data.averageRating) || 0);
          setTotalReviews(data.totalRatings || 0);
          if (isSignedIn) {
            const token = await getToken();
            if (token) {
              const userRes = await fetch(`${import.meta.env.VITE_API_URL}/ratings/user/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (userRes.ok) {
                const userData = await userRes.json();
                setUserRating(userData.userRating || 0);
              }
            }
          }
        } else {
          console.error("Failed to fetch rating", await res.text());
        }
      } catch (err) {
        console.error("Error fetching rating:", err);
      }
    };
    


  const fetchCommentsCount = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
      setTotalComments(Array.isArray(res.data) ? res.data.length : res.data.count || 0);
    } catch (err) {
      console.error("Error fetching comments count:", err);
    }
  };

  if (postId) {
    fetchCommentsCount();
    fetchRating();

  }
}, [postId]); 

  const handleRating = async (stars) => {
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        console.error("No auth token found!");
        return;
      }
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ratings/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stars }),
      });

      if (res.ok) {
        const newData = await res.json();
        setUserRating(stars);
        setRating(parseFloat(newData.newAverage));
        setTotalReviews(newData.newTotal);
      } else {
        console.error("Failed to submit rating", await res.text());
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };


  
  return (
    <div className="flex flex-row ml-3 items-center mt-2 text-sm md:text-lg">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className="w-[40px] ml-[-15px] cursor-pointer transition-all"
            color={starValue <= (hover || userRating || rating) ? "orange" : "var(--textColor)"}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleRating(starValue)}
          />
        );
      })}
      <span className="pl-2 font-normal text-[14px] md:text-[16px] flex items-center">
        <span className="text-[var(--softTextColor)] text-[14px] md:text-[16px] ml-[-5px]">
          {Number(rating).toFixed(1)}
        </span>
        <span className="mx-2 flex items-center">·</span>
        {totalReviews} + {totalComments} <span className="ml-1 text-[var(--softTextColor)] text-[14px] md:text-[16px]">reviews</span>
      </span>
    </div>
  );
};

export default Ratings;
