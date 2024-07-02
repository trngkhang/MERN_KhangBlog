import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

export function PostCard({ post }) {
  return (
    <Link to={`/post/${post.slug}`}>
      <Card
        className="max-w-sm border border-teal-500"
        renderImage={() => <img className='h-[200px] object-cover rounded-lg' src={post.image} alt="" />}
      >
        <h5 className="text-xxl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
          {post.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {post.category}
        </p>
      </Card>
    </Link>
  );
}
