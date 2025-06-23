import { useBannerProducts } from "@/hooks/useProduct";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay"

const HeroCarousel = () => {
  const { data: bannerProducts } = useBannerProducts();

  if (!bannerProducts || bannerProducts.length === 0) return null;

  return (
    <div className="relative bg-[#211C24] text-white overflow-hidden py-8">
      <div className="container mx-auto px-4 lg:px-0">
        <Carousel
          className="w-full"
          orientation="horizontal"
          plugins={[
        Autoplay({
          delay: 4000,
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
                      className="w-[250px] h-[390px] lg:w-[406px] lg:h-[632px] object-contain"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

        </Carousel>
      </div>
    </div>
  );
};

export default HeroCarousel;
