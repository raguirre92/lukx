export function GET() {
  return new Response("Esta página ya no existe.", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
