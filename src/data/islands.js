export const islands = [
  {
    id: "moorea",
    name: { en: "Moorea", fr: "Moorea" },
    tagline: { en: "The magical island", fr: "L'île magique" },
    image: "/assets/imgs/moorea copy.jpg",
    center: [-149.842, -17.535],
    zoom: 11,
  },
  {
    id: "tahiti",
    name: { en: "Tahiti", fr: "Tahiti" },
    tagline: {
      en: "The heart of French Polynesia",
      fr: "Le cœur de la Polynésie",
    },
    image: "/assets/imgs/tahiti.jpeg",
    center: [-149.567, -17.65],
    zoom: 11,
  },
  {
    id: "bora-bora",
    name: { en: "Bora Bora", fr: "Bora Bora" },
    tagline: {
      en: "The pearl of the Pacific",
      fr: "La perle du Pacifique",
    },
    image: "/assets/imgs/Borabora.jpg",
    center: [-151.7, -16.5],
    zoom: 12,
  },
];

export const getIslandById = (id) => islands.find((i) => i.id === id);

export const islandBounds = {
  moorea: { lngMin: -149.95, lngMax: -149.75, latMin: -17.65, latMax: -17.45 },
  tahiti: { lngMin: -149.75, lngMax: -149.35, latMin: -17.85, latMax: -17.45 },
  "bora-bora": { lngMin: -151.85, lngMax: -151.55, latMin: -16.6, latMax: -16.4 },
};

export function detectIslandByLocation(lat, lng) {
  for (const [id, b] of Object.entries(islandBounds)) {
    if (
      lat >= b.latMin &&
      lat <= b.latMax &&
      lng >= b.lngMin &&
      lng <= b.lngMax
    ) {
      return id;
    }
  }
  return null;
}
