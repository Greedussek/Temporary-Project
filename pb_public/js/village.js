
import { pb } from './api.js';
import { loadBuildings } from './buildings.js';

export async function createVillage() {
  return await pb.collection('village').create({});
}

export async function loadVillages(listElement, showResourcesCallback) {
  const userId = pb.authStore.model.id;
  const villages = await pb.collection('village').getFullList({
    filter: `user = "${userId}"`,
    sort: '-created',
  });

  listElement.innerHTML = "";

  if (villages.length === 0) {
    listElement.innerHTML = "<li>Brak wiosek</li>";
    return;
  }

  villages.forEach(village => {
    const li = document.createElement("li");
    li.textContent = village.name;
    li.setAttribute("data-id", village.id);
    li.style.cursor = "pointer";
    li.addEventListener("click", () => showResourcesCallback(village.id));
    listElement.appendChild(li);
  });
}

export async function showResourcesForVillage(villageId) {
  const resources = await pb.collection('resources').getFirstListItem(`village = "${villageId}"`);
  document.getElementById("wood").textContent = resources.wood;
  document.getElementById("stone").textContent = resources.stone;
  document.getElementById("gold").textContent = resources.gold;
  document.getElementById("steel").textContent = resources.steel;

  document.getElementById("villageList").classList.add("hidden");
  await loadBuildings(villageId);
}
