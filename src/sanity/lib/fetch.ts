import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";
import { client } from "@/sanity/lib/client";

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T | null> {
  try {
    const preview = (await draftMode()).isEnabled;
    const token = process.env.SANITY_API_READ_TOKEN;
    const active = preview && token ? client.withConfig({ token, useCdn: false }) : client;
    return await active.fetch<T>(query, params, {
      perspective: preview && token ? "previewDrafts" : "published",
      useCdn: !(preview && token),
      stega: preview && Boolean(token),
      next: { revalidate: preview ? 0 : 300, tags },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "error de Sanity";
    console.error("[sanity]", message);
    return null;
  }
}

export async function sanityFetchPublished<T>(query: string, params: QueryParams = {}): Promise<T | null> {
  try {
    return await client.withConfig({ useCdn: false }).fetch<T>(query, params, {
      perspective: "published",
      stega: false,
      next: { revalidate: 300, tags: ["post", "project", "category"] },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "error de Sanity";
    console.error("[sanity]", message);
    return null;
  }
}
