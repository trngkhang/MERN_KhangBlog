import { Table, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComment() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments?limit=9`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.totalComments > 9) {
            setShowMore(true);
          }
        }
      } catch (error) {}
    };
    fetchComment();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${comments.length}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((pre) => [...pre, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/delete/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setComments((pre) => pre.filter((c) => c._id !== commentId));
        setOpenModal(false);
        setCommentIdToDelete(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full overflow-x-auto flex items-center flex-col p-3 dark:scrollbar-track-slate-700 scrollbar dark:scrollbar-thumb-slate-500">
      <h1 className="text-3xl mb-3">Comments list</h1>
      {currentUser.isAdmin && comments.length !== 0 ? (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date comment</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of like</Table.HeadCell>
              <Table.HeadCell>Post ID</Table.HeadCell>
              <Table.HeadCell>User ID</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments &&
                comments.map((comment) => (
                  <Table.Row
                    key={comment._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLike}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => {
                          setCommentIdToDelete(comment._id);
                          setOpenModal(true);
                        }}
                        className="font-medium text-red-500 hover:underline "
                      >
                        Delete
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="py-5 text-teal-500 hover:underline"
            >
              Showmore
            </button>
          )}
        </>
      ) : (
        <p className=" py-5">No comment yet!</p>
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
                onClick={() => handleDelete(commentIdToDelete)}
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
