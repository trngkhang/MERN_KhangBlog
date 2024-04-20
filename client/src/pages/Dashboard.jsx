import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBard from "../components/DashSideBard";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUser from "../components/DashUser";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  //xem su tahy doi tu thanh search cua trinh duyet
  //khi hien Content con
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* DashSidebard */}
        <DashSideBard />
      </div>
      {/* UseEffect  */}
      {/* Profile... */}
      {tab === "profile" && <DashProfile />}
      {/* posts */}
      {tab === "posts" && <DashPost />}
      {tab === "users" && <DashUser />}
    </div>
  );
}
