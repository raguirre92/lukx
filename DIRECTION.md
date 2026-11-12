# Lukx — Dirección UX/UI (upgrade, misma marca)
Skill: build-awwwards-quality-sites (sin identidad nueva: se conserva la marca Lukx).

- **Tesis visual:** "Energía que se ve". Fotografía real de obra a sangre completa, tipografía Bebas monumental y un único acento verde Lukx que marca energía/acción. Negro carbón + blanco, ritmo editorial con mucho aire.
- **Asset focal del hero:** carrusel de fotografía real existente (paneles, estaciones, bodega LED, coolers, BESS) con crossfade + Ken Burns lento; titular enorme "Soluciones energéticas e iluminación." con índice de soluciones numerado como navegación del slide.
- **Tipografía:** Bebas Neue (display, clamp 3.5–9rem hero, 2.4–4.5rem H2), Montserrat (cuerpo 15–17px, eyebrows 11px uppercase tracking .22em en verde).
- **Color (Lukx):** #0d0d0d negro, #222 carbón, #19b600 verde acento, #088538 verde botón / #0a9e44 hover, #6b6b6b muted, #f4f4f4 light, blanco.
- **Secuencia home:** Hero → Soluciones (índice) → Nosotros → Industrias → Beneficios → Proyectos (WP) → 15 años → Blog → CTA final → Footer.
- **Motion:** GSAP + ScrollTrigger. Intro del hero: líneas del titular suben, CTA y índice entran escalonados (contenido visible sin JS). Headings se revelan palabra por palabra (texto accesible íntegro en aria-label). Imágenes con clip-reveal y parallax suave. Hover/focus en CSS.
- **Smooth-scroll:** Lenis (único motor), conectado a ScrollTrigger vía gsap.ticker; desactivado con prefers-reduced-motion (estados finales inmediatos).
- **Three.js:** NO. La fotografía real es el protagonista; un shader no aporta a la narrativa.
- **Assets:** sólo fotografía/video/logos existentes en /public (propiedad de Lukx). Íconos de interfaz: Solar vía Iconify. Sin testimonios, partners ni premios inventados.
