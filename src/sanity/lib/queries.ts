import { defineQuery } from "groq";

const imageFields = `{
  alt,
  hotspot,
  crop,
  asset->{ _id }
}`;

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    excerpt,
    publishedAt,
    updatedAt,
    "categoryTitle": categories[0]->title,
    "categorySlug": categories[0]->slug.current,
    mainImage ${imageFields},
    "seoNoindex": seo.noindex == true
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    excerpt,
    publishedAt,
    updatedAt,
    _updatedAt,
    relatedServiceUrl,
    body,
    "authorName": author->name,
    "authorUrl": author->url,
    "categoryTitle": categories[0]->title,
    "categorySlug": categories[0]->slug.current,
    mainImage ${imageFields},
    seo {
      metaTitle,
      metaDescription,
      noindex,
      nofollow,
      canonical,
      ogImage ${imageFields}
    }
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current,
    title,
    summary,
    category,
    location,
    services,
    body,
    mainImage ${imageFields},
    gallery[] ${imageFields},
    seo {
      metaTitle,
      metaDescription,
      noindex,
      nofollow
    }
  }
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    summary,
    category,
    location,
    services,
    body,
    mainImage ${imageFields},
    gallery[] ${imageFields},
    seo {
      metaTitle,
      metaDescription,
      noindex,
      nofollow
    }
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`);

export const SITEMAP_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && seo.noindex != true] {
    "slug": slug.current,
    "updated": coalesce(updatedAt, publishedAt, _updatedAt)
  }
`);

const INDEXABLE_CATEGORY_POSTS = `count(*[_type == "post" && categories[0]._ref == ^._id && seo.noindex != true])`;

export const CATEGORY_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    description,
    "postCount": ${INDEXABLE_CATEGORY_POSTS}
  }
`);

export const SITEMAP_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current) && length(coalesce(description, "")) > 0 && ${INDEXABLE_CATEGORY_POSTS} >= 5] {
    "slug": slug.current,
    "updated": _updatedAt
  }
`);

export const SITEMAP_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current) && seo.noindex != true] {
    "slug": slug.current,
    "updated": _updatedAt
  }
`);
