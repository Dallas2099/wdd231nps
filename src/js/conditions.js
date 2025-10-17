import "../css/style.css";
import "../css/conditions.css";
import { getAlertsData, getParkData, getVisitorCenterData } from "./parkService.mjs";
import setHeaderFooter from "./setHeaderFooter.mjs";
import {
  alertTemplate,
  activityTemplate,
  visitorCenterTemplate
} from "./templates.mjs";

function setAlerts(alerts = []) {
  const list = document.querySelector('[data-element="alerts-list"]');
  if (!list) return;

  if (!alerts.length) {
    list.innerHTML = `<li class="alerts__empty">No current alerts.</li>`;
    return;
  }

  list.innerHTML = alerts.map(alertTemplate).join("");
}

function setVisitorCenters(centers = []) {
  const container = document.querySelector('[data-element="visitor-centers"]');
  if (!container) return;

  if (!centers.length) {
    container.innerHTML = `<p class="visitor-services__empty">No visitor services currently available.</p>`;
    return;
  }

  container.innerHTML = centers.map(visitorCenterTemplate).join("");
}

function setActivities(activities = []) {
  const container = document.querySelector('[data-element="activities"]');
  if (!container) return;

  if (!activities.length) {
    container.innerHTML = `<p class="activities__empty">Activities information is not available right now.</p>`;
    return;
  }

  const activityDetails = activities
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(activityTemplate)
    .join("");

  container.innerHTML = activityDetails;
}

async function init() {
  try {
    const parkData = await getParkData();
    const parkCode = parkData?.parkCode;

    setHeaderFooter(parkData);
    setActivities(parkData?.activities || []);

    if (!parkCode) {
      console.warn("Park code unavailable; alerts and visitor services cannot be loaded.");
      setAlerts([]);
      setVisitorCenters([]);
      return;
    }

    const [alertsResponse, visitorCentersResponse] = await Promise.all([
      getAlertsData(parkCode),
      getVisitorCenterData(parkCode)
    ]);

    setAlerts(alertsResponse);
    setVisitorCenters(visitorCentersResponse);
  } catch (error) {
    console.error("Unable to initialize conditions page", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
