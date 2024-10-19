import React, { useState, useEffect } from "react";
import httpClient from "../HttpClient";

const LandingPage = () => {
    const [user, setUser] = useState(null);

    const logoutUser = async () => {
        await httpClient.post("//localhost:5000/logout");
        window.location.href = "/";
    };

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get("//localhost:5000/@me");
                setUser(resp.data);
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-black text-green-500">
            <header className="bg-gray-900 p-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold">ChordCraft</h1>
                <div className="space-x-4">
                    {user ? (
                        <button
                            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                            onClick={logoutUser}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <a href="/login">
                                <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition">
                                    Login
                                </button>
                            </a>
                            <a href="/register">
                                <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition">
                                    Register
                                </button>
                            </a>
                        </>
                    )}
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl mb-4">Welcome to ChordCraft</h2>
                {user != null ? (
                    <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-center">
                        <h3 className="text-xl font-semibold">Logged in</h3>
                        <p>ID: {user.id}</p>
                        <p>Email: {user.email}</p>
                    </div>
                ) : (
                    <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-center">
                        <p className="mb-4">You are not logged in</p>
                    </div>
                )}
            </main>
            <footer className="bg-gray-900 text-center p-4">
                <p>&copy; 2024 ChordCraft. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
