import { useState } from "react";
import { GalleryModal } from "@/components/GalleryModal";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const { t } = useLanguage();
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Hackathon team collaboration",
      title: "Hackathon 2024",
      category: "hackathon"
    },
    {
      src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Workshop presentation session",
      title: "Workshop React",
      category: "workshop"
    },
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Networking event",
      title: "Événement Networking",
      category: "networking"
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Innovation lab workspace",
      title: "Lab Innovation",
      category: "lab"
    },
    {
      src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Conference presentation",
      title: "Conférence Tech",
      category: "conference"
    },
    {
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "One-on-one mentoring session",
      title: "Session Mentorat",
      category: "mentoring"
    },
    {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Team collaboration",
      title: "Collaboration d'équipe",
      category: "teamwork"
    },
    {
      src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Software development",
      title: "Développement logiciel",
      category: "development"
    }
  ];

  const categories = [
    { key: "all", label: "Toutes" },
    { key: "hackathon", label: "Hackathons" },
    { key: "workshop", label: "Workshops" },
    { key: "conference", label: "Conférences" },
    { key: "networking", label: "Networking" },
    { key: "mentoring", label: "Mentorat" },
    { key: "lab", label: "Laboratoire" },
  ];

  const filteredImages = categoryFilter === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === categoryFilter);

  const handleGalleryClick = (index: number) => {
    setGalleryIndex(index);
    setGalleryModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="gallery-title">
              {t("gallery.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="gallery-subtitle">
              {t("gallery.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={categoryFilter === category.key ? "default" : "outline"}
              onClick={() => setCategoryFilter(category.key)}
              data-testid={`filter-${category.key}`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucune image trouvée</h3>
            <p className="text-muted-foreground">
              Aucune image ne correspond à cette catégorie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="gallery-grid">
            {filteredImages.map((image, index) => (
              <div 
                key={`${image.category}-${index}`}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => handleGalleryClick(index)}
                data-testid={`gallery-item-${index}`}
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h4 className="font-semibold text-sm truncate" data-testid={`gallery-title-${index}`}>
                    {image.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-card p-8 rounded-2xl border border-border">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Partagez vos moments</h2>
            <p className="text-muted-foreground">
              Participez à nos événements et créez des souvenirs inoubliables avec notre communauté
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Photos d'événements</h3>
              <p className="text-sm text-muted-foreground">
                Revivez nos hackathons, workshops et conférences
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Moments de collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Découvrez l'esprit d'équipe et d'innovation de notre communauté
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Célébrations</h3>
              <p className="text-sm text-muted-foreground">
                Célébrez les succès et les réalisations avec nous
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 text-center text-muted-foreground">
          <p data-testid="gallery-count">
            {filteredImages.length} image{filteredImages.length > 1 ? 's' : ''} 
            {categoryFilter !== "all" && ` dans la catégorie "${categories.find(c => c.key === categoryFilter)?.label}"`}
          </p>
        </div>
      </div>

      {/* Gallery Modal */}
      <GalleryModal 
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        images={filteredImages}
        initialIndex={galleryIndex}
      />
    </div>
  );
}
