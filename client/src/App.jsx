import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Signin from "./pages/Signin";
import SignUp from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
