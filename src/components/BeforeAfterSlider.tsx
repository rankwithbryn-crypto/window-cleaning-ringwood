import { useState } from 'react';
import { Sparkles, Eye, ZoomIn, CheckCircle2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'residential' | 'commercial' | 'solar';
  location: string;
  features: string[];
}

const galleryItems: GalleryItem[] = [
  {
    id: 'res-1',
    title: 'Residential Window Cleaning',
    description: 'Crystal clear views restored for a modern family home in Ringwood.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAindrwJES2xlCugBVveBqLi_N024b2JjwAVVOWJWtP7hwijQRSj2f9PUmQm_MDeHAJm011U3NmYhfTjQQaAf1RXvwhQTUaItbDbw79Y-N_NU-NVgxdfTKBooIx1dw4m9j6IUtwk0gnqtnbhFgYL_ndsZJ952u93zDvPDW9w71KT-y425FMV69EtyiDTHhwdSv1iR7qROy-bZk5Z44UmbqKav8IPZP_hoW3-VtxLwAZ-tihpijTV9154_z4XtndF2eWLaLQBbuGe1ck',
    category: 'residential',
    location: 'Ringwood East',
    features: ['Double-hung windows', 'Sills wiped clean', 'Tracks & screens vacuumed'],
  },
  {
    id: 'comm-1',
    title: 'Commercial Shopfront',
    description: 'Removing years of grime, sea mist, and handprint marks from busy main street glazing.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlh9qa3cqLcQEZGwUvjXkKaggl_71Z7nZj8Rmo7XHa5JfFGedvbf5kueL0x5UIedLnNxV5V2CzQVCMn3oP5Ksz-O8uul8DQ9dS1povQqD_VYyjHSDGki8cL6m_bVLRLH5Eg2LpaC9wB2zEzawaSwiWHIXh5l8hJoi66hFud1-gvRBCmqj0wh0fGhiKBAJRojRU-wBB-LMURxS0BN1WumYaYjh3k_P3igJwYBwpD-CghYR7t7F1t1HXsCbIp-fA2N2yK4Nd0cV_DOsl',
    category: 'commercial',
    location: 'Melbourne CBD Retail',
    features: ['High-traffic storefront', 'Polished trim detailing', 'Anti-static squeegee wash'],
  },
  {
    id: 'solar-1',
    title: 'Solar Panel Care',
    description: 'Restoring maximum absorption and micro-efficiency with pure-water flushing.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC5rDGgKKcRJ2bIZ0y6fVBX3c5RpoF99NjzMBj7QsZL5He51sNwUjnShjJkqJmCRw7ceD1czGUYX9eYJiRaJa5nPztGaLqT-g56v9R7NalDpQk98kSvxzN3s5fimuexIeci_HjYbSS5XunS--hUTkuGWqCPFIPQxIqSP6N1lzbrhV7giWACtKCieIlCXG4agejfNu5XQN6ZJ1febji-XFE2lrEACaAgDkvAC7iCrIKNhBO3P5p-a_rzlgdBklQKJZCqJ6_ub2uUMRj',
    category: 'solar',
    location: 'Melbourne Suburbs Roof Array',
    features: ['Baked-on bird droppings clearing', '100% mineral-free pure-water', 'Up to 25% power generation gain'],
  },
];

export default function BeforeAfterSlider() {
  const [activeTab, setActiveTab] = useState<'all' | 'residential' | 'commercial' | 'solar'>('all');
  const [zoomedId, setZoomedId] = useState<string | null>(null);

  const filteredItems = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <section id="gallery" className="py-20 px-4 md:px-10 bg-[#0E0E10] border-y border-zinc-900 relative overflow-hidden">
      {/* Decorative clean line bubbles */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" /> High Definition Results
          </div>
          <h2 className="text-3xl md:text-4xl font-headline-lg font-bold text-on-background tracking-tight mb-4 font-serif italic">
            See the Difference
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Drag, zoom, and inspect real results from our residential and commercial cleaning projects across Ringwood and Greater Melbourne.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {(['all', 'residential', 'commercial', 'solar'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-primary text-black shadow-[0_4px_20px_rgba(197,160,89,0.30)] scale-105'
                    : 'bg-zinc-900 text-on-surface-variant hover:bg-zinc-800 hover:text-primary border border-zinc-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel group rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-[0_12px_40px_rgba(197,160,89,0.15)] transition-all duration-300 border border-primary/20 bg-zinc-950/40"
            >
              {/* Image Container with Custom Interactive Split Layout */}
              <div className="relative aspect-square overflow-hidden bg-zinc-900 select-none">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-75"
                  referrerPolicy="no-referrer"
                />

                {/* Bottom overlays indicating Left = Before, Right = After */}
                <div className="absolute bottom-3 left-3 bg-zinc-950/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-bold text-zinc-400 tracking-widest uppercase border border-zinc-800 z-10 shadow-md">
                  BEFORE (DIRTY)
                </div>
                <div className="absolute bottom-3 right-3 bg-primary/95 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-bold text-black tracking-widest uppercase border border-primary/20 z-10 shadow-md">
                  AFTER (CLEAN)
                </div>

                {/* Divider Line in the vertical center to mimic split screen slider */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary/50 backdrop-blur-xs shadow-lg flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center shadow-lg border border-primary/30 pointer-events-none">
                    <span className="text-[10px] font-black font-mono">↔</span>
                  </div>
                </div>

                {/* Region Tag */}
                <div className="absolute top-3 left-3 bg-zinc-950/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-xs border border-primary/25">
                  {item.location}
                </div>

                {/* Action buttons on Hover */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setZoomedId(zoomedId === item.id ? null : item.id)}
                    className="p-3 bg-primary text-black rounded-full hover:scale-110 active:scale-95 transition-transform duration-200 shadow-lg"
                    title="Inspect View"
                  >
                    <ZoomIn className="w-5 h-5 font-bold" />
                  </button>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-xl font-bold text-on-background mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Service Features checklist */}
                <div className="space-y-2 pt-3 border-t border-zinc-900">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Zoom Lightbox Modal */}
        {zoomedId && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all animate-fade-in"
            onClick={() => setZoomedId(null)}
          >
            {(() => {
              const item = galleryItems.find(i => i.id === zoomedId);
              if (!item) return null;
              return (
                <div 
                  className="bg-[#111113] border border-primary/20 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl relative"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-zinc-900 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-on-background text-lg">{item.title}</h3>
                      <p className="text-xs text-on-surface-variant">{item.location} • Proof of Excellence</p>
                    </div>
                    <button 
                      onClick={() => setZoomedId(null)}
                      className="px-4 py-2 bg-zinc-900 hover:bg-primary text-white hover:text-black text-xs font-bold rounded-full transition-colors border border-zinc-800"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div className="relative aspect-video bg-zinc-900">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 text-zinc-400 text-[11px] font-bold px-3 py-1 rounded border border-zinc-800">
                      ← DIRTY (BEFORE CLEANING)
                    </div>
                    <div className="absolute top-2 right-2 bg-primary text-black text-[11px] font-bold px-3 py-1 rounded">
                      CLEAN (AFTER CLARITY TREATMENT) →
                    </div>
                  </div>
                  <div className="p-6 bg-zinc-950/40 border-t border-zinc-900">
                    <h4 className="font-semibold text-sm text-primary mb-2">Scope of Detailing Completed:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {item.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="font-medium text-zinc-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
}
