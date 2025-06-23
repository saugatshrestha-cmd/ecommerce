import { Button } from '@/components/ui/button';
import { useBannerProducts } from '@/hooks/useProduct';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import playstation from '@/assets/PlayStationMobile.png'
import macbook from '@/assets/MacBook Pro 14 mobile.png'
import airpods from '@/assets/AirpodMaxMobile.png'
import vision from '@/assets/VisionPromobile.png'

const HeroCarousel = () => {
    const { data: bannerProducts } = useBannerProducts();
    if (!bannerProducts || bannerProducts.length === 0) return null;
    return (
        <>
        <div className="bg-gray-100">
            {/* iPhone 14 Pro Hero Section */}
            <div className="relative bg-[#211C24] text-white overflow-hidden">
                <div className="container mx-auto px-4 lg:px-0">
                    <Carousel
                        className="w-full"
                        orientation="horizontal"
                        plugins={[
                            Autoplay({
                                delay: 3000,
                            }),
                        ]}
                    >
                        <CarouselContent>
                            {bannerProducts.map((product) => (
                                <CarouselItem key={product._id}>
                                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-2 items-center">
                                      {/* Text section */}
                                        <div className="space-y-6 text-center lg:text-left">
                                        <h1 className="text-4xl lg:text-7xl font-light tracking-tight">
                                            {product.bannerTitle}
                                        </h1>
                                        <p className="text-base lg:text-xl text-[#909090] font-medium max-w-md mx-auto lg:mx-0">
                                            {product.bannerDescription}
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="border-white text-white hover:text-black bg-transparent px-8 py-3 w-[191px] h-[56px]"
                                        >
                                            Shop Now
                                        </Button>
                                        </div>
                                      {/* Image section */}
                                        <div className="relative flex justify-center">
                                        <img
                                            src={product.bannerImage.url}
                                            alt={product.bannerTitle}
                                            className="h-[390px] lg:h-[632px] object-contain"
                                        />
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>

            {/* Mobile Layout: Vertical Stack */}
            <div className="lg:hidden">
                {/* AirPods Max */}
                <div className="bg-white p-6">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <img src={airpods} alt="AirPods Max" className="w-[80px] h-[200px] object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-light text-black">
                                Apple AirPods <span className="font-medium">Max</span>
                            </h2>
                            <p className="text-[#909090] text-sm font-medium mt-2">
                                Computational audio. Listen, it's powerful
                            </p>
                        </div>
                    </div>
                </div>

                {/* Apple Vision Pro */}
                <div className="bg-[#353535] p-6">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <img src={vision} alt="Apple Vision Pro" className="w-[120px] h-[150px] object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-light text-white">
                                Apple Vision <span className="font-medium">Pro</span>
                            </h2>
                            <p className="text-[#909090] text-sm font-medium mt-2">
                                An immersive way to experience entertainment
                            </p>
                        </div>
                    </div>
                </div>

                {/* PlayStation 5 */}
                <div className="bg-white p-6">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <img src={playstation} alt="PlayStation 5" className="w-[200px] h-[190px] object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-medium text-black">Playstation 5</h2>
                            <p className="text-[#909090] text-sm font-medium mt-2">
                                Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience.
                            </p>
                        </div>
                    </div>
                </div>

                {/* MacBook Air */}
                <div className="bg-[#EDEDED] p-6">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <img src={macbook} alt="MacBook Air" className="w-[180px] h-[310px] object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-light text-gray-900">
                                Macbook <span className="font-medium">Air</span>
                            </h2>
                            <p className="text-[#909090] text-sm font-medium mt-2 mb-4">
                                The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.
                            </p>
                            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 w-[191px] h-[56px]">
                                Shop Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout: Original Grid */}
            <div className="hidden lg:block">
                <div className="w-full py-0">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side: PlayStation on top, AirPods & Vision Pro below */}
                        <div className="flex flex-col w-full lg:w-1/2">
                            {/* PlayStation 5 */}
                            <div className="bg-white rounded-none p-0 shadow-sm">
                                <div className="grid grid-cols-2 items-stretch h-full">
                                    <div className="flex">
                                        <img src={playstation} alt="PlayStation 5" className="h-[343px] w-auto md:translate-x-[-88px]" />
                                    </div>
                                    <div className="flex flex-col justify-center pr-8 space-y-4">
                                        <h2 className="text-5xl font-medium text-black">Playstation 5</h2>
                                        <p className="text-[#909090] text-sm font-medium leading-relaxed">
                                            Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom row: AirPods Max & Vision Pro side by side */}
                            <div className="flex flex-row w-full">
                                {/* AirPods Max */}
                                <div className="flex-1 bg-white rounded-none p-0 shadow-sm">
                                    <div className="grid grid-cols-2 items-center h-full">
                                        <div className="flex justify-start">
                                            <img src={airpods} alt="AirPods Max" className="h-[272px] w-auto md:translate-x-[-108px]" />
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-light text-black">
                                                Apple<br />
                                                AirPods<br />
                                                <span className="font-medium">Max</span>
                                            </h2>
                                            <p className="text-[#909090] text-sm font-medium leading-relaxed">
                                                Computational audio.<br />
                                                Listen, it's powerful
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Apple Vision Pro */}
                                <div className="flex-1 bg-[#353535] rounded-none p-0">
                                    <div className="grid grid-cols-2 items-center h-full">
                                        <div className="flex justify-start overflow-hidden">
                                            <img src={vision} alt="Apple Vision Pro" className="h-[190px] w-auto md:translate-x-[-108px]" />
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-light text-white">Apple<br />Vision <span className="font-medium">Pro</span></h2>
                                            <p className="text-[#909090] text-sm font-medium leading-relaxed">
                                                An immersive way to <br /> experience <br /> entertainment
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: MacBook full height */}
                        <div className="bg-[#EDEDED] rounded-none p-0 lg:p-12 shadow-sm relative overflow-hidden w-full lg:w-1/2 flex items-center">
                            <div className="space-y-6 z-10">
                                <div>
                                    <h2 className="text-7xl font-light text-gray-900 mb-2">
                                        Macbook<br />
                                        <span className="font-medium">Air</span>
                                    </h2>
                                    <p className="text-[#909090] text-sm font-medium leading-relaxed max-w-xs">
                                        The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.
                                    </p>
                                </div>
                                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 w-[191px] h-[56px]">
                                    Shop Now
                                </Button>
                            </div>
                            <img src={macbook} alt="MacBook Air" className="h-[502px] w-auto md:translate-x-[188px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default HeroCarousel;