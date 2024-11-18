import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-craft_black text-primary py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">&copy; 2024 ChordCraft. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="/contact" className="text-gray-400 hover:text-pink-400 transition-colors">Contact Us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
} 