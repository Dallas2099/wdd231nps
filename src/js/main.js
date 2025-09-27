import { getParkData, parkInfoLinks } from "./parkService.mjs";
import setHeaderFooter from "./setHeaderFooter.mjs";
import { mediaCardTemplate } from "./templates.mjs";

const parkData = getParkData();

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

  const cards = data.map(mediaCardTemplate).join("");

  infoEl.innerHTML = `
    <div class="info__content">
      <h2 class="info__heading">Visitor Information</h2>
      <div class="info__grid">
        ${cards}
      </div>
    </div>
  `;
}

setHeaderFooter(parkData);
setParkIntro(parkData);
setParkInfoLinks(parkInfoLinks);
