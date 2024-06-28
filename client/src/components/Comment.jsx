import { useEffect, useState } from "react";
import moment from "moment";

export default function Comment({ comment }) {
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
      </div>
    </div>
  );
}
