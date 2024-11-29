import Header from '../components/Header';
import Footer from '../components/Footer';
import {useEffect, useState} from 'react';
import httpClient from "../HttpClient.js";


export default function Contact() {
    useEffect(() => {
        document.title = "Contact Us | ChordCraft"
    }, []);
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await httpClient.post('/contact', {
                email,
                title,
                description
            });
            alert('Message sent successfully!');
            setEmail("");
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <>
            <Header />
            <section className="bg-craft_black h-screen grid place-items-center relative overflow-hidden">
                <video 
                    className="absolute w-full h-full object-cover opacity-90"
                    autoPlay 
                    loop 
                    muted
                    playsInline
                >
                    <source src="https://ia802909.us.archive.org/10/items/login_202411/newusers.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className='flex text-primary min-h-[500px] justify-center backdrop-blur-md bg-blue-700/10 overflow-clip rounded-2xl relative z-10 py-8'>
                    <div className="working-container px-28 grid gap-5 justify-center justify-items-center">
                        <h2 className="text-2xl font-bold">Contact Us</h2>
                        <ul className="text-gray-200 space-y-4">
                            <li>Address: IIITA, 211012, Prayagraj, UP, India</li>
                            <li>Email: iit2023003@iiita.ac.in</li>
                            <li>Contact Number: 7778889191</li>
                        </ul>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
} 