import Header from '../components/Header';
import hero_logo from '../vectors/hero_logo.svg';
import { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function VerifyOTP() {
    const [otp, setOTP] = useState("");

    const verifyOtp = async () => {
        console.log("Entered OTP:", otp); // Log the OTP being sent
        try {
            await httpClient.post(`${apiUrl}`, { otp });
            alert("Email verified successfully!");
            window.location.href = "/";
        } catch (error) {
            alert("Invalid OTP");
        }
    };

    return (
    <>
        <Header/>
        <section className="bg-craft_black h-screen grid place-items-center relative">   
            <div className='flex bg-craft_grey text-primary min-h-[400px] items-center'>
                <div className="working-container px-20 grid gap-5 justify-center justify-items-center">
                    <img src={hero_logo} className="w-36"/>
                    <form action="" onSubmit={verifyOtp} method="post" className="grid grid-rows-2 gap-3 items-center w-72">
                        <div>
                            <label htmlFor="otp">OTP</label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOTP(e.target.value)}
                            />
                        </div>
                        
                        <button className='btn-alter-default justify-self-center' type="submit">Proceed</button>
                    </form>
                    <p className="font-light">OTP sent to <span className='text-action'> email </span> </p>
                </div>
            </div>
        </section>
        </>
    );
}