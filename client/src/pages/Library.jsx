import Header from '../components/Header';
import perfectImg from './perfect.jpg';
import closerImg from './closer.jpg';
import OneDirectionImg from './oned.jpg';

export default function Library() {
    const libraryItems = [
        { id: 1, image: perfectImg, title: "Perfect", subtitle: "Ed Sheeran" },
        { id: 2, image: closerImg, title: "Closer", subtitle: "The Chainsmokers" },
        { id: 3, image: OneDirectionImg, title: "Perfect", subtitle: "One Direction" },
        { id: 4, image: "/path-to-image4.jpg", title: "Album Title 4", subtitle: "Artist 4" },
        { id: 5, image: "/path-to-image5.jpg", title: "Album Title 5", subtitle: "Artist 5" },
        { id: 6, image: "/path-to-image6.jpg", title: "Album Title 6", subtitle: "Artist 6" },
        { id: 7, image: "/path-to-image7.jpg", title: "Album Title 7", subtitle: "Artist 7" },
        { id: 8, image: "/path-to-image8.jpg", title: "Album Title 8", subtitle: "Artist 8" },
        { id: 9, image: "/path-to-image9.jpg", title: "Album Title 9", subtitle: "Artist 9" },
    ];

    return (
        <>
            <Header />
            <section className="bg-craft_black min-h-screen p-8">
                <div className='bg-craft_grey text-primary p-8 rounded-lg'>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {libraryItems.map((item) => (
                            <div key={item.id} className="flex flex-col items-center">
                                <div className="w-full h-48 overflow-hidden rounded-lg">
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
} 