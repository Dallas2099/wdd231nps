import { getInfoLinks, getParkData } from "./parkService.mjs";
import setHeaderFooter from "./setHeaderFooter.mjs";
import { mediaCardTemplate } from "./templates.mjs";

function setParkIntro(data) {
  const introEl = document.querySelector(".intro");
  if (!introEl) return;

  introEl.innerHTML = `
    <div class="intro__content">
      <h1 class="intro__title">${data.fullName}</h1>
      <p class="intro__description">${data.description}</p>
    </div>
  `;
}

function setParkInfoLinks(data) {
  const infoEl = document.querySelector(".info");
  if (!infoEl) return;

  const cards = (Array.isArray(data) ? data : []).map(mediaCardTemplate).join("");

  infoEl.innerHTML = `
    <div class="info__content">
      <h2 class="info__heading">Visitor Information</h2>
      <div class="info__grid">
        ${cards}
      </div>
    </div>
  `;
}

async function init() {
  try {
    const parkData = await getParkData();
    const parkInfoLinks = getInfoLinks(parkData.images);

    setHeaderFooter(parkData);
    setParkIntro(parkData);
    setParkInfoLinks(parkInfoLinks);
  } catch (error) {
    console.error("Unable to initialize park data", error);
  }
}

init();
