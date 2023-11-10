import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
// import loadable from "@loadable/component";
import LogIn from "@pages/Login";
import SignUp from "@pages/SignUp";
// const Login = loadable(() => import("@pages/Login"));
// const SignUp = loadable(() => import("@pages/SignUp"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" Component={LogIn} />
        <Route path="/signup" Component={SignUp} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
