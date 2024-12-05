import { useAuth, useUser } from '@clerk/clerk-react';
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Upload from '../components/Upload';

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState(''); // Content of the editor
  const [cover, setCover] = useState(''); // Cover image
  const [img, setImg] = useState(''); // Inline image
  const [video, setVideo] = useState(''); // Inline video
  const [progress, setProgress] = useState(0); // Upload progress

  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Add inline image to the editor
  useEffect(() => {
    if (img) {
      setValue((prev) => `${prev}<p><img src="${img.url}" alt="Uploaded Image" /></p>`);
    }
  }, [img]);

  // Add inline video to the editor
  useEffect(() => {
    if (video) {
      setValue((prev) => `${prev}<p><iframe class="ql-video" src="${video.url}" frameborder="0" allowfullscreen></iframe></p>`);
    }
  }, [video]);

  // Mutation for creating a new post
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
      toast.success('Post has been created');
      navigate(`/${res.data.slug}`);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover?.filePath || '',
      title: formData.get('title'),
      category: formData.get('category'),
      desc: formData.get('desc'),
      content: value,
    };

    mutation.mutate(data);
  };

  // Conditional rendering based on user authentication state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div>You must be logged in to create a post.</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        {/* Cover Image Upload */}
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
            Add a cover image
          </button>
        </Upload>

        {/* Title Input */}
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="My Awesome Story"
          name="title"
        />

        {/* Category Selection */}
        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-sm">
            Choose a category:
          </label>
          <select
            name="category"
            id="category"
            className="p-2 rounded-xl bg-white shadow-md"
          >
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="engineering">Engineering</option>
          </select>
        </div>

        {/* Content Editor */}
        <ReactQuill
          value={value}
          onChange={setValue}
          className="h-full overflow-auto bg-white border-2 rounded-md"
          theme="snow"
        />
        <button className="bg-blue-500 text-white p-2 rounded">Publish Post</button>
      </form>
    </div>
  );
};

export default Write;
