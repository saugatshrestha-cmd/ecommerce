import { Facebook, Instagram, Twitter } from "lucide-react";


const Footer = () => {
    return(
        <>
        <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-4">E-commerce</h3>
                <p className="mb-4">We offer the best products at the best prices, with exceptional customer service and fast shipping.</p>
                <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                    <Facebook />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <Twitter />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <Instagram />
                </a>
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Shop</h3>
                <ul className="space-y-2">
                <li>
                    <a href="#" className="hover:text-white transition-colors">All Products</a>
                </li>
                <li>
                    <a href="#" className="hover:text-white transition-colors">New Arrivals</a>
                </li>
                <li>
                    <a href="#" className="hover:text-white transition-colors">Featured Products</a>
                </li>
                </ul>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
                <ul className="space-y-2">
                <li>
                    <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </li>
                <li>
                    <a href="#" className="hover:text-white transition-colors">FAQs</a>
                </li>
                <li>
                    <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
                </li>
                <li>
                    <a href="#" className="hover:text-white transition-colors">Track Your Order</a>
                </li>
                </ul>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
                <ul className="space-y-2">
                <li>
                    <a href="#" className="hover:text-white transition-colors">Our Story</a>
                </li>
                <li>
                    <a href="#" className="hover:text-white transition-colors">Blog</a>
                </li>
                <li>
                    <a href="#" className="hover:text-white transition-colors">Careers</a>
                </li>
                </ul>
            </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                    <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                </div>
            </div>
            </div>
        </div>
        </footer>
        </>
    )
}

export default Footer;