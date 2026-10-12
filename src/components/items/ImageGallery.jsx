import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import Modal from '../common/Modal';

export default function ImageGallery({ images = [], title = 'Item photo' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const safeImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'];

  const currentImage = safeImages[selectedIndex] || safeImages[0];

  return (
    <div className="space-y-3">
      {/* Main Image Container */}
      <div className="relative aspect-16/10 sm:aspect-16/11 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 group shadow-sm">
        <img
          src={currentImage}
          alt={`${title} - view ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Zoom Button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          title="Expand image"
          aria-label="Expand image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Image Counter */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/70 text-white text-[11px] font-semibold backdrop-blur-md">
            {selectedIndex + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={title}
        maxWidth="max-w-4xl"
      >
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-black flex items-center justify-center">
          <img
            src={currentImage}
            alt={title}
            className="max-h-[70vh] w-auto object-contain"
          />
        </div>
      </Modal>
    </div>
  );
}
