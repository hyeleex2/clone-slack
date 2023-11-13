import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import loadable from "@loadable/component";

const LogIn = loadable(() => import("@pages/Login"));
const SignUp = loadable(() => import("@pages/SignUp"));
const Workspace = loadable(() => import("@layouts/Workspace"));
const Channel = loadable(() => import("@pages/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" Component={LogIn} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/workspace/:workspace" element={<Workspace />}>
          <Route
            path="/workspace/:workspace/channel/:channel"
            element={<Channel />}
          />
          <Route
            path="/workspace/:workspace/dm/:id"
            element={<DirectMessage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
