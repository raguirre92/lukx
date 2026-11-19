import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

type SanityImageField = {
  alt?: string | null;
  hotspot?: unknown;
  crop?: unknown;
  asset?: { _id?: string | null } | null;
} | null | undefined;

export function imageSource(image: SanityImageField): SanityImageSource | null {
  const ref = image?.asset?._id;
  if (!image || !ref) return null;
  return {
    _type: "image",
    asset: { _ref: ref },
    hotspot: image.hotspot,
    crop: image.crop,
  } as SanityImageSource;
}

export function imageUrl(image: SanityImageField, width = 1600) {
  const source = imageSource(image);
  if (!source) return null;
  return urlFor(source).width(width).url();
}
