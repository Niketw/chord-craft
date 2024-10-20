import React, { useState } from "react";
import httpClient from "../HttpClient";

const S_PORT = parseInt(process.env.REACT_APP_S_PORT, 10);

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async () => {
        console.log(email, password);

        try {
            const resp = await httpClient.post(`//localhost:${S_PORT}/login`, {
                email,
                password,
            }, { withCredentials: true });

            window.location.href = "/";
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Invalid credentials");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-green-500">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Log Into Your Account</h1>
                <form>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={logInUser}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
