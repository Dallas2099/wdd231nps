const baseUrl = "https://developer.nps.gov/api/v1/";
const apiKey = import.meta.env.VITE_NPS_API_KEY;
const defaultParkCode = "yell";

const infoLinkConfig = [
  {
    name: "Current Conditions &#x203A;",
    link: "conditions.html",
    description:
      "See what conditions to expect in the park before leaving on your trip!",
    imageIndex: 2
  },
  {
    name: "Fees and Passes &#x203A;",
    link: "fees.html",
    description: "Learn about the fees and passes that are available.",
    imageIndex: 3
  },
  {
    name: "Visitor Centers &#x203A;",
    link: "visitor_centers.html",
    description: "Learn about the visitor centers in the park.",
    imageIndex: 9
  }
];

function sanitizeName(name = "") {
  return name.replace(/&#x203A;/gi, "").trim();
}

async function getJson(url) {
  if (!apiKey) {
    throw new Error("Missing NPS API key. Add VITE_NPS_API_KEY to your .env file.");
  }

  const options = {
    method: "GET",
    headers: {
      "X-Api-Key": apiKey
    }
  };

  let data = {};
  const response = await fetch(baseUrl + url, options);
  if (response.ok) {
    data = await response.json();
  } else {
    throw new Error("response not ok");
  }

  return data;
}

export async function getParkData(parkCode = defaultParkCode) {
  const parkData = await getJson(`parks?parkCode=${parkCode}`);
  const [firstPark] = parkData.data || [];

  if (!firstPark) {
    throw new Error("Park data is unavailable.");
  }

  return firstPark;
}

export function getInfoLinks(images = []) {
  return infoLinkConfig.map((item) => {
    const image = images[item.imageIndex] || {};

    return {
      ...item,
      image: image.url || "",
      alt: image.altText || image.title || sanitizeName(item.name)
    };
  });
}

export { baseUrl, getJson };
