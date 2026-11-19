export const SITE_URL = "https://lukx.com.mx";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organization = {
  name: "Lukx",
  telephone: "+52 81 8340 1975",
  streetAddress: "Miguel Nieto 306, Nuevas Colonias",
  addressLocality: "Monterrey",
  addressRegion: "NL",
  addressCountry: "MX",
  timeZone: "America/Mexico_City",
  sameAs: [
    "https://www.facebook.com/lukx.mexico/",
    "https://www.instagram.com/lukx.mexico/",
    "https://www.linkedin.com/company/lukx-m%C3%A9xico/",
  ],
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
} as const;

export function organizationJsonLd() {
  return {
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORGANIZATION_ID,
    name: organization.name,
    url: SITE_URL,
    telephone: organization.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: organization.streetAddress,
      addressLocality: organization.addressLocality,
      addressRegion: organization.addressRegion,
      addressCountry: organization.addressCountry,
    },
    openingHoursSpecification: organization.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes,
    })),
    sameAs: [...organization.sameAs],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: organization.name,
    inLanguage: "es-MX",
    publisher: { "@id": ORGANIZATION_ID },
  };
}
