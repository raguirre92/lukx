import BlogTeasers from "@/components/home/BlogTeasers";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProjectsCarousel from "@/components/home/ProjectsCarousel";
import ContactCta from "@/components/ContactCta";
import SolutionsGrid from "@/components/home/SolutionsGrid";
import SpaceChooser from "@/components/home/SpaceChooser";
import { getBlogPosts, getPortfolioProjects } from "@/lib/cms";
import { brandedPage } from "@/lib/seo";

export const metadata = brandedPage({
  title: "Energía solar, respaldo e iluminación en Monterrey | Lukx",
  description:
    "Lukx diseña e instala proyectos de energía solar, respaldo e iluminación para casas, comercios e industrias en Monterrey.",
  path: "/",
  absolute: true,
});

export const revalidate = 300;

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getPortfolioProjects(), getBlogPosts()]);

  return (
    <>
      <HeroCarousel />
      <SpaceChooser />
      <SolutionsGrid />
      <ProjectsCarousel projects={projects} />
      <BlogTeasers posts={posts} />
      <ContactCta
        eyebrow=""
        backgroundImage="/images/2025-07-banner-abajo.jpg"
        items={[
          "Revisamos tu caso: recibo, espacio o proyecto",
          "Te decimos qué solución conviene",
          "Armamos el siguiente paso: visita o propuesta",
        ]}
      />
    </>
  );
}
