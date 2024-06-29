import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button } from "flowbite-react";

export default function Comment({ comment, onLike, onSave }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState();
  const [editing, setEditing] = useState(false);
  const [editedContent, settEditedContent] = useState("");
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
  const handleEdit = () => {
    setEditing(!editing);
    settEditedContent(comment.content);
  };
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setEditing(false);
        onSave(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex flex-row gap-3 py-3 border-b">
      <img
        className="rounded-full w-10 h-10"
        src={user && user.profilePicture}
        alt="avatar"
      />
      <div className="w-full">
        <div className="flex flex-row items-center ">
          <p className=" font-semibold text-sm truncate">
            @{user && user.username}
          </p>
          <p className="text-xs text-gray-500 ml-2">
            {moment(comment.createdAt).fromNow()}
          </p>
        </div>
        {editing ? (
          <div className="mt-2">
            <textarea
              value={editedContent}
              onChange={(e) => settEditedContent(e.target.value)}
              rows="2"
              className="text-sm rounded-md border-gray-400 w-full py-2 "
            />
            <div className="flex justify-end gap-2">
              <Button onClick={handleSave} gradientDuoTone="purpleToBlue">
                Save
              </Button>
              <Button
                onClick={handleEdit}
                outline
                gradientDuoTone="purpleToBlue"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 text-sm pt-1 pb-2">
              {comment && comment.content}
            </p>
            <div className="border-t flex flex-row gap-1 pt-1">
              <div className="flex flew-row gap-1  mr-1">
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
              {comment.userId === currentUser._id && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="text-xs text-gray-500 hover:text-blue-500"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
