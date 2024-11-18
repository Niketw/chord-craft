import Header from '../components/Header';
import newlogo from '../vectors/newlogo.svg';
import { useState } from 'react';
import httpClient from "../HttpClient.js";
import { Toaster, toast } from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

export default function VerifyOTP() {
    const [otp, setOTP] = useState("");

    const verifyOtp = async (e) => {
        e.preventDefault();
        console.log("Entered OTP:", otp);
        try {
            await httpClient.post('/verify', { otp });
            
            toast.success('Email verified successfully!', {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#22c55e',
                    color: '#fff',
                },
            });

            // Short delay before redirect
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);

        } catch (error) {
            console.log(error);
            toast.error('Invalid OTP or verification failed', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#FF4B4B',
                    color: '#fff',
                },
            });
        }
    };

    return (
        <>
            <Header/>
            <section className="bg-craft_black h-screen grid place-items-center relative">
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
                <div className='flex bg-craft_grey text-primary min-h-[400px] items-center overflow-clip rounded-2xl relative z-10'>
                    <div className="working-container px-20 grid gap-5 justify-center justify-items-center">
                        <img src={newlogo} className="w-36"/>
                        <form onSubmit={verifyOtp} method="post" className="grid grid-rows-2 gap-3 items-center w-72">
                            <div>
                                <label htmlFor="otp">OTP</label>
                                <input
                                    id="otp"
                                    type="text"
                                    name='otp'
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                />
                            </div>
                            
                            <button className='btn-default rounded-full mb-6 hover:bg-pink-300' type="submit">Proceed</button>
                        </form>
                        <p className="font-light">OTP sent to <span className='text-action'> email </span> </p>
                    </div>
                </div>
            </section>

        </>
    );
}