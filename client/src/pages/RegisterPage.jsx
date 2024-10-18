import React, { useState } from "react";
import httpClient from "../HttpClient";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async () => {
        try {
            const resp = await httpClient.post("//localhost:5000/register", {
                email,
                password,
            });

            window.location.href = "/";
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Invalid credentials");
            }
        }
    };

    return (
        <div>
            <h1>Create an account</h1>
            <form>
                <div>
                    <label>Email: </label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="button" onClick={registerUser}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
