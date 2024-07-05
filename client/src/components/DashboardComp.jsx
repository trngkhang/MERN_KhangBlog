import { useEffect, useState } from "react";
import { HiUserGroup, HiArrowUp, HiDocumentText } from "react-icons/hi";
import { BiSolidCommentDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
  const currentUser = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthCommnets, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.totalUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.totalComments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.totalPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
    fetchComments();
    fetchPosts();
  }, [currentUser]);

  return (
    <div className="dark:bg-slate-900 bg-gray-100 w-full min-h-screen p-3">
      <div className="grid e grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white flex justify-between rounded-md shadow-md p-3 dark:bg-slate-800">
          <div>
            <h1 className="text-gray-500 text-xl">TOTAL USERS</h1>
            <p className="text-3xl p-2">{totalUsers}</p>
            <div className="flex py-1">
              <span className="flex items-center  text-green-500 pr-2">
                <HiArrowUp />
                {lastMonthUsers}
              </span>
              <span className="">Last month</span>
            </div>
          </div>
          <HiUserGroup className="bg-teal-600 text-5xl rounded-full p-3 text-white" />
        </div>
        <div className="bg-white flex justify-between rounded-md shadow-md p-3 dark:bg-slate-800">
          <div>
            <h1 className="text-gray-500 text-xl">TOTAL COMMENTS</h1>
            <p className="text-3xl p-2">{totalComments}</p>
            <div className="flex py-1">
              <span className="flex items-center  text-green-500 pr-2">
                <HiArrowUp />
                {lastMonthCommnets}
              </span>
              <span className="">Last month</span>
            </div>
          </div>
          <BiSolidCommentDetail className="bg-indigo-600 text-5xl rounded-full p-3 text-white" />
        </div>
        <div className="bg-white flex justify-between rounded-md shadow-md p-3 dark:bg-slate-800">
          <div>
            <h1 className="text-gray-500 text-xl">TOTAL POSTS</h1>
            <p className="text-3xl p-2">{totalPosts}</p>
            <div className="flex py-1">
              <span className="flex items-center  text-green-500 pr-2">
                <HiArrowUp />
                {lastMonthPosts}
              </span>
              <span className="">Last month</span>
            </div>
          </div>
          <HiDocumentText className="bg-lime-600 text-5xl rounded-full p-3 text-white" />
        </div>
      </div>
      <div className="mt-5 lg:grid lg:grid-cols-3 lg:gap-4">
        <div className="bg-white  shadow-md dark:bg-slate-800 rounded-md ">
          <div className="flex justify-between p-3 px-6 items-center font-semibold">
            <h1>Recent Users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users &&
                users.map((user) => (
                  <Table.Row
                    key={user._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <div className="bg-white  shadow-md dark:bg-slate-800 rounded-md lg:col-span-2">
          <div className="flex justify-between p-3 px-6 items-center font-semibold">
            <h1>Recent Comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments &&
                comments.map((comment) => (
                  <Table.Row
                    key={comment._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <div className="bg-white  shadow-md dark:bg-slate-800 rounded-md lg:col-span-full">
          <div className="flex justify-between p-3 px-6 items-center font-semibold">
            <h1>Recent Posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {posts &&
                posts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      <img src={post.image} alt="user" className="w-30 h-10" />
                    </Table.Cell>
                    <Table.Cell>{post.title}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
