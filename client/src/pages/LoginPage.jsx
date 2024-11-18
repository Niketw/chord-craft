import Header from '../components/Header';
import newlogo from '../vectors/newlogo.svg';
import {useEffect, useState} from 'react';

import httpClient from "../HttpClient.js";
import { Toaster, toast } from 'react-hot-toast';


const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
    useEffect(() => {
        document.title = "Login | ChordCraft"
    }, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async (e) => {
        e.preventDefault();
        console.log(email, password);

        try {
            const resp = await httpClient.post('/login', {
                email,
                password,
            }, { withCredentials: true });

            toast.success('Login successful!', {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#22c55e', // green background
                    color: '#fff',
                },
            });

            // Short delay to allow the user to see the success message
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Invalid credentials', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#FF4B4B',
                        color: '#fff',
                    },
                });
            }
        }
    };

    return (
        <section className="bg-craft_black h-screen grid place-items-center relative overflow-hidden">
            <Toaster />
            <video 
                className="absolute w-full h-full object-cover opacity-30"
                autoPlay 
                loop 
                muted
                playsInline
            >
                <source src="https://fantastic-twilight-7bfa45.netlify.app/login.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <Header/>
            <div className='flex bg-craft_grey text-primary min-h-[542px] items-center overflow-clip rounded-2xl relative z-10'>
                <div className="working-container px-28 grid gap-5 justify-center justify-items-center">
                    <img src={newlogo} className="w-36"/>
                    <form onSubmit={logInUser} method="post" className="grid grid-rows-3 gap-3 items-center">
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
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className='btn-default rounded-full mb-6 hover:bg-pink-300' type={'submit'}>Login</button>
                    </form>
                    <p className="font-light">New here? <a href="/register" className='text-action'> Register </a> </p>
                </div>
                <div className="display-container px-16 max-w-[468px] blue-grad self-stretch flex flex-col justify-center">
                    <h3 className="display-text leading-[48px]">Resume your
                    Journey</h3>
                    <p className="tagline-text mt-2">
                    The path to <span className='text-action'> musical mastery </span> made simple
                    </p>
                </div>
            </div>

        </section>
    );
}