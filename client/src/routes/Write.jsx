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

  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken(); // Retrieve token
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover?.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    mutation.mutate(data);
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (isLoaded && !isSignedIn) return <div>You need to sign in!</div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col gap-6">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="p-2 bg-gray-100">Add Cover Image</button>
        </Upload>
        <input
          type="text"
          name="title"
          placeholder="Enter your title"
          required
        />
        <select name="category">
          <option value="general">General</option>
          <option value="web-design">Web Design</option>
          <option value="development">Development</option>
        </select>
        <textarea
          name="desc"
          placeholder="Short description"
          required
        />
        <ReactQuill theme="snow" value={value} onChange={setValue} />
        <button
          type="submit"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Write;
