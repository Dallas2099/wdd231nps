import { footerTemplate, parkInfoTemplate } from "./templates.mjs";

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

function formatStates(states = "") {
  return states
    .split(",")
    .map((stateCode) => stateCode.trim())
    .filter(Boolean);
}

function extractCreditName(credit = "") {
  const parts = credit.split("/");
  return parts.length ? parts[parts.length - 1] : credit;
}

function setHeaderInfo(data) {
  const disclaimer = document.querySelector(".disclaimer > a");
  if (disclaimer) {
    disclaimer.href = data.url;
    disclaimer.textContent = data.fullName;
  }

  const title = document.querySelector("head > title");
  if (title) {
    title.textContent = data.fullName;
  }

  const bannerImage = document.querySelector(".hero-banner > img");
  const heroContent = document.querySelector(".hero-banner__content");
  const heroCredit = document.querySelector(".hero-banner__credit");
  const firstImage = data.images?.[0];

  if (bannerImage && firstImage) {
    bannerImage.src = firstImage.url;
    bannerImage.alt = firstImage.altText || firstImage.title || data.fullName;
  }

  if (heroCredit && firstImage) {
    heroCredit.textContent = extractCreditName(firstImage.credit);
  }

  if (heroContent) {
    const states = formatStates(data.states);
    const [primaryState] = states;
    const stateName = stateNameMap[primaryState] || primaryState || "";
    const stateUrl = primaryState
      ? `https://www.nps.gov/state/${primaryState.toLowerCase()}/index.htm`
      : "https://www.nps.gov/index.htm";

    heroContent.innerHTML = parkInfoTemplate({
      breadcrumbStateCode: primaryState,
      breadcrumbStateName: stateName,
      breadcrumbStateUrl: stateUrl,
      designation: data.designation,
      headingText: data.name,
      parkUrl: data.url,
      statesList: states.join(", ")
    });
  }
}

function setFooterInfo(data) {
  const footer = document.querySelector("#park-footer");
  if (footer) {
    footer.innerHTML = footerTemplate(data);
  }
}

export default function setHeaderFooter(data) {
  setHeaderInfo(data);
  setFooterInfo(data);
}

export { setFooterInfo, setHeaderInfo };
