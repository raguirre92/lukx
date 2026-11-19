import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type Payload = {
  _type?: string;
  slug?: { current?: string } | string;
};

export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<Payload>(
      request,
      process.env.SANITY_REVALIDATE_SECRET,
      true,
    );
    if (!isValidSignature) {
      return new Response("Firma inválida.", { status: 401 });
    }
    const type = body?._type;
    const slug = typeof body?.slug === "string" ? body.slug : body?.slug?.current;
    const tags = ["site"];
    if (type) tags.push(type);
    if (type && slug) tags.push(`${type}:${slug}`);
    for (const tag of tags) revalidateTag(tag, "max");
    return NextResponse.json({ revalidated: tags });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo revalidar.";
    console.error("[revalidate]", message);
    return new Response("No se pudo revalidar.", { status: 500 });
  }
}
