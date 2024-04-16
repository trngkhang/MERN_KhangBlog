import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Signin from "./pages/Signin";
import SignUp from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
