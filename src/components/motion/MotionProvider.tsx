"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/** Split plain-text headings into word spans; keeps an unsplit accessible name. */
function splitHeading(el: HTMLElement) {
  if (el.dataset.split === "done") return el.querySelectorAll<HTMLElement>(".w > span");
  if (el.children.length && [...el.children].some((c) => c.tagName !== "SPAN" && c.tagName !== "BR")) return null;
  if ([...el.querySelectorAll("*")].some((c) => c.tagName === "A")) return null;
  const label = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  if (!label) return null;
  el.setAttribute("aria-label", label);
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
          const w = document.createElement("span");
          w.className = "w";
          w.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span");
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        (child as HTMLElement).setAttribute("aria-hidden", "true");
        walk(child);
      }
    });
  };
  walk(el);
  el.dataset.split = "done";
  return el.querySelectorAll<HTMLElement>(".w > span");
}

export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js-motion");
    if (reduce) {
      document.documentElement.classList.add("reduced-motion");
      return;
    }

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || a.getAttribute("href") === "#") return;
      const target = document.querySelector(a.getAttribute("href")!);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -88 });
      }
    };
    document.addEventListener("click", onAnchor);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener("click", onAnchor);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      const main = document.querySelector("main");
      if (!main) return;

      main.querySelectorAll<HTMLElement>("h2:not([data-no-split])").forEach((h) => {
        const words = splitHeading(h);
        if (!words?.length) return;
        gsap.from(words, {
          yPercent: 110,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: h, start: "top 88%", once: true },
        });
      });

      main.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      main.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.from(group.children, {
          y: 48,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });

      main.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
