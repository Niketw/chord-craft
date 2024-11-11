import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import VerifyOTP from "./pages/VerifyOTP";
import NotFound from "./pages/NotFound";
import Recorder from "./pages/Recorder.jsx";
import MidiCanvas from "./pages/Player.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/verify" element={<VerifyOTP />} />
                <Route path="/recorder" element = {<Recorder />} />
                <Route path="/player" element = {<MidiCanvas />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

