import Header from '../components/Header';
import newlogo from '../vectors/newlogo.svg';
import {useEffect, useState} from 'react';
import httpClient from "../HttpClient.js";
import { Toaster, toast } from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Signup() {
    useEffect(() => {
        document.title = "Sign Up | ChordCraft"
    }, []);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const resp = await httpClient.post(`/register`, {
                name,
                email,
                password,
            });

            toast.success('Registration successful! Please verify your email.', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#22c55e',
                    color: '#fff',
                },
            });

            // Short delay before redirect
            setTimeout(() => {
                window.location.href = "/verify";
            }, 1500);

        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error('User already exists', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#FF4B4B',
                        color: '#fff',
                    },
                });
            } else {
                console.log(error);
                toast.error('An error occurred during registration', {
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
        <>
            <Header />    
            <section className="bg-craft_black h-screen grid place-items-center relative overflow-hidden">
                <Toaster />
                <video 
                    className="absolute w-full h-full object-cover opacity-30"
                    autoPlay 
                    loop 
                    muted
                    playsInline
                >
                    <source src="https://ia802909.us.archive.org/10/items/login_202411/newusers.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
        
                <div className='flex bg-craft_grey text-primary min-h-[542px] items-center overflow-clip rounded-2xl relative z-10'>
                    <div className="working-container px-28 grid gap-5 justify-center justify-items-center">
                        <img src={newlogo} className="w-36"/>
                        <form onSubmit={registerUser} className="grid grid-rows-4 gap-3 items-center">
                            <div>
                                <label htmlFor="name" className='mb-1'>Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className='mb-1'>Email</label>
                                <input
                                    id="email"
                                    name='email'
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    name='password'
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button className='btn-default rounded-full mb-6 hover:bg-secondary' type={"submit"}>SignUp</button>
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