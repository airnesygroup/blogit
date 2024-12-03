import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import ReactQuill from "react-quill";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Upload from "../components/Upload";

import "react-quill/dist/quill.snow.css"; // Import React Quill styles

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState(""); // Store cover image data
  const [img, setImg] = useState(""); // Store uploaded image
  const [video, setVideo] = useState(""); // Store uploaded video
  const [progress, setProgress] = useState(0); // For tracking file upload progress

  const { getToken } = useAuth(); // Clerk auth hook to get the token
  const navigate = useNavigate();

  useEffect(() => {
    if (img) {
      setValue((prev) => prev + `<p><img src="${img.url}"/></p>`);
    }
  }, [img]);

  useEffect(() => {
    if (video) {
      setValue((prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`);
    }
  }, [video]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken(); // Fetch Clerk auth token
      return axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: (res) => {
      toast.success("Post has been created!");
      navigate(`/${res.data.slug}`); // Navigate to the newly created post
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
      img: cover.filePath || "", // Attach cover image if available
    };

    try {
      mutation.mutate(data); // Call the mutation to create the post
    } catch (error) {
      toast.error("Error creating post.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (isLoaded && !isSignedIn) return <div>You need to log in to create a post.</div>;

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <h1 className="text-xl font-light">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
            Add a cover image
          </button>
        </Upload>

        <input
          type="text"
          placeholder="My Awesome Story"
          name="title"
          className="text-2xl font-semibold bg-transparent outline-none"
        />

        <div className="flex gap-4">
          <label className="text-sm">Choose a category:</label>
          <select name="category" className="p-2 rounded-xl bg-white shadow-md">
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <textarea
          className="p-4 rounded-xl bg-white shadow-md"
          name="desc"
          placeholder="A Short Description"
        />

        <div className="flex gap-4">
          <Upload type="image" setProgress={setProgress} setData={setImg}>
            🌆
          </Upload>
          <Upload type="video" setProgress={setProgress} setData={setVideo}>
            ▶️
          </Upload>
        </div>

        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          readOnly={progress > 0 && progress < 100}
          className="flex-1 rounded-xl bg-white shadow-md"
        />

        <button
          type="submit"
          disabled={mutation.isLoading || (progress > 0 && progress < 100)}
          className="p-4 rounded-xl text-lg bg-blue-500 text-white shadow-md"
        >
          {mutation.isLoading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;
