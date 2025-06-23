import { useState } from 'react';
import NewArrivals from '../products/NewArrivals';
import FeaturedProducts from '../products/FeaturedProducts';

const ProductShowcase = () => {
    const [activeTab, setActiveTab] = useState('New Arrival');
    const tabs = ['New Arrival', 'Featured Products'];

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'New Arrival':
                return (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <NewArrivals />
                    </div>
                );
            case 'Featured Products':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <FeaturedProducts />
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <NewArrivals />
                    </div>
                );
        }
    };

    return (
        <section className="py-12 px-4 sm:px-8 md:px-16 lg:px-[160px] bg-white">
            <div className="max-w-screen-2xl mx-auto">
                {/* Navigation Tabs */}
                <div className="flex mb-6">
                    <div className="flex space-x-12">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 px-2 text-lg font-medium transition-colors relative ${
                                    activeTab === tab
                                        ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Content Based on Active Tab */}
                {renderActiveTab()}
            </div>
        </section>
    );
};

export default ProductShowcase;
