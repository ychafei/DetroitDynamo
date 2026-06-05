import React, { useEffect, useState } from 'react';
import { galleryItemRepo } from '@/api/repo';
import { Image as ImageIcon } from 'lucide-react';
import { TeamPageHero, ComingSoon } from '@/components/team/TeamPageShell';

export default function TeamGallery() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    galleryItemRepo.list('-created_date').then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <TeamPageHero
        eyebrow="From the Pitch"
        title="DETROIT DYNAMO FC"
        accentTitle="GALLERY"
        description="Photos and video from training sessions, matchdays, and team moments."
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items === null ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-card border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <ComingSoon icon={ImageIcon} message="Gallery coming soon" sub="Photos and video drop after the first matchday." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((item) => (
                <div key={item.id} className="aspect-square bg-card border border-border rounded-lg overflow-hidden group">
                  {item.media_url && (
                    <img
                      src={item.media_url}
                      alt={item.caption || 'Detroit Dynamo FC gallery'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
