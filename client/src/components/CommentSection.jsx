import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Alert, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [deleteCommentId, setDeleteCommentId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getpostcomments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length === 0 || comment.length > 200) {
      setCommentError("Comment must be between 1 and 200 characters.");
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
          userId: currentUser._id, // Assuming currentUser has an id property
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments((prevComments) => [data, ...prevComments]);
      } else {
        setCommentError(data.message || "Failed to post comment.");
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      //thay doi like o database
      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: "PUT",
      });
      //cap nhat like o frontend
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLike: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setOpenModal(false);
    if (!currentUser) {
      return navigate("/login");
    }
    try {
      const res = await fetch(`/api/comment/delete/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      if (res.ok) {
        const deletedComment = await res.json();
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-3">
      <h3 className="text-center text-2xl font-semibold p-4">Comment</h3>
      {currentUser ? (
        <div className="text-sm flex flex-row gap-1 items-center">
          <p>Signed in as:</p>
          <img
            className="w-6 rounded-full"
            src={currentUser.profilePicture}
            alt="profile"
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to="/dashboard?tab=profile"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-teal-500 text-sm flex gap-2">
          You must be logged in to comment.
          <Link to="/login" className="text-blue-500 hover:underline font-bold">
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-teal-500 p-3 mt-4"
        >
          <textarea
            rows="3"
            maxLength="200"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full rounded-md border-gray-400 text-sm"
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-400 text-sm">
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
      <div className="flex flex-row items-center my-5">
        <p>Comments</p>
        <div className="border border-gray-400 px-2 ml-1">
          {comments.length}
        </div>
      </div>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onLike={handleLike}
            onSave={handleEdit}
            onDelete={(commentId) => {
              setOpenModal(true);
              setDeleteCommentId(commentId);
            }}
          />
        ))
      )}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(deleteCommentId)}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
