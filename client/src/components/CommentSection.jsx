import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Alert } from "flowbite-react";
import { useState } from "react";

export default function CommentSection(postId) {
  postId = postId.postId;
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length === 0 || comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: 'aaa',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  return (
    <div className=" max-w-2xl w-full mx-auto p-3">
      <h3 className=" text-center text-2xl font-semibold p-4">Comment</h3>
      {currentUser ? (
        <div className="text-sm flex flex-row gap-1 items-center">
          <p>Sign in as:</p>
          <img
            className=" w-6 rounded-full"
            src={currentUser.profilePicture}
            alt="profilePicture"
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to="/dashboard?tab=profile"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className=" text-teal-500 text-sm flex gap-2">
          You must be logged in to comment.
          <Link
            to="/login"
            className=" text-blue-500 hover:underline font-bold"
          >
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className=" rounded-md border border-teal-500 p-3 mt-4"
        >
          <textarea
            rows="3"
            maxLength="200"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a commment..."
            className="w-full rounded-md border-gray-400 text-sm"
          />
          <div className="flex justify-between items-center mt-5">
            <p className=" text-gray-400 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
