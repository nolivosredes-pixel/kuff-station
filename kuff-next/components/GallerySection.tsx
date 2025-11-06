"use client";

import { useState } from "react";
import Image from "next/image";

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    "050425_kuff_sundance_stevengvisuals-10.jpg",
    "050425_kuff_sundance_stevengvisuals-11.jpg",
    "050425_kuff_sundance_stevengvisuals-12.jpg",
    "050425_kuff_sundance_stevengvisuals-17.jpg",
    "050425_kuff_sundance_stevengvisuals-18.jpg",
    "050425_kuff_sundance_stevengvisuals-19.jpg",
    "050425_kuff_sundance_stevengvisuals-20.jpg",
    "050425_kuff_sundance_stevengvisuals-21.jpg",
    "050425_kuff_sundance_stevengvisuals-24.jpg",
    "050425_kuff_sundance_stevengvisuals-25.jpg",
    "050425_kuff_sundance_stevengvisuals-26.jpg",
    "050425_kuff_sundance_stevengvisuals-27.jpg",
    "050425_kuff_sundance_stevengvisuals-28.jpg",
    "050425_kuff_sundance_stevengvisuals-29.jpg",
    "050425_kuff_sundance_stevengvisuals-30.jpg",
    "050425_kuff_sundance_stevengvisuals-31.jpg",
    "050425_kuff_sundance_stevengvisuals-32.jpg"
  ];

  const openImage = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <section id="gallery" className="parallax-gallery">
        <div className="parallax-container">
          {images.map((image, index) => {
            const num = index + 1;
            return (
              <div key={num} className={`parallax-layer parallax-layer-${num}`}>
                <div
                  className="parallax-image"
                  data-speed={num * 0.1 + 0.2}
                  onClick={() => openImage(`/assets/images/${image}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <Image
                    src={`/assets/images/${image}`}
                    alt={`KUFF Performance ${num}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="image-overlay"></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="lightbox-modal" onClick={handleBackdropClick}>
          <button className="lightbox-close" onClick={closeModal}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="lightbox-content">
            <Image
              src={selectedImage}
              alt="KUFF Performance"
              width={1920}
              height={1080}
              style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
