import Header from '../components/Header';
import hero_logo from '../vectors/hero_logo.svg';
import { useState } from 'react';
import httpClient from "../HttpClient.js";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const resp = await httpClient.post(`/register`, {
                name,
                email,
                password,
            });

            // Redirect to OTP verification page
            window.location.href = "/verify";
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("User already exists");
            }
            else{
                console.log(error)
            }

        }
    };

    return (
        <>
        <Header />    
        <section className="bg-craft_black h-screen grid place-items-center relative">
    
            <div className='flex bg-craft_grey text-primary min-h-[542px] items-center overflow-clip rounded-2xl'>
                <div className="working-container px-28 grid gap-5 justify-center justify-items-center">
                    <img src={hero_logo} className="w-36"/>
                    <form onSubmit={registerUser} className="grid grid-rows-4 gap-3 items-center">
                        <div>
                            <label htmlFor="name" className='mb-1'>Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className='mb-1'>Email</label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className='btn-alter-default justify-self-center' type={"submit"}>SignUp</button>
                    </form>
                    <p className="font-light">Have an account? <a href="/login" className='text-action'> Login </a> </p>
                </div>
                <div className="display-container px-16 max-w-[468px] blue-grad self-stretch flex flex-col justify-center">
                    <h3 className="display-text leading-[48px]">Begin your
                    Journey</h3>
                    <p className="tagline-text mt-2">
                    The path to <span className='text-action'> musical mastery </span> made simple
                    </p>
                </div>
            </div>
        </section>
        </>
    );
}