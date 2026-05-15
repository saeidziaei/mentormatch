import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TutorOnboard from "./pages/TutorOnboard";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/tutor/onboard"
        element={
          <RequireAuth>
            <TutorOnboard />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
