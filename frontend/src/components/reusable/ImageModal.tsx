import { useState } from "react";
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ImageModal = ({
    images,
    isOpen,
    onClose,
}: {
    images: string[];
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] h-[70vh] flex flex-col">
        <div className="flex-1 relative flex items-center justify-center rounded-lg">
            <img
                src={images[currentIndex]}
                alt={`Product image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
            />

            {images.length > 1 && (
            <>
                <button
                onClick={prevImage}
                className="absolute left-4 p-2 rounded-full bg-white/80 hover:bg-white"
                aria-label="Previous image"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                onClick={nextImage}
                className="absolute right-4 p-2 rounded-full bg-white/80 hover:bg-white"
                aria-label="Next image"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </>
            )}
        </div>
        </DialogContent>
    </Dialog>
    );
};