import React, { useState } from "react";
import httpClient from "../HttpClient";

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {
        console.log("Entered OTP:", otp); // Log the OTP being sent
        try {
            await httpClient.post("//localhost:5000/verify", { otp });
            alert("Email verified successfully!");
            window.location.href = "/";
        } catch (error) {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-green-500">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Verify OTP</h1>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="otp">OTP:</label>
                    <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-2 border border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <button
                    onClick={verifyOtp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                    Verify OTP
                </button>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
