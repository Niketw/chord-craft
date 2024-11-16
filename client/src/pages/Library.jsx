import Header from '../components/Header';

export default function Library() {
    return (
        <>
            <Header />
            <section className="bg-craft_black h-screen grid place-items-center relative">
                <div className='flex bg-craft_grey text-primary min-h-[542px] items-center'>
                    <div className="working-container px-28 grid gap-5 justify-center justify-items-center">
                        <h2>Library</h2>
                        <p>Your music collection will appear here</p>
                    </div>
                </div>
            </section>
        </>
    );
} 