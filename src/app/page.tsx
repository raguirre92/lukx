import AboutStrip from "@/components/home/AboutStrip";
import BenefitsTabs from "@/components/home/BenefitsTabs";
import BlogTeasers from "@/components/home/BlogTeasers";
import ExperienceStrip from "@/components/home/ExperienceStrip";
import HeroCarousel from "@/components/home/HeroCarousel";
import Industries from "@/components/home/Industries";
import ProjectsCarousel from "@/components/home/ProjectsCarousel";
import ContactCta from "@/components/ContactCta";
import SolutionsGrid from "@/components/home/SolutionsGrid";
import { getBlogPosts, getPortfolioProjects } from "@/lib/wordpress";

export const revalidate = 300;

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getPortfolioProjects(), getBlogPosts()]);

  return (
    <>
      <HeroCarousel />
      <SolutionsGrid />
      <AboutStrip />
      <Industries />
      <BenefitsTabs />
      <ProjectsCarousel projects={projects} />
      <ExperienceStrip />
      <BlogTeasers posts={posts} />
      <ContactCta />
    </>
  );
}
