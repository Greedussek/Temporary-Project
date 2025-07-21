
import { pb } from './api.js';

export async function handleBuildingClick(building, villageId) {
  const all = await pb.collection("villagebuildings").getFullList();
  
  const existingBuilding = all.find(item => {
    const vMatch = Array.isArray(item.village) ? item.village.includes(villageId) : item.village === villageId;
    const bMatch = Array.isArray(item.building) ? item.building.includes(building.id) : item.building === building.id;
    return vMatch && bMatch;
  });

  if (existingBuilding) {
    return await pb.collection("villagebuildings").update(existingBuilding.id, {
      level: (existingBuilding.level || 1) + 1,
    });
  } else {
    return await pb.collection("villagebuildings").create({
      building: building.id,
      village: villageId,
      level: 1,
    });
  }
}

export async function loadBuildings(villageId) {
  const buildings = await pb.collection('buildings').getFullList({ sort: 'name' });

  const all = await pb.collection("villagebuildings").getFullList();
 

  const list = document.getElementById("buildingList");
  list.innerHTML = "";

  buildings.forEach(building => {
    // ✅ znajdź poziom budynku dla danej wioski
    const villageBuilding = all.find(item => {
      const vMatch = Array.isArray(item.village)
        ? item.village.includes(villageId)
        : item.village === villageId;

      const bMatch = Array.isArray(item.building)
        ? item.building.includes(building.id)
        : item.building === building.id;

      return vMatch && bMatch;
    });

    const level = villageBuilding?.level || 0;
    const li = document.createElement("li");
    li.textContent = `${building.name} (poziom ${level})`;
    li.style.cursor = "pointer";

    li.addEventListener("click", async () => {
      await handleBuildingClick(building, villageId);
      await loadBuildings(villageId);  
    });

    list.appendChild(li);
  });
}

