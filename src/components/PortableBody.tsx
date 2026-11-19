import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { imageSource, urlFor } from "@/sanity/lib/image";

type BodyImage = {
  _key?: string;
  alt?: string;
  caption?: string;
  asset?: { _id?: string };
  hotspot?: unknown;
  crop?: unknown;
};

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h2 className="font-display text-3xl text-lukx-charcoal md:text-4xl">{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className="font-display mt-10 text-3xl text-lukx-charcoal md:text-4xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display mt-8 text-2xl text-lukx-charcoal md:text-3xl">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 text-lg font-semibold text-lukx-charcoal">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-relaxed text-lukx-muted md:text-lg">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-base leading-relaxed text-lukx-muted md:text-lg">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-lukx-green" aria-hidden />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-base leading-relaxed text-lukx-muted md:text-lg">{children}</li>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      const rel = [
        value?.newTab ? "noopener noreferrer" : "",
        value?.nofollow ? "nofollow" : "",
        value?.sponsored ? "sponsored" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return (
        <a
          href={href}
          rel={rel || undefined}
          target={value?.newTab ? "_blank" : undefined}
          className="text-lukx-green-btn underline"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: BodyImage }) => {
      const source = imageSource(value);
      if (!source) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(source).width(1600).url()}
            alt={value.alt || ""}
            width={1600}
            height={900}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-sm text-lukx-muted">{value.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export default function PortableBody({ value }: { value: unknown[] }) {
  return (
    <div className="space-y-2">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
