import Header from '../components/Header.jsx';
import Hero_logo from '../vectors/newlogo.svg';
import Ellipse from '../vectors/Ellipse 2.svg';
import { useState, useEffect } from 'react';

import httpClient from "../HttpClient.js";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Landing() {
    const [user, setUser] = useState(null);

    const getStarted = () => {
        window.location.href = "/register";
    }

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get('/@me');
                setUser(resp.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);


    return (
        <>
        <Header />
        <section className="bg-white h-screen relative overflow-hidden">
            {/* Background video */}
            <div className="absolute inset-0 w-full h-full">
                {!user && (
                    <video 
                        autoPlay 
                        muted 
                        loop 
                        className="w-full h-full object-cover"
                    >
                        <source src="https://r7---sn-ci5gup-a3vl.googlevideo.com/videoplayback?expire=1731806448&ei=kPA4Z-yMELf5sfIPqPDzuAg&ip=209.141.44.95&id=o-AOJgoujGbJvSZRtiLj_SgFSGNQOC5OGUVPWZJavQzylA&itag=137&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278%2C394%2C395%2C396%2C397%2C398%2C399&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&rms=au%2Cau&siu=1&bui=AQn3pFQPlRTwijlQeobntkacJoIz6wImt7GjIvypTaOI3jjKcaFhrUj7phJsYSEwNDwH649wMQ&spc=qtApAYoZ2FS75-VJ1i6oJypdF0SWvojHotlr4HHjSMbHP3RUzstbXwtzkDAH2NmUepGt1Bn6Sg&vprv=1&svpuc=1&mime=video%2Fmp4&ns=9VvnuKDySrZH1S3yGQJdohUQ&rqh=1&gir=yes&clen=28416610&dur=265.680&lmt=1706051176682421&keepalive=yes&fexp=51299154%2C51312688%2C51326932&c=WEB&sefc=1&txp=4535434&n=fz-r7rVq4V94ug&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Csiu%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgFhnciFnKllhYyeLHykvTTm_QlkyaNWkw2RbzyvdL24ECIQDcVFfVFJOP1aXjR9RC8QFAI2efxooLkvfdmEbxabQVyg%3D%3D&pot=Mltlg9QZjrU-nmW7Oxn4fzuJ_rgGFC-sZMjGMOp8236t56_8LT_yi8rcdKHcs-WGzoXyDsLoXbyedJsv7AN6KrGX9pUE5Tih-pH_oNW7zX4DwDK63w15R7dT9_IE&range=0-&cms_redirect=yes&met=1731784858,&mh=HD&mip=2401:4900:5aa9:1572:1153:5e08:f515:d164&mm=31&mn=sn-ci5gup-a3vl&ms=au&mt=1731784394&mv=m&mvi=7&pl=44&lsparams=met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=AGluJ3MwRAIgJAb1AQKYrpTHO4KjX3a1OC_EFDDccwt0EANqDzGt1scCIEQg1DQs2ZzoAPm05dTEgiteZKkw9ULWII_BKsAOPqDT" type="video/mp4" />
                    </video>
                )}
                {user && (
                    <img src="https://i.ibb.co/26nvzhX/dude.jpg" className="w-full h-full object-cover"/>
                )}
            </div>

            {/* Hero content overlay */}
            <div className="relative h-full">
                <div className="w-full md:w-1/2 h-full flex items-center justify-center backdrop-blur-sm bg-black/70 p-8 rounded-br-3xl">
                    <div className="text-center">
                        {user ? (
                            <>
                                <h4 className="text-primary text-xl mb-2">Welcome, {user.name}</h4>
                                <p className="text-gray-400 mb-6">Pick where you left off</p>
                                <div>
                                    <a href="/recorder">
                                        <button className="btn-alter-default rounded-full hover:rounded-full hover:bg-pink-300">Compare audio</button>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="hero grid items-center relative grid-cols-1 min-h-[400px]">
                                    <img src={Hero_logo} className="max-w-full h-auto"/>
                                </div>
                                <button className='btn-default rounded-full mb-6 hover:bg-pink-300' onClick={getStarted}>Get Started</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
        <section className="bg-white h-screen">

        </section>
        </>
    )
}
