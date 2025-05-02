import CONFIG from "../config/config.js";

export const createMap = (elementId, options = {}) => {
  const map = L.map(elementId, {
    scrollWheelZoom: true,
    ...options,
  });

  L.tileLayer(CONFIG.DEFAULT_MAP_TILE, {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  return map;
};

export const addMarker = (map, lat, lon, options = {}) => {
  return L.marker([lat, lon], options).addTo(map);
};

export const createPopupContent = (story) => {
  return `
    <div class="map-popup">
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <a href="#/story/${story.id}">Lihat Detail</a>
    </div>
  `;
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

export const setupMapAccessibility = (mapElement) => {
  if (!mapElement) return;

  // Add ARIA labels
  mapElement.setAttribute("role", "application");
  mapElement.setAttribute("aria-label", "Interactive map");

  // Add keyboard navigation instructions
  const instructions = document.createElement("p");
  instructions.className = "sr-only";
  instructions.textContent = "Use arrow keys to pan map, +/- to zoom";
  mapElement.parentNode.insertBefore(instructions, mapElement);

  // Add keyboard handlers for basic map navigation
  mapElement.addEventListener("keydown", (e) => {
    const map = mapElement._leaflet_map;
    if (!map) return;

    switch (e.key) {
      case "ArrowUp":
        map.panBy([0, -50]);
        break;
      case "ArrowDown":
        map.panBy([0, 50]);
        break;
      case "ArrowLeft":
        map.panBy([-50, 0]);
        break;
      case "ArrowRight":
        map.panBy([50, 0]);
        break;
      case "+":
        map.zoomIn();
        break;
      case "-":
        map.zoomOut();
        break;
    }
  });
};
