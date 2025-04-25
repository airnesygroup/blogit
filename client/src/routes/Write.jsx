import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import 'react-quill-new/dist/quill.snow.css';
import Navbar from "../components/Navbar";

const Write = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);
  
  const { isLoaded, isSignedIn } = useUser();
  const [aboutbook, setAboutbook] = useState("");
  const [aboutauthor, setAboutauthor] = useState("");
  const [title, setTitle] = useState("");
  const [whoshouldread, setWhoshouldread] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState(null);
  const [cover, setCover] = useState(null);
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (img) {
      setDesc(prev => prev + `<p><img src="${img.url}"/></p>`);
    }
  }, [img]);

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
  
    // Ensure only the Submit button triggers validation
    const submitButton = e.nativeEvent.submitter; // Get the clicked button
    if (!submitButton || submitButton.name !== "submitPost") return;
  
    let missingFields = [];
  
    if (!title.trim()) missingFields.push("Title");
    if (!whoshouldread.trim()) missingFields.push("whoshouldread");
    if (!aboutauthor.trim()) missingFields.push("aboutauthor");
    if (!aboutbook.trim()) missingFields.push("aboutbook");
    if (!summary.trim()) missingFields.push("Summary");
    if (!desc.trim()) missingFields.push("Description");
    if (!category) missingFields.push("Category");
    if (!cover) missingFields.push("Cover Image");
    if (!author.trim()) missingFields.push("Author Name");
  
    // If any field is missing, show error and prevent submission
    if (missingFields.length > 0) {
      setError(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }
  
    let slug = title.trim().replace(/\s+/g, "-").toLowerCase();
    slug = slug.replace(/[^a-z0-9-]/g, "").replace(/-+$/, "");
    slug += "-summary";
    
    const data = {
      title,
      whoshouldread,
      aboutbook,
      aboutauthor,
      desc,
      category,
      img: cover?.filePath || "",
      author,
      summary,
      slug,
      isFeatured,
    };
  
    mutation.mutate(data);
  };
  
 

  

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>You need to sign in to create a post!</div>;

  return (
    <div>
            <Navbar/>
<div className="max-w-[900px] mx-auto flex flex-col mb-[100px]  px-2 justify-center items-center  overflow-x-scroll">
<h1 className="text-xl md:text-3xl mt-[30px] mb-[30px] text-[var(--textColor)] font-semibold">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Cover Image Upload & Preview */}
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="p-2 bg-[var(--textColore)] text-[var(--textColor)] rounded-lg">Upload Cover Image</button>
        </Upload>
        <div className="w-full max-h-[200px] bg-[var(--textColore)] rounded-lg flex items-center justify-center">
  {cover && (
    <img
      src={cover.url}
      alt="Cover Preview"
      className=" max-h-[200px] w-[50%] object-contain"
    />
  )}
</div>




        {/* Title Input */}
        <input type="text" placeholder="Enter Post Title" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 500))} className="p-2 bg-[var(--textColore)] text-[var(--textColor)]  rounded" />
        <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} className="p-2  rounded bg-[var(--textColore)] text-[var(--textColor)]" />
        <input type="text" placeholder="What's inside, short summary" value={summary} onChange={(e) => setSummary(e.target.value.slice(0, 600))} className="p-2 bg-[var(--textColore)] text-[var(--textColor)]  rounded" />

        <input type="text" placeholder="About the author" value={aboutauthor} onChange={(e) => setAboutauthor(e.target.value.slice(0, 600))} className="p-2 bg-[var(--textColore)] text-[var(--textColor)]  rounded" />
        <input type="text" placeholder="About this book" value={aboutbook} onChange={(e) => setAboutbook(e.target.value.slice(0, 600))} className="p-2 bg-[var(--textColore)] text-[var(--textColor)]  rounded" />
        <input type="text" placeholder=" Who should read this book" value={whoshouldread} onChange={(e) => setWhoshouldread(e.target.value.slice(0, 600))} className="p-2 bg-[var(--textColore)] text-[var(--textColor)]  rounded" />


        {/* Author Input */}

        {/* Category Selection */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 bg-[var(--textColore)] text-[var(--textColor)] rounded">
          <option value="" disabled>Select a category</option>
          <option value="self-growth">Self-Growth</option>
<option value="business-career">Business & Career</option>
<option value="fiction">Fiction</option>
<option value="productivity">Productivity</option>
<option value="home-environment">Home & Environment</option>
<option value="society-tech">Society & Tech</option>
<option value="health">Health</option>
<option value="family">Family</option>
<option value="sports-fitness">Sports & Fitness</option>
<option value="Biography">Biography</option>
<option value="happiness">Happiness</option>
<option value="spirituality">Spirituality</option>
<option value="leadership">Leadership</option>
<option value="love-sex">Love & Sex</option>
<option value="money-investments">Money & Investments</option>
<option value="negotiation">Negotiation</option>
        </select>

        {/* Rich Text Editor */}
        

        <ReactQuill 
  value={desc} 
  onChange={setDesc} 
  placeholder="Book summary..."
  className="bg-[var(--textColore)] text-[var(--textColor)] rounded"
  modules={{
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ align: [] }],
      ["link", "image"], // Removed color options
      ["clean"],
    ],
  }}
  formats={[
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "blockquote", "code-block",
    "align", "link", "image"
  ]}
/>

     
        {/* Featured Checkbox */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
          Mark as Featured
        </label>
        {error && <div className="text-red-600">{error}</div>}

        <button 
  name="submitPost" 
  type="submit" 
  disabled={mutation.isPending || (progress > 0 && progress < 100)}
  className="bg-blue-500 text-white p-2 rounded"
>
  {mutation.isPending ? "Publishing..." : "Publish Post"}
</button>

        <span>Upload Progress: {progress}%</span>
      </form>
    </div>
    </div>

  );
};

export default Write;


