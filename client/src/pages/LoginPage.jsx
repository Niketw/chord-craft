import Header from '../components/Header';
import hero_logo from '../vectors/hero_logo.svg';
import { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;
const serverPort = import.meta.env.VITE_S_PORT;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async () => {
        console.log(email, password);

        try {
            const resp = await httpClient.post(`${apiUrl}:${serverPort}/login`, {
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
    
        <section className="bg-craft_black h-screen grid place-items-center relative">
            <Header/>
            <div className='flex bg-craft_grey text-primary min-h-[542px] items-center'>
                <div className="working-container px-28 grid gap-5 justify-center justify-items-center">
                    <img src={hero_logo} className="w-36"/>
                    <form action="" onSubmit={logInUser} method="post" className="grid grid-rows-3 gap-3 items-center">
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
                        <button className='btn-alter-default justify-self-center' type='submit'>Login</button>
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