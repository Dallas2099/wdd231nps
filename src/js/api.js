import { getJson } from "./parkService.mjs";

const outputList = document.querySelector("#outputList");

function listTemplate(park) {
  const parkName = park.fullName || park.name || "Unnamed park";
  const stateList = park.states ? park.states.split(",").map((state) => state.trim()).join(", ") : "Unknown state";
  const parkUrl = park.url || "#";

  return `
    <li>
      <a href="${parkUrl}" target="_blank" rel="noopener noreferrer">${parkName}</a>
      <span> — ${stateList}</span>
    </li>
  `;
}

async function renderClimbingList() {
  if (!outputList) return;

  try {
    const response = await getJson("activities/parks?q=climbing");
    const activities = Array.isArray(response?.data) ? response.data : [];
    const climbingActivity = activities.find((activity) =>
      (activity.name || "").toLowerCase().includes("climbing")
    );
    const parks = Array.isArray(climbingActivity?.parks) ? climbingActivity.parks : [];

    if (!parks.length) {
      outputList.innerHTML = "<li>No parks offering climbing were found.</li>";
      return;
    }

    outputList.innerHTML = parks.map(listTemplate).join("");
  } catch (error) {
    console.error("Unable to render climbing list.", error);
    outputList.innerHTML = "<li>We could not load the climbing parks right now.</li>";
  }
}

renderClimbingList();
