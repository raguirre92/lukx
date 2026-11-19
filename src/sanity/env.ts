export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7hhisq6a";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-02-19";

export function isProductionDeploy() {
  return process.env.VERCEL_ENV === "production";
}
