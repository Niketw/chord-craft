import React, { useState } from "react";
import httpClient from "../HttpClient";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async () => {
        console.log(email, password);

        try {
            const resp = await httpClient.post("//localhost:5000/login", {
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
        <div>
            <h1>Log Into Your Account</h1>
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
                <button type="button" onClick={logInUser}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
