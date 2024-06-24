import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);
  if (loading) {
    return (
      <div className="text-center">
        <Spinner aria-label="Extra large spinner example" size="xl" />
      </div>
    );
  }
  return (
    <main className=" min-h-screen flex flex-col max-w-5xl mx-auto p-3">
      <h1 className="text-3xl lg:text-4xl font-serif mx-auto max-w-2xl m-10">
        {post && post.title}
      </h1>
      <Link className=" self-center mt-5">
        <Button color="light" pill>
          {post && post.category}
        </Button>
      </Link>
      <img
        className="mx-auto mt-10 max-h-[500px] w-full object-cover"
        src={post && post.image}
      ></img>
      <div className="flex justify-between max-w-3xl mx-auto w-full text-sm p-3 pb-1 mb-2 border-b border-slate-400">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>
          {post && (post.content.length / 1000 + 1).toFixed(0)} mins read
        </span>
      </div>
      <div className="post-content p-3 max-w-3xl lg:max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
    </main>
  );
}
