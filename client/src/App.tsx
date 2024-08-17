import Home from "./Components/Home";
import Login from "./Components/Login";
import SignIn from "./Components/SignUp";
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}