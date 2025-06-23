import React, { useState, useEffect, useRef } from 'react';
import airpod from '@/assets/Airpod.png';
import watch from '@/assets/Watch.png';
import ipad from '@/assets/IpadPro.png';
import samsung from '@/assets/SamsungGalaxy.png';
import macbook from '@/assets/MacBook Pro 14 mobile.png';

interface Product {
    id: number;
    title: string;
    description: string;
    image: string;
    bgColor: string;
    textColor: string;
    buttonStyle: string;
}

const products = [
    {
        id: 1,
        title: "Popular Products",
        description: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
        image: watch,
        bgColor: "bg-white",
        textColor: "text-gray-800",
        buttonStyle: "w-[191px] h-[56px] border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
    },
    {
        id: 2,
        title: "iPad Pro",
        description: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
        image: ipad, 
        bgColor: "bg-[#F9F9F9]",
        textColor: "text-gray-800",
        buttonStyle: "w-[191px] h-[56px] border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
    },
    {
        id: 3,
        title: "Samsung Galaxy",
        description: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
        image: samsung,
        bgColor: "bg-[#EAEAEA]",
        textColor: "text-gray-800", 
        buttonStyle: "w-[191px] h-[56px] border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
    },
    {
        id: 4,
        title: "Macbook Pro",
        description: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
        image: macbook,
        bgColor: "bg-[#2C2C2C]",
        textColor: "text-white",
        buttonStyle: "w-[191px] h-[56px] border-white text-white hover:bg-white hover:text-gray-900"
    }
];

const ProductCard: React.FC<{ product: Product; className?: string }> = ({ product, className = "" }) => (
    <div className={`${product.bgColor} ${product.textColor} px-6 pt-8 pb-16 flex flex-col items-center text-center h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center">
            {product.id === 1 ? (
                <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px]">
                    <img src={airpod} alt="AirPods" className="object-cover absolute w-[230px] h-[230px] md:w-[330px] md:h-[330px] top-0 left-0 transform" />
                    <img src={product.image} alt={product.title} className="object-cover absolute w-[210px] h-[210px] md:w-[290px] md:h-[290px] bottom-0 right-0 transform" />
                </div>
            ) : (
                <img src={product.image} alt={product.title} className="w-[260px] h-[260px] md:w-[360px] md:h-[360px] object-contain" />
            )}
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-4">{product.title}</h3>
        <p className="text-sm mb-6 opacity-80 leading-relaxed max-w-xs">{product.description}</p>
        <button className={`px-6 md:px-8 py-2 md:py-3 border-2 rounded-lg font-medium transition-all duration-300 ${product.buttonStyle}`}>
            Shop Now
        </button>
    </div>
);

const Banner: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        if (isMobile) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % products.length);
        }, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        }
    }, [isMobile]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % products.length);
        }, 3000);
        }
    };

    if (!isMobile) {
        return (
        <div className="w-full py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
        );
    }

    return (
        <div className="w-full relative py-6 overflow-hidden">
            <div className="relative h-[723px]">
                {products.map((product, index) => (
                    <div key={product.id} className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}>
                        <ProductCard product={product} className="h-full" />
                    </div>
                ))}
                <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-2 mb-6">
                    {products.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                                ? 'bg-gray-800 scale-110' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banner;
