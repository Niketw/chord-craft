import Header from '../components/Header';
import newlogo from '../vectors/newlogo.svg';
import { useEffect, useState } from 'react';
import httpClient from "../HttpClient.js";
import { Toaster, toast } from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Forgot() {
    useEffect(() => {
        document.title = "Forgot Password | ChordCraft";
    }, []);

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#FF4B4B',
                    color: '#fff',
                },
            });
            return;
        }

        try {
            const response = await httpClient.post('/forgot-password', {
                email,
                newPassword,
            });

            toast.success('OTP sent to your email! Please check your inbox.', {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#dd9613',
                    color: '#fff',
                },
            });

            // Redirect to VerifyOTP page after a short delay
            setTimeout(() => {
                window.location.href = "/verify";
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 404) {
                toast.error('No account found with this email!', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#FF4B4B',
                        color: '#fff',
                    },
                });
            } else {
                toast.error('Failed to process request. Please try again later.', {
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
                    <source src="https://fantastic-twilight-7bfa45.netlify.app/newusers.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className='flex bg-craft_grey text-primary min-h-[542px] items-center overflow-clip rounded-2xl relative z-10'>
                    <div className="working-container px-28 grid gap-5 justify-center justify-items-center">
                        <img src={newlogo} className="w-36"/>
                        <form onSubmit={handleForgotPassword} className="grid grid-rows-4 gap-3 items-center">
                            <div>
                                <label htmlFor="email" className='mb-1'>Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className='mb-1'>New Password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    name='newPassword'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className='mb-1'>Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button className='btn-default rounded-full mb-6 hover:bg-pink-300' type="submit">Send OTP</button>
                        </form>
                        <p className="font-light">Remember your password? <a href="/login" className='text-action'> Login </a> </p>
                    </div>
                    <div className="display-container px-16 max-w-[468px] blue-grad self-stretch flex flex-col justify-center">
                        <h3 className="display-text leading-[48px]">Reset your
                        Password</h3>
                        <p className="tagline-text mt-2">
                        Securely <span className='text-action'> reset your password</span> and regain access to your account
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}