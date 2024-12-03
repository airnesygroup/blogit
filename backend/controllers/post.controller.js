import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import ReactQuill from "react-quill-new";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import "react-quill-new/dist/quill.snow.css";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [value, setValue] = useState(""); // Editor content
  const [cover, setCover] = useState(""); // Cover image data
  const [progress, setProgress] = useState(0); // Upload progress

  // Mutation for posting data
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken(); // Get the user's token
      console.log("Frontend Token:", token);

      return axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (res) => {
      toast.success("Post created successfully!");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      console.error("Post creation failed:", error.response?.data || error);
      toast.error(error.response?.data?.error || "Something went wrong!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Validate form data
    const title = formData.get("title");
    const category = formData.get("category");
    const desc = formData.get("desc");

    if (!title || !category || !desc || !value) {
      toast.error("All fields are required!");
      return;
    }

    const data = {
      img: cover?.filePath || "", // Cover image path
      title,
      category,
      desc,
      content: value, // Editor content
    };

    mutation.mutate(data);
  };

  // Conditional rendering based on authentication state
  if (!isLoaded) return <div>Loading...</div>;
  if (isLoaded && !isSignedIn) return <div>You need to sign in!</div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Create a New Post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-4 bg-gray-50 shadow rounded-md"
      >
        {/* Cover Image Upload */}
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button
            type="button"
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md"
          >
            Add Cover Image
          </button>
        </Upload>

        {/* Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Enter your title here"
          className="p-3 border rounded-md w-full"
          required
        />

        {/* Category Selection */}
        <select
          name="category"
          className="p-3 border rounded-md w-full"
          required
        >
          <option value="general">General</option>
          <option value="web-design">Web Design</option>
          <option value="development">Development</option>
          <option value="databases">Databases</option>
          <option value="marketing">Marketing</option>
        </select>

        {/* Short Description */}
        <textarea
          name="desc"
          placeholder="Write a short description..."
          className="p-3 border rounded-md w-full"
          rows="4"
          required
        ></textarea>

        {/* Content Editor */}
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="border rounded-md"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white ${
            mutation.isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={mutation.isLoading || progress > 0}
        >
          {mutation.isLoading ? "Creating Post..." : "Create Post"}
        </button>

        {/* Progress Indicator */}
        {progress > 0 && (
          <p className="text-sm text-gray-500">
            Uploading: {progress}% complete
          </p>
        )}
      </form>
    </div>
  );
};

export default Write;
