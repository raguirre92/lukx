import ExperienceStrip from "@/components/home/ExperienceStrip";
import BlogTeasers from "@/components/home/BlogTeasers";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProjectsCarousel from "@/components/home/ProjectsCarousel";
import ContactCta from "@/components/ContactCta";
import SolutionsGrid from "@/components/home/SolutionsGrid";
import SpaceChooser from "@/components/home/SpaceChooser";
import { getBlogPosts, getPortfolioProjects } from "@/lib/cms";
import { isSpaceId } from "@/data/site";

export const revalidate = 300;

type HomePageProps = {
  searchParams: Promise<{ segmento?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [{ segmento }, projects, posts] = await Promise.all([
    searchParams,
    getPortfolioProjects(),
    getBlogPosts(),
  ]);
  const space = isSpaceId(segmento) ? segmento : undefined;

  return (
    <>
      <HeroCarousel />
      <SpaceChooser segmento={space} />
      <SolutionsGrid segmento={space} />
      <ProjectsCarousel projects={projects} />
      <ExperienceStrip />
      <ContactCta
        items={[
          "Revisamos tu caso: recibo, espacio o proyecto",
          "Te decimos qué solución conviene",
          "Armamos el siguiente paso: visita o propuesta",
        ]}
      />
      <BlogTeasers posts={posts} />
    </>
  );
}
