import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "../components/PostCard";
export default function Home() {
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        try {
          const fetchRecentPosts = async () => {
            const res = await fetch("/api/post/getposts");
            if (res.ok) {
              const data = await res.json();
              setRecentPosts(data.posts);
            }
          };
          fetchRecentPosts();
        } catch (error) {
          console.log(error.message);
        }
      }, []);

  return (
    <div className=" min-h-screen p-3">
      <div className=" my-20 justify-center max-w-2xl mx-auto">
        <h1 className=" text-3xl lg:text-5xl font-bold">Welcom to my blog</h1>
        <p className="text-sm text-gray-500 py-5">
          Welcome to my blog! Here, I share my passion for programming, along
          with various other fields. I hope my posts provide useful information
          and inspiration. Let's explore together!
        </p>
        <p className=" text-teal-500 font-semibold hover:underline">
          <Link to="/search">Views all post</Link>
        </p>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-center mb-5">Recent Posts</h1>
        <div className="flex flex-wrap gap-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        <h1 className="text-teal-500 font-semibold hover:underline py-5 text-center"><Link to="/search">Views all post</Link></h1>
      </div>
    </div>
  );
}
