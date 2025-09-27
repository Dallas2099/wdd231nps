function sanitize(text) {
  return text ?? "";
}

function normalizeArrow(text = "") {
  return text.replace(/&#x203A;/gi, "").trim();
}

export function parkInfoTemplate({
  breadcrumbStateCode,
  breadcrumbStateName,
  breadcrumbStateUrl,
  designation,
  headingText,
  parkUrl,
  statesList
}) {
  const stateCode = sanitize(breadcrumbStateCode).toUpperCase();
  const stateName = sanitize(breadcrumbStateName);
  const stateUrl = sanitize(breadcrumbStateUrl);
  const title = sanitize(headingText);
  const designationText = sanitize(designation);
  const statesText = sanitize(statesList);
  const parkLink = sanitize(parkUrl);

  return `
    <nav class="hero-banner__breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="https://www.nps.gov/index.htm">NPS.gov</a></li>
        <li>
          <a href="${stateUrl}" data-state="${stateCode}">${stateName}</a>
        </li>
        <li aria-current="page">${title}</li>
      </ol>
    </nav>
    <div class="hero-banner__heading">
      <a href="${parkLink}" class="hero-banner__title">${title}</a>
      <p class="hero-banner__subtitle">
        <span>${designationText}</span>
        <span>${statesText}</span>
      </p>
    </div>
  `;
}

export function mediaCardTemplate({
  alt,
  description,
  image,
  link,
  name
}) {
  const safeLink = sanitize(link);
  const safeImage = sanitize(image);
  const safeAlt = sanitize(alt) || normalizeArrow(sanitize(name));
  const safeName = sanitize(name);
  const safeDescription = sanitize(description);

  return `
    <article class="media-card">
      <a class="media-card__image" href="${safeLink}">
        <img src="${safeImage}" alt="${safeAlt}" loading="lazy" />
      </a>
      <div class="media-card__body">
        <h3 class="media-card__title">
          <a href="${safeLink}">${safeName}</a>
        </h3>
        <p>${safeDescription}</p>
      </div>
    </article>
  `;
}

function getMailingAddress(addresses = []) {
  return addresses.find((address) => address.type === "Mailing");
}

function getVoicePhone(phoneNumbers = []) {
  const voice = phoneNumbers.find((phone) => phone.type === "Voice");
  return voice?.phoneNumber || "";
}

export function footerTemplate(info) {
  const mailing = getMailingAddress(info?.addresses) || {};
  const voice = getVoicePhone(info?.contacts?.phoneNumbers);

  const mailingLine1 = sanitize(mailing.line1);
  const mailingLine2 = sanitize(mailing.line2);
  const city = sanitize(mailing.city);
  const state = sanitize(mailing.stateCode);
  const postal = sanitize(mailing.postalCode);

  return `
    <section class="park-footer__inner" aria-label="Park contact information">
      <h2 class="park-footer__heading">Contact Info</h2>
      <div class="park-footer__content">
        <div class="park-footer__block">
          <h3 class="park-footer__title">Mailing Address</h3>
          <address class="park-footer__address">
            <p>${mailingLine1}</p>
            ${mailingLine2 ? `<p>${mailingLine2}</p>` : ""}
            <p>${city}${city && state ? "," : ""} ${state} ${postal}</p>
          </address>
        </div>
        <div class="park-footer__block">
          <h3 class="park-footer__title">Phone</h3>
          <p class="park-footer__phone">${voice}</p>
        </div>
      </div>
    </section>
  `;
}
