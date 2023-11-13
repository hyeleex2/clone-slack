import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import loadable from "@loadable/component";

const LogIn = loadable(() => import("@pages/Login"));
const SignUp = loadable(() => import("@pages/SignUp"));
const Channel = loadable(() => import("@pages/Channel"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" Component={LogIn} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/workspace/channel" Component={Channel} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
