import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      if (location.pathname === "/posts") {
        setSearchParams({ ...Object.fromEntries(searchParams), search: query });
      } else {
        navigate(`/discover?search=${query}`);
      }
    }
  };

  return (
    <div
      className="bg-[var(--textColore4)] p-2 rounded-xl  border border-[var(--textColore4)] flex items-center gap-2 
      focus-within:ring-1 focus-within:ring-border-[var(--textColore4)]"
      style={{
        maxWidth: "550px",
        minWidth: "50px",
        
        flex: "1 1 auto",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="gray"
        className="flex-shrink-0"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="text"
        placeholder="search a post..."
        className="bg-transparent text-sm outline-none w-full"
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Search;
