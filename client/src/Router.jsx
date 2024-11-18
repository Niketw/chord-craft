import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import VerifyOTP from "./pages/VerifyOTP";
import NotFound from "./pages/NotFound";
import Recorder from "./pages/Recorder.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import Crafter from "./pages/Crafter.jsx";
import Contact from "./pages/Contact.jsx";
import History from "./pages/History.jsx";
import Forgot from "./pages/Forgot.jsx";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/verify" element={<VerifyOTP />} />
                <Route path="/forgot" element={<Forgot />} /> 
                <Route path="/crafter" element = {<Crafter />} />
                <Route path="/library" element = {<LibraryPage />} />
                <Route path="/about" element={<NotFound />} />
                <Route path="/craft" element = {<Crafter />} />
                <Route path="/contact" element={<Contact />} />                
                <Route path="/history" element={<History />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

        </BrowserRouter>
    );
};

