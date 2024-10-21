import Header from '../components/Header.jsx';
import Hero_logo from '../vectors/Hero_logo.svg';
import Ellipse from '../vectors/Ellipse 2.svg';
import { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Landing() {
    const [user, setUser] = useState(null);

    const logoutUser = async () => {
        await httpClient.post(`${apiUrl}/logout`);
        window.location.href = "/";
    };

    const getStarted = () => {
        window.location.href = "/register";
    }

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get(`${apiUrl}/@me`);
                setUser(resp.data);
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, []);
    

    return (
        <>
        <Header props={user}/>
        <section className="bg-craft_grey overflow-x-clip h-screen flex flex-col">
            
            <div className="hero grow grid items-center pl-32 relative  grid-cols-2 min-h-[600px]">
                <img src={Hero_logo}/>
                <img src={Ellipse} className="absolute right-0 bottom-0 translate-x-[56%] translate-y-[33%] w-3/5 lg:w-1/2 transition-all" />
            </div>

            <div className='self-center absolute bottom-24'> 
                {user ? <h3>Welcome {user.email} </h3> 
                 : 
                 <button className='btn-default' onClick={getStarted}> Get Started </button>}
                
            </div>

        </section>
        <section className="bg-craft_grey h-screen">
            
        </section>
        </>
    )
}
