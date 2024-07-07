import { Label, Select, TextInput, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";

export default function SearchPost() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    const sortTermFormUrl = urlParams.get("sort");
    const categoryTermUrl = urlParams.get("category");
    if (searchTermFormUrl || sortTermFormUrl || categoryTermUrl) {
      setSidebarData({
        searchTerm: searchTermFormUrl,
        sort: sortTermFormUrl,
        category: categoryTermUrl,
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length === 9) {
            setShowMore(true);
          }
        }
        if (!res.ok) {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleShowMore = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const startIndex = posts.length;
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className=" min-h-screen flex flex-col md:flex-row">
      <div className="border-b border-gray-500 p-7 md:min-w-screen md:border-r md:min-w-fit">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex gap-4 items-center ">
            <Label htmlFor="searchTerm">Search Term:</Label>
            <TextInput
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4 items-center ">
            <Label htmlFor="sort">Sort:</Label>
            <Select
              id="sort"
              value={sidebarData.sort}
              onChange={handleChange}
              required
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center">
            <Label htmlFor="category">Category:</Label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
              required
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="javascript">Javascript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            className="w-full"
          >
            Apply filter
          </Button>
        </form>
      </div>
      <div className="w-full">
        <div className="text-3xl font-semibold p-5 border-b border-gray-500">
          <h1>Posts results:</h1>
        </div>
        <div>
          {!loading && posts.length === 0 && (
            <div>
              <h1 className="text-xl text-gray-500 p-8">No posts found.</h1>
            </div>
          )}
          {loading && (
            <div>
              <h1 className="text-xl text-gray-500 p-8">Loading...</h1>
            </div>
          )}
          {!loading && posts && (
            <div className="p-3 flex flex-wrap gap-4 justify-center">
              {posts.map((post, index) => (
                <PostCard key={post._id} post={post} />
              ))}
              {showMore && (
                <button
                  type="button"
                  className="text-teal-500 w-full py-7 text-sm self-center hover:underline "
                  onClick={handleShowMore}
                >
                  Show more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
