import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-craft_grey/10 to-black text-primary py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">&copy; 2024 ChordCraft. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="/contact" className="text-gray-400 hover:text-craft_pink transition-colors">Contact Us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
} 