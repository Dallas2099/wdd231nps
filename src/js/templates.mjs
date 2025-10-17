import spritePath from "../images/sprite.symbol.svg";

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

function formatDateToReadable(dateString = "") {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function normalizeAlertType(category = "") {
  if (!category) return "information";

  switch (category) {
    case "Park Closure":
      return "closure";
    default:
      return category.toLowerCase().replace(/\s+/g, "-");
  }
}

export function alertTemplate(alert) {
  const type = normalizeAlertType(alert?.category);
  const title = sanitize(alert?.title);
  const description = sanitize(alert?.description);
  const lastIndexedDate = formatDateToReadable(alert?.lastIndexedDate);

  return `
    <li class="alert">
      <svg class="icon alert__icon" focusable="false" aria-hidden="true">
        <use xlink:href="${spritePath}#alert-${type}"></use>
      </svg>
      <div class="alert__content">
        <h3 class="alert__title alert-${type}">${title}</h3>
        ${description ? `<p class="alert__description">${description}</p>` : ""}
        ${
          lastIndexedDate
            ? `<p class="alert__date">Updated ${lastIndexedDate}</p>`
            : ""
        }
      </div>
    </li>
  `;
}

function getVisitorCenterStatus(status) {
  const statusText = sanitize(status?.status) || "Status Unknown";
  const modifier = statusText.toLowerCase().replace(/\s+/g, "-") || "unknown";
  const message = sanitize(status?.message);

  return { statusText, modifier, message };
}

function getSeasonText(operatingHours = []) {
  const [first] = operatingHours || [];
  if (!first) {
    return "Seasonal dates vary";
  }

  const seasonalException =
    first.exceptions?.find((item) =>
      item?.name?.toLowerCase().includes("season")
    ) || first.exceptions?.[0];

  if (seasonalException?.startDate && seasonalException?.endDate) {
    const start = formatDateToReadable(seasonalException.startDate);
    const end = formatDateToReadable(seasonalException.endDate);
    return `${start} – ${end}`;
  }

  if (first?.description) {
    return first.description;
  }

  return "Open year-round";
}

function formatStandardHours(hours = {}) {
  const entries = Object.entries(hours)
    .filter(([, value]) => Boolean(value))
    .map(([day, value]) => {
      const label = day.charAt(0).toUpperCase() + day.slice(1);
      return `<li><span>${label}</span><span>${value}</span></li>`;
    });

  if (!entries.length) return "";

  return `<ul class="hours-list">${entries.join("")}</ul>`;
}

export function visitorCenterTemplate(center) {
  const name = sanitize(center?.name);
  const description = sanitize(center?.description);
  const directions = sanitize(center?.directionsInfo);
  const { statusText, modifier, message } = getVisitorCenterStatus(center?.operatingStatus);
  const seasonText = getSeasonText(center?.operatingHours);
  const standardHours = center?.operatingHours?.[0]?.standardHours || {};
  const hoursList = formatStandardHours(standardHours);

  return `
    <details class="accordion" name="visitor-centers">
      <summary class="accordion__summary">
        <span class="accordion__title">${name}</span>
        <span class="status-pill status-pill--${modifier}">${statusText}</span>
      </summary>
      <div class="accordion__body">
        <p class="accordion__season">${seasonText}</p>
        ${message ? `<p class="accordion__message">${message}</p>` : ""}
        ${description ? `<p class="accordion__description">${description}</p>` : ""}
        ${directions ? `<p class="accordion__directions">${directions}</p>` : ""}
        ${
          hoursList
            ? `<div class="accordion__hours"><h4>Standard Hours</h4>${hoursList}</div>`
            : ""
        }
      </div>
    </details>
  `;
}

export function activityTemplate(activity) {
  const name = sanitize(activity?.name);
  const url = sanitize(activity?.url);
  const displayName = name || "Activity";
  const lowerName = name ? name.toLowerCase() : "this activity";
  const learnMoreUrl =
    url || `https://www.nps.gov/search/?s=All&q=${encodeURIComponent(displayName)}`;

  return `
    <details class="accordion" name="activities">
      <summary class="accordion__summary">
        <span class="accordion__title">${displayName}</span>
      </summary>
      <div class="accordion__body">
        <p class="accordion__description">
          Discover opportunities for ${lowerName}. Learn more on the
          <a href="${learnMoreUrl}">National Park Service website</a>.
        </p>
      </div>
    </details>
  `;
}
