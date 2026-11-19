import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lukx-green">404</p>
      <h1 className="font-display mt-3 text-5xl text-lukx-charcoal md:text-7xl">Página no encontrada</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-lukx-muted">
        Esa dirección no existe o ya no está publicada. Puedes volver al inicio o leer el blog.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn-green">
          Inicio
        </Link>
        <Link href="/blog" className="border border-black/20 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
          Blog
        </Link>
      </div>
    </section>
  );
}
