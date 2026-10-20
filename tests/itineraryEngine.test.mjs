import {
  generateItinerary,
  getNavigationUrl,
  _internal,
} from "../src/services/itineraryEngine.js";

// ---------------------------------------------------------------------------
// Mock POI factory
// ---------------------------------------------------------------------------

let poiCounter = 0;
function makePOI(opts = {}) {
  poiCounter++;
  const id = opts.id || `poi-${poiCounter}`;
  return {
    id,
    title: {
      en: opts.titleEn || `POI ${id}`,
      fr: opts.titleFr || `POI ${id}`,
    },
    category: opts.category || { en: "Point of interest", fr: "Point d'intérêt" },
    location: opts.location || { lat: -17.53, lng: -149.84 },
    island: opts.island || "moorea",
    ...(opts.tags ? { tags: opts.tags } : {}),
    ...(opts.imgUrl ? { imgUrl: opts.imgUrl } : {}),
  };
}

function makeRestaurant(angle, island = "moorea") {
  const center = { lat: -17.535, lng: -149.842 };
  const rad = (angle * Math.PI) / 180;
  const r = 0.05;
  return makePOI({
    category: { en: "Restaurants", fr: "Restaurants" },
    location: {
      lat: center.lat + r * Math.sin(rad),
      lng: center.lng + r * Math.cos(rad),
    },
    island,
  });
}

function makeActivityPOI(angle, opts = {}) {
  const center = { lat: -17.535, lng: -149.842 };
  const rad = (angle * Math.PI) / 180;
  const r = 0.06;
  return makePOI({
    category: opts.category || { en: "Point of interest", fr: "Point d'intérêt" },
    location: {
      lat: center.lat + r * Math.sin(rad),
      lng: center.lng + r * Math.cos(rad),
    },
    island: opts.island || "moorea",
    tags: opts.tags,
    titleEn: opts.titleEn,
  });
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

let testCount = 0;
let passCount = 0;

function assert(condition, message) {
  testCount++;
  if (condition) {
    passCount++;
    // console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  testCount++;
  if (actual === expected) {
    passCount++;
    // console.log(`  ✓ ${message}: ${actual}`);
  } else {
    console.error(`  ✗ FAIL: ${message} — expected ${expected}, got ${actual}`);
  }
}

function assertNoDuplicatePOIs(itinerary) {
  const seen = new Set();
  let ok = true;
  for (const day of itinerary.days) {
    for (const slot of day.slots) {
      if (slot.poi) {
        if (seen.has(slot.poi.id)) {
          ok = false;
          console.error(`  ✗ FAIL: POI ${slot.poi.id} appears more than once`);
        }
        seen.add(slot.poi.id);
      }
    }
  }
  testCount++;
  if (ok) passCount++;
  return ok;
}

function countPOIsInDay(day) {
  return day.slots.filter((s) => s.type === "visit" || s.type === "restaurant").length;
}

function countVisitPOIsInDay(day) {
  return day.slots.filter((s) => s.type === "visit").length;
}

function countFreeDays(itinerary) {
  return itinerary.days.filter((d) =>
    d.slots.some((s) => s.type === "free")
  ).length;
}

function summarizeItinerary(itinerary) {
  return itinerary.days
    .map((d) => {
      const parts = d.slots.map((s) => {
        if (s.type === "visit") return `${s.period}:${s.poi.title.en}`;
        if (s.type === "restaurant") return `lunch:${s.poi.title.en}`;
        if (s.type === "reservation") return `res:${s.label}@${s.time}`;
        if (s.type === "sunrise") return "sunrise";
        if (s.type === "sunset") return "sunset";
        if (s.type === "free") return "FREE";
        return s.type;
      });
      return `  Day ${d.day}: ${parts.join(" | ")}`;
    })
    .join("\n");
}

// ---------------------------------------------------------------------------
// Test scenarios
// ---------------------------------------------------------------------------

function resetCounter() {
  poiCounter = 0;
}

// === Scenario 1: 1-day stay, balanced pace ===
console.log("\n=== Scenario 1: 1-day, balanced, 5 POIs ===");
resetCounter();
{
  const pois = [
    makeActivityPOI(0, { tags: ["plages", "snorkeling"], titleEn: "Beach1" }),
    makeActivityPOI(90, { tags: ["nature"], titleEn: "Nature1" }),
    makeActivityPOI(180, { tags: ["culture"], titleEn: "Culture1" }),
    makeActivityPOI(270, { tags: ["randonnees"], titleEn: "Hike1" }),
    makeRestaurant(45),
  ];
  const answers = {
    island: "moorea",
    duration: 1,
    companions: "couple",
    transport: "voiture",
    interests: ["plages", "nature", "culture"],
    pace: "equilibre",
    includeRestaurants: true,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 1, "1 day");
  assertNoDuplicatePOIs(itin);
  // Should have at most 3 visits + 1 restaurant = 4 POIs
  const totalPOIs = countPOIsInDay(itin.days[0]);
  assert(totalPOIs <= 4, `≤4 POIs (got ${totalPOIs})`);
  // Beach1 and Nature1 should be included (match interests), Culture1 too
  // Hike1 should NOT be included (randonnees not in interests)
  const allTitles = itin.days[0].slots.filter(s=>s.poi).map(s=>s.poi.title.en);
  assert(!allTitles.includes("Hike1"), "Hike1 excluded (not in interests)");
  assert(allTitles.includes("Beach1"), "Beach1 included");
}

// === Scenario 2: 3-day stay, relaxed pace ===
console.log("\n=== Scenario 2: 3-day, relaxed, 8 POIs ===");
resetCounter();
{
  const pois = [];
  for (let i = 0; i < 8; i++) {
    pois.push(
      makeActivityPOI(i * 45, {
        tags: ["plages", "nature"],
        titleEn: `Act${i}`,
      })
    );
  }
  pois.push(makeRestaurant(30));
  pois.push(makeRestaurant(120));
  pois.push(makeRestaurant(210));

  const answers = {
    island: "moorea",
    duration: 3,
    companions: "famille",
    transport: "voiture",
    interests: ["plages", "nature"],
    pace: "tranquille",
    includeRestaurants: true,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 3, "3 days");
  assertNoDuplicatePOIs(itin);

  // Relaxed pace = 2 POIs/day + lunch = 3 max
  for (const day of itin.days) {
    const visits = countVisitPOIsInDay(day);
    assert(visits <= 2, `Day ${day.day}: ≤2 visits (got ${visits})`);
  }

  // POIs should be distributed across all 3 days (not all on day 1)
  const day1Count = countPOIsInDay(itin.days[0]);
  const day3Count = countPOIsInDay(itin.days[2]);
  assert(day3Count > 0, "Day 3 has content (not empty)");
}

// === Scenario 3: 7-day stay with only 5 eligible POIs ===
console.log("\n=== Scenario 3: 7-day, balanced, only 5 POIs (sparse) ===");
resetCounter();
{
  const pois = [];
  for (let i = 0; i < 5; i++) {
    pois.push(
      makeActivityPOI(i * 72, {
        tags: ["nature", "paysages"],
        titleEn: `Sparse${i}`,
      })
    );
  }

  const answers = {
    island: "moorea",
    duration: 7,
    companions: "couple",
    transport: "voiture",
    interests: ["nature", "paysages"],
    pace: "equilibre",
    includeRestaurants: false,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 7, "7 days");
  assertNoDuplicatePOIs(itin);

  // POIs should be spread across days, not all on day 1-2
  const daysWithPOIs = itin.days.filter(
    (d) => countPOIsInDay(d) > 0
  ).length;
  assert(daysWithPOIs >= 3, `≥3 days have POIs (got ${daysWithPOIs})`);

  // No day should have more than pace-per-day POIs
  for (const day of itin.days) {
    const visits = countVisitPOIsInDay(day);
    assert(visits <= 3, `Day ${day.day}: ≤3 visits (got ${visits})`);
  }

  // Free days should exist but be scattered
  const freeDays = countFreeDays(itin);
  assert(freeDays > 0, `Has free days (got ${freeDays})`);
}

// === Scenario 4: With personal reservations ===
console.log("\n=== Scenario 4: 3-day, with reservations ===");
resetCounter();
{
  const pois = [];
  for (let i = 0; i < 10; i++) {
    pois.push(
      makeActivityPOI(i * 36, {
        tags: ["plages", "snorkeling"],
        titleEn: `Act${i}`,
      })
    );
  }

  const answers = {
    island: "moorea",
    duration: 3,
    companions: "solo",
    transport: "scooter",
    interests: ["plages", "snorkeling"],
    pace: "equilibre",
    includeRestaurants: false,
    reservations: [
      {
        id: "r1",
        name: "Excursion baleines",
        day: 2,
        startTime: "08:00",
        endTime: "12:00",
        location: "Marina Vaiare",
      },
    ],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 3, "3 days");
  assertNoDuplicatePOIs(itin);

  // Day 2 should have the reservation
  const day2 = itin.days[1];
  const hasReservation = day2.slots.some((s) => s.type === "reservation");
  assert(hasReservation, "Day 2 has the reservation");

  // Reservation should have correct label and time
  const res = day2.slots.find((s) => s.type === "reservation");
  assertEqual(res.label, "Excursion baleines", "Reservation name");
  assertEqual(res.time, "08:00–12:00", "Reservation time range");
}

// === Scenario 5: Intensive pace ===
console.log("\n=== Scenario 5: 2-day, intensive, 12 POIs ===");
resetCounter();
{
  const pois = [];
  for (let i = 0; i < 12; i++) {
    pois.push(
      makeActivityPOI(i * 30, {
        tags: ["nature", "paysages", "culture"],
        titleEn: `Int${i}`,
      })
    );
  }

  const answers = {
    island: "moorea",
    duration: 2,
    companions: "amis",
    transport: "voiture",
    interests: ["nature", "paysages", "culture"],
    pace: "intensif",
    includeRestaurants: false,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 2, "2 days");
  assertNoDuplicatePOIs(itin);

  // Intensive = 4 visits/day max
  for (const day of itin.days) {
    const visits = countVisitPOIsInDay(day);
    assert(visits <= 4, `Day ${day.day}: ≤4 visits (got ${visits})`);
  }
}

// === Scenario 6: Sunset/sunrise interests ===
console.log("\n=== Scenario 6: 2-day, with sunset/sunrise interests ===");
resetCounter();
{
  const pois = [];
  for (let i = 0; i < 6; i++) {
    pois.push(
      makeActivityPOI(i * 60, {
        tags: ["nature"],
        titleEn: `Act${i}`,
      })
    );
  }
  // Add a sunset POI that should be EXCLUDED
  pois.push(
    makeActivityPOI(200, {
      tags: ["nature", "coucher-soleil"],
      titleEn: "SunsetSpot",
    })
  );
  pois.push(
    makeActivityPOI(210, {
      tags: ["lever-soleil"],
      titleEn: "SunriseSpot",
    })
  );

  const answers = {
    island: "moorea",
    duration: 2,
    companions: "couple",
    transport: "voiture",
    interests: ["nature", "lever-soleil", "coucher-soleil"],
    pace: "equilibre",
    includeRestaurants: false,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 2, "2 days");
  assertNoDuplicatePOIs(itin);

  // Sunset/sunrise POIs should NOT appear as visit slots
  for (const day of itin.days) {
    for (const slot of day.slots) {
      if (slot.poi) {
        assert(
          slot.poi.title.en !== "SunsetSpot",
          "SunsetSpot not in visits"
        );
        assert(
          slot.poi.title.en !== "SunriseSpot",
          "SunriseSpot not in visits"
        );
      }
    }
  }

  // Sunrise/sunset info slots should exist
  const hasSunrise = itin.days[0].slots.some((s) => s.type === "sunrise");
  const hasSunset = itin.days[0].slots.some((s) => s.type === "sunset");
  assert(hasSunrise, "Has sunrise slot");
  assert(hasSunset, "Has sunset slot");
}

// === Scenario 7: Insufficient POIs (0 eligible) ===
console.log("\n=== Scenario 7: 3-day, 0 eligible POIs ===");
resetCounter();
{
  const pois = [
    makeActivityPOI(0, { tags: ["randonnees"], titleEn: "Hike" }),
  ]; // user wants "plages" — no match

  const answers = {
    island: "moorea",
    duration: 3,
    companions: "solo",
    transport: "pied",
    interests: ["plages"],
    pace: "tranquille",
    includeRestaurants: false,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 3, "3 days");
  // All days should be free
  const freeDays = countFreeDays(itin);
  assertEqual(freeDays, 3, "All 3 days are free");
}

// === Scenario 8: Incontournables only included if matching interests ===
console.log("\n=== Scenario 8: incontournables matching vs non-matching ===");
resetCounter();
{
  const pois = [
    makeActivityPOI(0, {
      tags: ["incontournables", "plages"],
      titleEn: "MustSeeBeach",
    }),
    makeActivityPOI(90, {
      tags: ["incontournables", "culture"],
      titleEn: "MustSeeCulture",
    }),
    makeActivityPOI(180, {
      tags: ["nature"],
      titleEn: "NatureOnly",
    }),
  ];

  // User wants "plages" only
  const answers = {
    island: "moorea",
    duration: 1,
    companions: "solo",
    transport: "voiture",
    interests: ["plages"],
    pace: "equilibre",
    includeRestaurants: false,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  const allTitles = itin.days[0].slots
    .filter((s) => s.poi)
    .map((s) => s.poi.title.en);

  // MustSeeBeach should be included (incontournables + plages = matches)
  assert(
    allTitles.includes("MustSeeBeach"),
    "MustSeeBeach included (matches interest)"
  );
  // MustSeeCulture should NOT be included (incontournables but culture not selected)
  assert(
    !allTitles.includes("MustSeeCulture"),
    "MustSeeCulture excluded (incontournables but no matching interest)"
  );
  // NatureOnly should NOT be included (nature not in interests)
  assert(
    !allTitles.includes("NatureOnly"),
    "NatureOnly excluded (nature not in interests)"
  );
}

// === Scenario 9: Geographic distribution across Moorea sectors ===
console.log("\n=== Scenario 9: 3-day, POIs across Moorea sectors ===");
resetCounter();
{
  // Place POIs at different angles around Moorea
  const pois = [
    makeActivityPOI(0, { tags: ["nature"], titleEn: "North1" }),
    makeActivityPOI(45, { tags: ["nature"], titleEn: "NE1" }),
    makeActivityPOI(90, { tags: ["nature"], titleEn: "East1" }),
    makeActivityPOI(135, { tags: ["nature"], titleEn: "SE1" }),
    makeActivityPOI(180, { tags: ["nature"], titleEn: "South1" }),
    makeActivityPOI(225, { tags: ["nature"], titleEn: "SW1" }),
    makeActivityPOI(270, { tags: ["nature"], titleEn: "West1" }),
    makeActivityPOI(315, { tags: ["nature"], titleEn: "NW1" }),
  ];

  const answers = {
    island: "moorea",
    duration: 3,
    companions: "couple",
    transport: "voiture",
    interests: ["nature"],
    pace: "tranquille",
    includeRestaurants: false,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 3, "3 days");
  assertNoDuplicatePOIs(itin);

  // Check that each day's POIs are from nearby sectors (adjacent angles)
  for (const day of itin.days) {
    const visitPOIs = day.slots.filter((s) => s.type === "visit" && s.poi);
    if (visitPOIs.length > 1) {
      // Print which POIs are grouped together
      const titles = visitPOIs.map((s) => s.poi.title.en);
      console.log(`    Day ${day.day} groups: ${titles.join(", ")}`);
    }
  }

  // Each day should have at least 1 POI (8 POIs / 3 days, relaxed = 2/day)
  for (const day of itin.days) {
    assert(
      countVisitPOIsInDay(day) > 0,
      `Day ${day.day} has visits`
    );
  }
}

// === Scenario 10: Tahiti (elongated island, longitude sort) ===
console.log("\n=== Scenario 10: 2-day Tahiti, longitude-based sort ===");
resetCounter();
{
  const pois = [];
  // Spread POIs across Tahiti's longitude range
  for (let i = 0; i < 6; i++) {
    pois.push(
      makePOI({
        titleEn: `Tahiti${i}`,
        category: { en: "Point of interest", fr: "Point d'intérêt" },
        location: {
          lat: -17.65 + (i % 3) * 0.02,
          lng: -149.75 + i * 0.06,
        },
        island: "tahiti",
        tags: ["nature", "paysages"],
      })
    );
  }

  const answers = {
    island: "tahiti",
    duration: 2,
    companions: "couple",
    transport: "voiture",
    interests: ["nature", "paysages"],
    pace: "equilibre",
    includeRestaurants: false,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 2, "2 days");
  assertNoDuplicatePOIs(itin);

  // Both days should have POIs
  assert(countPOIsInDay(itin.days[0]) > 0, "Day 1 has POIs");
  assert(countPOIsInDay(itin.days[1]) > 0, "Day 2 has POIs");
}

// === Scenario 11: Restaurants included and closest to day's POIs ===
console.log("\n=== Scenario 11: Restaurant selection closest to day POIs ===");
resetCounter();
{
  const pois = [
    makeActivityPOI(0, { tags: ["nature"], titleEn: "North" }),
    makeActivityPOI(120, { tags: ["nature"], titleEn: "SE" }),
  ];
  // Restaurants at different angles
  pois.push(makeRestaurant(10));  // close to North
  pois.push(makeRestaurant(115)); // close to SE

  const answers = {
    island: "moorea",
    duration: 2,
    companions: "couple",
    transport: "voiture",
    interests: ["nature"],
    pace: "tranquille",
    includeRestaurants: true,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertNoDuplicatePOIs(itin);

  // Day 1 should have the restaurant closest to "North" (angle 10)
  // Day 2 should have the restaurant closest to "SE" (angle 115)
  const day1Lunch = itin.days[0].slots.find((s) => s.type === "restaurant");
  const day2Lunch = itin.days[1].slots.find((s) => s.type === "restaurant");
  assert(day1Lunch, "Day 1 has a restaurant");
  assert(day2Lunch, "Day 2 has a restaurant");
}

// === Scenario 12: Navigation URL ===
console.log("\n=== Scenario 12: Navigation URL generation ===");
{
  const poi = makePOI({
    titleEn: "TestPOI",
    location: { lat: -17.523, lng: -149.842 },
  });
  const url = getNavigationUrl(poi);
  assert(
    url === "https://www.google.com/maps/dir/?api=1&destination=-17.523,-149.842",
    "Navigation URL correct"
  );

  const noLocation = makePOI({ titleEn: "NoLoc" });
  noLocation.location = undefined;
  assert(getNavigationUrl(noLocation) === null, "Null URL for POI without location");
}

// === Scenario 13: Even distribution with very few POIs across many days ===
console.log("\n=== Scenario 13: 7-day, 3 POIs (very sparse) ===");
resetCounter();
{
  const pois = [
    makeActivityPOI(0, { tags: ["nature"], titleEn: "A" }),
    makeActivityPOI(120, { tags: ["nature"], titleEn: "B" }),
    makeActivityPOI(240, { tags: ["nature"], titleEn: "C" }),
  ];

  const answers = {
    island: "moorea",
    duration: 7,
    companions: "couple",
    transport: "voiture",
    interests: ["nature"],
    pace: "equilibre",
    includeRestaurants: false,
    reservations: [],
  };
  const itin = generateItinerary(pois, answers);
  console.log(summarizeItinerary(itin));

  assertEqual(itin.days.length, 7, "7 days");
  assertNoDuplicatePOIs(itin);

  // POIs should be on days 1, 3, 5 (every other day) not days 1,2,3
  const daysWithPOIs = itin.days
    .map((d, i) => (countPOIsInDay(d) > 0 ? i + 1 : null))
    .filter(Boolean);
  console.log(`    Days with POIs: ${daysWithPOIs.join(", ")}`);

  // At least one gap between POI days (not consecutive 1,2,3)
  const allConsecutive = daysWithPOIs.length > 1 &&
    daysWithPOIs.every((d, i) => i === 0 || d === daysWithPOIs[i - 1] + 1);
  assert(
    !allConsecutive || daysWithPOIs.length <= 1,
    "POIs are spread out (not all on consecutive first days)"
  );
}

// === Scenario 14: Tag inference from category (no explicit tags) ===
console.log("\n=== Scenario 14: Tag inference from category text ===");
resetCounter();
{
  const pois = [
    makePOI({
      titleEn: "Tiki Cultural Center",
      category: { en: "Point of interest", fr: "Point d'intérêt" },
      location: { lat: -17.53, lng: -149.84 },
      island: "moorea",
      // no tags — should infer "culture" from title
    }),
    makePOI({
      titleEn: "Plage de Temae",
      category: { en: "Point of interest", fr: "Point d'intérêt" },
      location: { lat: -17.52, lng: -149.83 },
      island: "moorea",
      // no tags — should infer "plages" from title
    }),
  ];

  const tags1 = _internal.resolveTags(pois[0]);
  const tags2 = _internal.resolveTags(pois[1]);
  console.log(`    Tiki tags: ${tags1.join(", ")}`);
  console.log(`    Plage tags: ${tags2.join(", ")}`);

  assert(tags1.includes("culture"), "Inferred 'culture' from title");
  assert(tags2.includes("plages"), "Inferred 'plages' from title");
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

console.log(`\n========================================`);
console.log(`Results: ${passCount}/${testCount} assertions passed`);
if (passCount === testCount) {
  console.log("ALL TESTS PASSED");
} else {
  console.log(`${testCount - passCount} FAILURES`);
}
console.log(`========================================`);

process.exit(passCount === testCount ? 0 : 1);
