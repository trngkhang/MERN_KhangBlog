import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Signin from "./pages/Signin"
import SignUp from "./pages/Signup"

export default function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/About" element={<About/>}/>
      <Route path="/Dashboard" element={<Dashboard/>}/>
      <Route path="/Project" element={<Projects/>}/>
      <Route path="/Signin" element={<Signin/>}/>
      <Route path="/Signup" element={<SignUp/>}/>

    </Routes>
    </BrowserRouter>
  )
}

