import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-ignoreheader p-3 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-semibold pb-3">About Khang's Blog</h1>
        <div className="text-md text-gray-500 flex flex-col gap-4 mt-3">
          <p>
            Welcome to Khang's Blog! This blog was created by{" "}
            <Link to="https://www.facebook.com/nguyenkhang289" className="font-semibold">
              Nguyen Khang
            </Link>{" "}
            as a personal project to share his thoughts and ideas with the
            world. Khang is a passionate developer who loves to write about
            technology, coding, and everything in between.
          </p>
          <p>
            On this blog, you'll find weekly articles and tutorials on topics
            such as web development, software engineering, and programming
            languages. Sahand is always learning and exploring new technologies,
            so be sure to check back often for new content!
          </p>
          <p>
            We encourage you to leave comments on our posts and engage with
            other readers. You can like other people's comments and reply to
            them as well. We believe that a community of learners can help each
            other grow and improve.
          </p>
        </div>
      </div>
    </div>
  );
}
