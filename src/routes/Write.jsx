import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload"; // Assuming this component handles file uploads and provides preview

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null); // Initially null, will hold the image file and preview URL
  const [progress, setProgress] = useState(0);
  const [titleRemainingChars, setTitleRemainingChars] = useState(150);
  const [descRemainingChars, setDescRemainingChars] = useState(10000);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Post has been created");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const clearError = () => setError("");

  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, 150);
    setTitle(value);
    setTitleRemainingChars(150 - value.length);
  };

  const handleDescChange = (e) => {
    const value = e.target.value.slice(0, 10000);
    setDesc(value);
    setDescRemainingChars(10000 - value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!title) return setError("Please include a title for your post.");
    if (!desc) return setError("Please include a description for your post.");
    if (!category) return setError("Please select a category for your post.");
    if (!cover) return setError("Please upload a cover image for your post.");

    // Slug generation
    const timestamp = Date.now();
    const slug = `${title.replace(/\s+/g, "-").toLowerCase()}-${timestamp}`;

    const data = {
      img: cover.filePath, // Assuming `filePath` is the path to the uploaded file
      title,
      category,
      desc,
      slug,
    };

    mutation.mutate(data);
  };

  if (!isLoaded) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="text-center mt-8">You need to sign in to create a post!</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col top-[150px]  gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold text-gray-800">Create a New Post</h1>
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button
            type="button"
            onClick={clearError}
            disabled={progress > 0 && progress < 100}
            className="w-max p-3 shadow-md rounded-xl text-sm text-gray-500 bg-white disabled:opacity-50 hover:bg-gray-100 transition-all duration-200"
          >
            {progress > 0 && progress < 100 ? "Uploading..." : "Add a cover image"}
          </button>
        </Upload>

        {/* Image Preview Section */}
        {cover && cover.previewUrl && (
          <div className="relative w-full max-w-[250px] h-[150px] mb-4 mx-auto">
            <img
              src={cover.previewUrl}
              alt="Cover preview"
              className="w-full h-full object-cover rounded-md shadow-lg"
            />
            <button
              type="button"
              onClick={() => setCover(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Title Input */}
        <div>
          <input
            className="text-xl font-semibold bg-transparent outline-none p-3 w-full border-b border-gray-300"
            type="text"
            placeholder="Enter Post Title"
            value={title}
            onChange={handleTitleChange}
            name="title"
          />
          <span className="text-sm text-gray-500">{titleRemainingChars} characters remaining</span>
        </div>

        {/* Category Selection */}
        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-sm text-gray-700">Choose a category:</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-xl bg-white shadow-md w-full max-w-xs"
          >
            <option value="" disabled>Select a category</option>
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">SEO</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* Description Input */}
        <div>
          <textarea
            className="p-4 rounded-xl bg-white shadow-md w-full h-32"
            name="desc"
            placeholder="A Short Description"
            value={desc}
            onChange={handleDescChange}
          />
          <span className="text-sm text-gray-500">{descRemainingChars} characters remaining</span>
        </div>

        {/* Submit Button */}
        <button
          disabled={mutation.isPending || (progress > 0 && progress < 100)}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-3 w-full disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
        <span className="text-sm text-gray-500">{`Progress: ${progress}%`}</span>
      </form>
    </div>
  );
};

export default Write;
