import { getParkData } from "./parkService.mjs";

const stateNameMap = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming"
};

function formatStates(states) {
  return states
    .split(",")
    .map((stateCode) => stateCode.trim())
    .filter(Boolean);
}

function extractCreditName(credit = "") {
  const parts = credit.split("/");
  return parts.length ? parts[parts.length - 1] : credit;
}

document.addEventListener("DOMContentLoaded", () => {
  const parkData = getParkData();

  document.title = parkData.fullName;

  const disclaimerLink = document.querySelector('[data-element="park-link"]');
  if (disclaimerLink) {
    disclaimerLink.textContent = parkData.fullName;
    disclaimerLink.href = parkData.url;
  }

  const heroTitle = document.querySelector('[data-element="hero-title"]');
  if (heroTitle) {
    heroTitle.textContent = parkData.name;
    heroTitle.href = parkData.url;
  }

  const heroDesignation = document.querySelector(
    '[data-element="hero-designation"]'
  );
  if (heroDesignation) {
    heroDesignation.textContent = parkData.designation;
  }

  const heroStates = document.querySelector('[data-element="hero-states"]');
  if (heroStates) {
    heroStates.textContent = formatStates(parkData.states).join(", ");
  }

  const heroImage = document.querySelector('[data-element="hero-image"]');
  const firstImage = parkData.images?.[0];
  if (heroImage && firstImage) {
    heroImage.src = firstImage.url;
    heroImage.alt = firstImage.altText || firstImage.title || parkData.fullName;
  }

  const heroCredit = document.querySelector('[data-element="hero-credit"]');
  if (heroCredit && firstImage) {
    heroCredit.textContent = extractCreditName(firstImage.credit);
  }

  const breadcrumbPark = document.querySelector('[data-element="park-name"]');
  if (breadcrumbPark) {
    breadcrumbPark.textContent = parkData.name;
  }

  const stateLink = document.querySelector('[data-element="state-link"]');
  const [primaryState] = formatStates(parkData.states);
  if (stateLink && primaryState) {
    const stateName = stateNameMap[primaryState] || primaryState;
    stateLink.textContent = stateName;
    stateLink.href = `https://www.nps.gov/state/${primaryState.toLowerCase()}/index.htm`;
    stateLink.dataset.state = primaryState;
  }
});
