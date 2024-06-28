import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState();
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`/api/user/getuser/${comment.userId}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex flex-row gap-3 py-3 border-b">
      <img
        className="rounded-full w-10 h-10"
        src={user && user.profilePicture}
        alt="avatar"
      />
      <div>
        <div className="flex flex-row items-center">
          <p className=" font-semibold text-sm truncate">
            @{user && user.username}
          </p>
          <p className="text-xs text-gray-500 ml-2">
            {moment(comment.createdAt).fromNow()}
          </p>
        </div>
        <p className="text-gray-500 py-2">{comment && comment.content}</p>
        <div className="border-t flex flex-row gap-1 pt-2">
          <button
            className={`text-gray-400 hover:text-blue-500 ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              "!text-blue-500"
            }`}
            onClick={() => onLike(comment._id)}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-xs text-gray-500">
            {comment.numberOfLike > 0 &&
              comment.numberOfLike +
                " " +
                (comment.numberOfLike === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
}
