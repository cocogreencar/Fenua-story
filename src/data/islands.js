export const islands = [
  {
    id: "moorea",
    name: { en: "Moorea", fr: "Moorea" },
    tagline: { en: "The magical island", fr: "L'île magique" },
    image:
      "https://images.pexels.com/photos/5034190/pexels-photo-5034190.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
    image:
      "https://images.pexels.com/photos/33980508/pexels-photo-33980508.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
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
    image:
      "https://images.pexels.com/photos/27272195/pexels-photo-27272195.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    center: [-151.7, -16.5],
    zoom: 12,
  },
];

export const getIslandById = (id) => islands.find((i) => i.id === id);
