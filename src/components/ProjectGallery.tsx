"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProjectsCarousel, { type ProjectSlide } from "@/components/home/ProjectsCarousel";

export default function ProjectGallery({ projects }: { projects: ProjectSlide[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<ProjectSlide | null>(null);
  const [index, setIndex] = useState(0);
  const photos = selected
    ? [...new Map([
        { src: selected.image, alt: selected.imageAlt || selected.title },
        ...(selected.gallery ?? []).map((src, i) => ({ src, alt: selected.galleryAlts?.[i] || selected.title })),
      ].map((photo) => [photo.src, photo])).values()]
    : [];

  useEffect(() => {
    if (!selected) return;
    const modal = dialog.current;
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = document.activeElement;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [selected]);

  const move = (direction: number) => setIndex((current) => (current + direction + photos.length) % photos.length);
  const close = () => setSelected(null);

  return (
    <>
      <ProjectsCarousel projects={projects} tone="light" onProjectSelect={(project) => { setIndex(0); setSelected(project); }} />
      <dialog
        ref={dialog}
        data-lenis-prevent
        aria-labelledby="project-gallery-title"
        className="fixed inset-0 m-auto max-h-[94dvh] w-[min(72rem,94vw)] max-w-none overflow-y-auto border border-white/15 bg-lukx-charcoal p-0 text-white shadow-2xl backdrop:bg-black/80"
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
        }}
        onKeyDown={(event) => {
          if (photos.length < 2) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/15 px-5 py-4">
          <h2 id="project-gallery-title" data-no-split className="font-display text-2xl md:text-3xl">{selected?.title}</h2>
          <button type="button" autoFocus onClick={close} aria-label="Cerrar galería" className="flex min-h-11 min-w-11 items-center justify-center gap-2 border border-white/35 px-3 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-lukx-green"><span className="hidden sm:inline">Cerrar</span><span aria-hidden>×</span></button>
        </div>
        {photos[index] ? (
          <div className="relative h-[min(60dvh,42rem)] bg-black">
            <Image src={photos[index].src} alt={photos[index].alt} fill sizes="(max-width: 1200px) 94vw, 1152px" className="object-contain" />
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <button type="button" aria-label="Imagen anterior" disabled={photos.length < 2} onClick={() => move(-1)} className="min-h-11 min-w-11 border border-white/35 px-4 hover:bg-white/10 disabled:opacity-30">‹</button>
          <p aria-live="polite" aria-atomic="true" className="text-sm">Imagen {index + 1} de {photos.length}</p>
          <button type="button" aria-label="Imagen siguiente" disabled={photos.length < 2} onClick={() => move(1)} className="min-h-11 min-w-11 border border-white/35 px-4 hover:bg-white/10 disabled:opacity-30">›</button>
        </div>
        {photos.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto px-5 pb-5" aria-label="Imágenes del proyecto" data-lenis-prevent>
            {photos.map((photo, i) => (
              <button key={photo.src} type="button" onClick={() => setIndex(i)} aria-label={`Ver imagen ${i + 1}`} aria-pressed={index === i} className={`relative h-16 w-24 shrink-0 border-2 ${index === i ? "border-lukx-green" : "border-transparent hover:border-white/60"}`}>
                <Image src={photo.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
