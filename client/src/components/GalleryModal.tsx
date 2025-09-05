import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    src: string;
    alt: string;
    title: string;
  }>;
  initialIndex: number;
}

export function GalleryModal({ isOpen, onClose, images, initialIndex }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-full h-[80vh] p-0 bg-black/90"
        data-testid="gallery-modal"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={onClose}
            data-testid="gallery-close"
          >
            <X className="w-4 h-4" />
          </Button>
          
          {/* Previous button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 text-white hover:bg-white/20"
            onClick={prevImage}
            disabled={images.length <= 1}
            data-testid="gallery-prev"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          {/* Image */}
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain"
            data-testid={`gallery-image-${currentIndex}`}
          />
          
          {/* Next button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 text-white hover:bg-white/20"
            onClick={nextImage}
            disabled={images.length <= 1}
            data-testid="gallery-next"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          
          {/* Image title */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg">
            <h3 className="font-medium" data-testid={`gallery-title-${currentIndex}`}>
              {currentImage.title}
            </h3>
          </div>
          
          {/* Image counter */}
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
