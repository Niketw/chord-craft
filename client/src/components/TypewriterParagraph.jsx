import { useState, useEffect, useRef } from 'react';

export default function TypewriterParagraph({ text, delay = 50, startDelay = 0 }) {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [shouldStart, setShouldStart] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setShouldStart(true);
            }, startDelay);
            return () => clearTimeout(timer);
        }
    }, [isVisible, startDelay]);

    useEffect(() => {
        if (shouldStart && currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text, shouldStart]);

    return (
        <p ref={elementRef} className="tagline-text mt-2">
            {currentText}
            {shouldStart && currentIndex === text.length && (
                <span className="animate-blink">|</span>
            )}
        </p>
    );
} 