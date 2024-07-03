import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaTimes, FaCheck } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showmore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowmore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      } else {
        console.log(data.message);
      }
      setOpenModal(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
    scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
    >
      <h1 className=" text-3xl mt-5 mb-3 w-full text-center">Users list</h1>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>UserName</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user, index) => (
                <Table.Row
                  key={`${user}-${index}`}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt="profilePicture"
                      className="w-20 h-10 object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500"></FaCheck>
                    ) : (
                      <FaTimes className="text-red-500"></FaTimes>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className=" font-medium text-red-400 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showmore && (
            <button
              onClick={handleShowmore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Showmore
            </button>
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
                  Are you sure you want to delete this user?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleDeleteUser}>
                    {"Yes, I'm sure"}
                  </Button>
                  <Button color="gray" onClick={() => setOpenModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <div className="my-16 flex justify-center">
          <p>No users yet!</p>
        </div>
      )}
    </div>
  );
}
