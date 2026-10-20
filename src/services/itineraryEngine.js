/**
 * Itinerary Engine — 100% local, no external APIs, no servers.
 *
 * Takes questionnaire answers + POI list from usePOIs/islandId and produces
 * a day-by-day itinerary. POIs are grouped by approximate geographical sector
 * using their lat/lng coordinates. No driving times are ever invented.
 *
 * Navigation to each POI is delegated to the user's native maps app via
 * a simple URL — the engine never calculates or displays travel durations.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EXCLUDED_TAGS = ["lever-soleil", "coucher-soleil"];

const PACE_CONFIG = {
  tranquille: { perDay: 2, morning: 1, afternoon: 1 },
  equilibre: { perDay: 3, morning: 2, afternoon: 1 },
  intensif: { perDay: 4, morning: 2, afternoon: 2 },
};

// Category text that maps to the restaurant interest
const RESTAURANT_KEYWORDS = [
  "restaurant",
  "restaurants",
  "food",
  " dining",
  "gastronom",
];

// ---------------------------------------------------------------------------
// Types (JSDoc)
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} POI
 * @property {string} id
 * @property {{en:string, fr:string}} title
 * @property {{en:string, fr:string}} [category]
 * @property {{lat:number, lng:number}} [location]
 * @property {string[]} [tags]
 * @property {string} [island]
 */

/**
 * @typedef {Object} Reservation
 * @property {number|string} id
 * @property {string} name
 * @property {number} day
 * @property {string} startTime
 * @property {string} [endTime]
 * @property {string} location
 * @property {string} [notes]
 */

/**
 * @typedef {Object} QuestionnaireAnswers
 * @property {string} island
 * @property {number} duration
 * @property {string} companions
 * @property {string} transport
 * @property {string[]} interests
 * @property {string} pace
 * @property {boolean} includeRestaurants
 * @property {Reservation[]} reservations
 */

/**
 * @typedef {Object} Slot
 * @property {string} type  - "visit" | "restaurant" | "reservation" | "sunrise" | "sunset" | "free"
 * @property {string} [period] - "morning" | "lunch" | "afternoon"
 * @property {POI} [poi]
 * @property {string} [label]
 * @property {string} [time]
 */

/**
 * @typedef {Object} Day
 * @property {number} day
 * @property {Slot[]} slots
 */

/**
 * @typedef {Object} Itinerary
 * @property {string} island
 * @property {Day[]} days
 */

// ---------------------------------------------------------------------------
// Geo utilities (used ONLY for grouping/sorting, never for travel time)
// ---------------------------------------------------------------------------

/**
 * Haversine distance in km between two coordinates.
 * Used only to sort POIs into geographical clusters — never shown to users.
 */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Polar angle (in degrees, 0-360) of a POI relative to a center point.
 * For islands like Moorea with a circular coastal road, sorting by angle
 * groups POIs that are along the same stretch of coast.
 */
function polarAngle(lat, lng, centerLat, centerLng) {
  const dLng = lng - centerLng;
  const dLat = lat - centerLat;
  return (Math.atan2(dLat, dLng) * 180) / Math.PI + 180;
}

// ---------------------------------------------------------------------------
// Tag resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the list of tags for a POI. If the POI already has a `tags` array,
 * use it directly. Otherwise, infer tags from its category text and any
 * keyword matches in the title/description.
 *
 * This ensures the engine works with existing POIs in Firebase (which use
 * `category` text) AND with future POIs that may have explicit `tags`.
 */
function resolveTags(poi) {
  if (Array.isArray(poi.tags) && poi.tags.length > 0) {
    return poi.tags.map((t) => t.toLowerCase());
  }

  const tags = [];
  const catEn = (poi.category?.en || "").toLowerCase();
  const catFr = (poi.category?.fr || "").toLowerCase();
  const categoryText = `${catEn} ${catFr}`;

  if (RESTAURANT_KEYWORDS.some((kw) => categoryText.includes(kw))) {
    tags.push("gastronomie");
  }
  if (
    categoryText.includes("point of interest") ||
    categoryText.includes("point d'int") ||
    categoryText.includes("viewpoint") ||
    categoryText.includes("belv")
  ) {
    tags.push("paysages");
  }
  if (categoryText.includes("activit") || categoryText.includes("tourist")) {
    tags.push("nature");
  }

  // Check title for hints
  const titleText = `${poi.title?.en || ""} ${poi.title?.fr || ""}`.toLowerCase();
  if (
    titleText.includes("plage") ||
    titleText.includes("beach") ||
    titleText.includes("lagon") ||
    titleText.includes("lagoon")
  ) {
    tags.push("plages");
  }
  if (
    titleText.includes("snorkel") ||
    titleText.includes("plong") ||
    titleText.includes("dive")
  ) {
    tags.push("snorkeling");
  }
  if (
    titleText.includes("randonn") ||
    titleText.includes("hike") ||
    titleText.includes("trail") ||
    titleText.includes("mont") ||
    titleText.includes("mount")
  ) {
    tags.push("randonnees");
  }
  if (
    titleText.includes("cultu") ||
    titleText.includes("museum") ||
    titleText.includes("histoir") ||
    titleText.includes("marae") ||
    titleText.includes("church") ||
    titleText.includes("eglise")
  ) {
    tags.push("culture");
  }
  if (
    titleText.includes("belvedere") ||
    titleText.includes("viewpoint") ||
    titleText.includes("lookout") ||
    titleText.includes("panorama") ||
    titleText.includes("piton")
  ) {
    tags.push("paysages");
  }
  if (
    titleText.includes("march") ||
    titleText.includes("market") ||
    titleText.includes("shop") ||
    titleText.includes("boutique")
  ) {
    tags.push("marches");
  }
  if (
    titleText.includes("incontournable") ||
    titleText.includes("must-see") ||
    titleText.includes("must see")
  ) {
    tags.push("incontournables");
  }

  return tags;
}

/**
 * Check if a POI is a restaurant (by category text or tags).
 */
function isRestaurantPOI(poi) {
  const tags = resolveTags(poi);
  if (tags.includes("gastronomie")) return true;
  const catText = `${poi.category?.en || ""} ${poi.category?.fr || ""}`.toLowerCase();
  return RESTAURANT_KEYWORDS.some((kw) => catText.includes(kw));
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

/**
 * Filter POIs to those matching the user's interests and island.
 * Excludes sunset/sunrise POIs, POIs without coordinates, and POIs not on the
 * selected island.
 *
 * incontournables (must-see) POIs are included ONLY if they also match at
 * least one of the user's selected interests — they are never imposed
 * regardless of preferences.
 */
function filterEligiblePOIs(pois, answers) {
  const userTags = new Set(answers.interests.map((i) => i.toLowerCase()));
  const wantRestaurants =
    answers.includeRestaurants || userTags.has("gastronomie");

  return pois.filter((poi) => {
    // Must have coordinates
    if (
      !poi.location ||
      typeof poi.location.lat !== "number" ||
      typeof poi.location.lng !== "number"
    ) {
      return false;
    }

    // Must be on the right island
    if (poi.island && poi.island !== answers.island) return false;

    const tags = resolveTags(poi);

    // Exclude sunset/sunrise POIs
    if (tags.some((t) => EXCLUDED_TAGS.includes(t))) return false;

    // Restaurants: include if user wants restaurants, regardless of other interests
    if (isRestaurantPOI(poi)) {
      return wantRestaurants;
    }

    // Incontournables: include only if they ALSO match a selected interest
    const isIncontournable = tags.includes("incontournables");
    const hasMatchingInterest = tags.some((t) => userTags.has(t));

    if (isIncontournable && !hasMatchingInterest) {
      return false;
    }

    // General case: POI must match at least one selected interest
    return hasMatchingInterest;
  });
}

/**
 * Separate eligible POIs into restaurant POIs and activity POIs.
 */
function splitRestaurantsAndActivities(pois) {
  const restaurants = [];
  const activities = [];
  for (const poi of pois) {
    if (isRestaurantPOI(poi)) {
      restaurants.push(poi);
    } else {
      activities.push(poi);
    }
  }
  return { restaurants, activities };
}

// ---------------------------------------------------------------------------
// Geographic clustering
// ---------------------------------------------------------------------------

/**
 * Sort POIs into geographical order so that POIs in the same area of the
 * island are adjacent. For circular islands (Moorea), uses polar angle
 * around the island center. For elongated islands (Tahiti), sorts by
 * longitude (west-to-east). Falls back to a general centroid-based angle.
 */
function sortPOIsGeographically(pois, islandId, islandCenter) {
  if (pois.length === 0) return [];

  const centerLat = islandCenter?.lat ?? pois[0].location.lat;
  const centerLng = islandCenter?.lng ?? pois[0].location.lng;

  // Moorea: circular island with a ring road — sort by polar angle
  // Tahiti: elongated — sort by longitude (west to east)
  // Bora Bora: small circular — sort by polar angle
  const usePolar = islandId === "moorea" || islandId === "bora-bora";

  if (usePolar) {
    return [...pois].sort((a, b) => {
      const angleA = polarAngle(
        a.location.lat,
        a.location.lng,
        centerLat,
        centerLng
      );
      const angleB = polarAngle(
        b.location.lat,
        b.location.lng,
        centerLat,
        centerLng
      );
      return angleA - angleB;
    });
  }

  // Elongated islands: sort by longitude then latitude
  return [...pois].sort((a, b) => {
    if (a.location.lng !== b.location.lng) {
      return a.location.lng - b.location.lng;
    }
    return a.location.lat - b.location.lat;
  });
}

/**
 * Group geographically-sorted POIs into `numGroups` clusters, distributing
 * them so that each group contains POIs that are spatially adjacent.
 *
 * Uses proportional allocation: each POI is assigned to
 * `floor(i * numGroups / total)`. This ensures:
 * - When POIs >= days: each day gets a contiguous sector of the island
 * - When POIs < days: POIs are spread evenly across the entire stay
 *   (e.g. 3 POIs over 7 days → days 1, 3, 5), never clustered on
 *   consecutive first days leaving the rest empty.
 */
function clusterBySector(sortedPOIs, numGroups) {
  if (numGroups <= 0 || sortedPOIs.length === 0) return [];

  const total = sortedPOIs.length;
  const groups = Array.from({ length: numGroups }, () => []);

  for (let i = 0; i < total; i++) {
    const groupIndex = Math.floor((i * numGroups) / total);
    groups[Math.min(groupIndex, numGroups - 1)].push(sortedPOIs[i]);
  }

  return groups;
}

// ---------------------------------------------------------------------------
// Even distribution across days
// ---------------------------------------------------------------------------

/**
 * Distribute activity POIs across all days of the stay.
 *
 * KEY REQUIREMENT: POIs are spread evenly across the ENTIRE stay, even when
 * there are fewer POIs than available slots. We never fill the first days and
 * leave the rest empty — instead, we interleave so that free days are
 * scattered throughout the itinerary.
 *
 * Strategy:
 * 1. Sort all eligible activities geographically (by sector).
 * 2. Split into `duration` sector groups.
 * 3. Within each day, assign morning/afternoon slots based on the pace.
 */
function distributeActivitiesAcrossDays(
  activities,
  restaurants,
  duration,
  paceConfig,
  reservations
) {
  // Build a set of POI IDs already used (for anti-duplicate)
  const usedIds = new Set();

  // Build per-day structure
  const days = Array.from({ length: duration }, (_, i) => ({
    day: i + 1,
    slots: [],
  }));

  // --- Step 1: Place reservations as fixed blocks ---
  for (const r of reservations) {
    const dayIndex = (r.day || 1) - 1;
    if (dayIndex < 0 || dayIndex >= duration) continue;

    const timeRange = r.endTime
      ? `${r.startTime}–${r.endTime}`
      : r.startTime;

    days[dayIndex].slots.push({
      type: "reservation",
      label: r.name,
      time: timeRange,
      location: r.location,
      notes: r.notes || undefined,
    });
  }

  // --- Step 2: Add sunrise/sunset placeholder slots ---
  // (handled by caller via answers.interests — these are info-only slots)

  // --- Step 3: Sort activities geographically and cluster by day ---
  const sorted = sortPOIsGeographically(activities);
  const sectorGroups = clusterBySector(sorted, duration);

  // --- Step 4: For each day, fill morning + afternoon slots ---
  for (let d = 0; d < duration; d++) {
    const dayPois = sectorGroups[d] || [];

    // Determine how many morning/afternoon slots to fill
    const morningCount = paceConfig.morning;
    const afternoonCount = paceConfig.afternoon;

    // Separate this day's POIs into morning and afternoon
    const morningPois = dayPois.slice(0, morningCount);
    const afternoonPois = dayPois.slice(
      morningCount,
      morningCount + afternoonCount
    );

    // Add morning slots
    for (const poi of morningPois) {
      if (usedIds.has(poi.id)) continue;
      usedIds.add(poi.id);
      days[d].slots.push({
        type: "visit",
        period: "morning",
        poi,
      });
    }

    // Add lunch restaurant slot if restaurants requested and available
    // Pick the restaurant geographically closest to this day's POIs
    if (restaurants.length > 0) {
      const lunchRestaurant = pickClosestRestaurant(
        restaurants,
        dayPois,
        usedIds
      );
      if (lunchRestaurant) {
        usedIds.add(lunchRestaurant.id);
        days[d].slots.push({
          type: "restaurant",
          period: "lunch",
          poi: lunchRestaurant,
        });
      }
    }

    // Add afternoon slots
    for (const poi of afternoonPois) {
      if (usedIds.has(poi.id)) continue;
      usedIds.add(poi.id);
      days[d].slots.push({
        type: "visit",
        period: "afternoon",
        poi,
      });
    }

    // --- Step 5: Sort slots within each day by period order ---
    days[d].slots.sort((a, b) => slotOrder(a) - slotOrder(b));
  }

  // --- Step 6: If we have leftover POIs (more POIs than slots), don't use them ---
  // (they were already filtered by the clustering step)

  // --- Step 7: If some days have no POIs at all, add a "free day" slot ---
  for (const day of days) {
    const hasContent = day.slots.some(
      (s) => s.type === "visit" || s.type === "restaurant" || s.type === "reservation"
    );
    if (!hasContent) {
      day.slots.push({
        type: "free",
        label: "freeDay",
      });
    }
  }

  return { days, usedIds };
}

/**
 * Pick the restaurant geographically closest to a set of POIs.
 * Uses Haversine distance for selection only — never displayed to the user.
 */
function pickClosestRestaurant(restaurants, dayPois, usedIds) {
  const available = restaurants.filter((r) => !usedIds.has(r.id));
  if (available.length === 0) return null;

  if (dayPois.length === 0) {
    // No activity POIs for this day — just pick the first available restaurant
    return available[0];
  }

  // Find the restaurant with the minimum total distance to all day POIs
  let best = null;
  let bestDist = Infinity;

  for (const r of available) {
    let totalDist = 0;
    for (const p of dayPois) {
      totalDist += haversineKm(
        r.location.lat,
        r.location.lng,
        p.location.lat,
        p.location.lng
      );
    }
    if (totalDist < bestDist) {
      bestDist = totalDist;
      best = r;
    }
  }

  return best;
}

/**
 * Sort order for slots within a day:
 * sunrise < morning < reservation (by time) < lunch < afternoon < sunset < free
 */
function slotOrder(slot) {
  switch (slot.type) {
    case "sunrise":
      return 0;
    case "visit":
      if (slot.period === "morning") return 1;
      if (slot.period === "afternoon") return 5;
      return 3;
    case "reservation":
      // Sort reservations by start time within the day
      // Morning reservations (before 12:00) get order 2, afternoon get 4
      if (slot.time && slot.time.startsWith("0")) return 2;
      if (slot.time && parseInt(slot.time, 10) < 12) return 2;
      return 4;
    case "restaurant":
      return 3;
    case "sunset":
      return 6;
    case "free":
      return 7;
    default:
      return 8;
  }
}

// ---------------------------------------------------------------------------
// Sunrise/sunset slots
// ---------------------------------------------------------------------------

/**
 * Add sunrise/sunset info slots to each day if the user selected those
 * interests. These slots never contain POIs — they are placeholders that
 * reference the Sunset Paradise app.
 */
function addSunriseSunsetSlots(days, interests) {
  const wantSunrise = interests.includes("lever-soleil");
  const wantSunset = interests.includes("coucher-soleil");

  if (!wantSunrise && !wantSunset) return;

  for (const day of days) {
    if (wantSunrise) {
      day.slots.push({ type: "sunrise", label: "sunriseSlot" });
    }
    if (wantSunset) {
      day.slots.push({ type: "sunset", label: "sunsetSlot" });
    }
    day.slots.sort((a, b) => slotOrder(a) - slotOrder(b));
  }
}

// ---------------------------------------------------------------------------
// Island center lookup
// ---------------------------------------------------------------------------

const ISLAND_CENTERS = {
  moorea: { lat: -17.535, lng: -149.842 },
  tahiti: { lat: -17.65, lng: -149.567 },
  "bora-bora": { lat: -16.5, lng: -151.7 },
};

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Generate an itinerary from questionnaire answers and POI list.
 *
 * @param {POI[]} pois - All POIs (from usePOIs or manifest)
 * @param {QuestionnaireAnswers} answers - User's questionnaire answers
 * @returns {Itinerary} The generated itinerary
 */
export function generateItinerary(pois, answers) {
  const duration = answers.duration || 1;
  const paceConfig = PACE_CONFIG[answers.pace] || PACE_CONFIG.equilibre;

  // 1. Filter eligible POIs
  const eligible = filterEligiblePOIs(pois, answers);

  // 2. Split into restaurants and activities
  const { restaurants, activities } = splitRestaurantsAndActivities(eligible);

  // 3. Get island center for geographic sorting
  const islandCenter = ISLAND_CENTERS[answers.island];

  // 4. Distribute across days
  const { days, usedIds } = distributeActivitiesAcrossDays(
    activities,
    restaurants,
    duration,
    paceConfig,
    answers.reservations || []
  );

  // 5. Add sunrise/sunset info slots
  addSunriseSunsetSlots(days, answers.interests);

  // 6. Re-sort all slots within each day
  for (const day of days) {
    day.slots.sort((a, b) => slotOrder(a) - slotOrder(b));
  }

  return {
    island: answers.island,
    days,
  };
}

/**
 * Build a navigation URL for a POI that opens the user's native maps app.
 * Uses Google Maps directions URL which redirects to the native app on mobile.
 *
 * @param {POI} poi
 * @returns {string} URL to open in a new tab/window
 */
export function getNavigationUrl(poi) {
  if (!poi.location) return null;
  const { lat, lng } = poi.location;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

// ---------------------------------------------------------------------------
// Exports for testing
// ---------------------------------------------------------------------------

export const _internal = {
  haversineKm,
  polarAngle,
  resolveTags,
  isRestaurantPOI,
  filterEligiblePOIs,
  splitRestaurantsAndActivities,
  sortPOIsGeographically,
  clusterBySector,
  distributeActivitiesAcrossDays,
  pickClosestRestaurant,
  slotOrder,
  addSunriseSunsetSlots,
  PACE_CONFIG,
  ISLAND_CENTERS,
};
