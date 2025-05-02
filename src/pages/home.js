import HomePresenter from "../presenters/home-presenter";
import NavigationHelper from "../utils/navigation-helper";
import CONFIG from "../config/config";

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter(this);
    this.maps = new Map(); // Store map instances
  }

  async render() {
    const userName = localStorage.getItem("userName");

    return `
      <section class="container" id="main-content">
        <div class="welcome-user">
          <h2><i class="fas fa-user"></i> Selamat datang, ${
            userName || "User"
          }!</h2>
        </div>
        
        <div class="stories-header">
          <h1>Daftar Story</h1>
          <a href="#/add-story" class="add-story-button">
            <i class="fas fa-plus"></i> Tambah Story
          </a>
        </div>

        <div class="map-toggle">
          <button id="toggle-map-view" class="toggle-map-button">
            <i class="fas fa-map"></i> Toggle Peta Utama
          </button>
        </div>
        
        <div id="main-map" class="main-map" style="display: none;"></div>
        <div id="story-list" class="story-grid"></div>
        
        <div id="loading" class="loading-indicator" style="display: none;">
          <i class="fas fa-spinner fa-spin"></i> Memuat stories...
        </div>
      </section>
    `;
  }

  async afterRender() {
    NavigationHelper.setupAuthenticatedNavigation();
    this._initMainMap();
    this._initMapToggle();
    this.presenter.loadStories();
  }

  _initMainMap() {
    const mapElement = document.getElementById("main-map");
    if (!mapElement) return;

    try {
      const mainMap = L.map("main-map").setView(
        [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng],
        CONFIG.DEFAULT_LOCATION.zoom
      );

      L.tileLayer(CONFIG.DEFAULT_MAP_TILE, {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mainMap);

      this.mainMap = mainMap;
    } catch (error) {
      console.error("Error initializing main map:", error);
    }
  }

  _initMapToggle() {
    const toggleButton = document.getElementById("toggle-map-view");
    const mapElement = document.getElementById("main-map");

    if (toggleButton && mapElement) {
      toggleButton.addEventListener("click", () => {
        const isMapVisible = mapElement.style.display !== "none";
        mapElement.style.display = isMapVisible ? "none" : "block";
        toggleButton.innerHTML = isMapVisible
          ? '<i class="fas fa-map"></i> Tampilkan Peta'
          : '<i class="fas fa-list"></i> Tampilkan List';

        if (!isMapVisible) {
          this.mainMap.invalidateSize();
          this._fitMapToMarkers(this.mainMap);
        }
      });
    }
  }

  _fitMapToMarkers(map) {
    if (!map || !this.currentMarkers || this.currentMarkers.length === 0)
      return;

    const group = L.featureGroup(this.currentMarkers);
    map.fitBounds(group.getBounds().pad(0.1));
  }

  displayStories(stories) {
    const container = document.getElementById("story-list");
    if (!container) return;

    container.innerHTML = stories
      .map(
        (story) => `
      <div class="story-item">
        <div class="story-header">
          <h2>${story.name}</h2>
          <span class="story-date">
            <i class="fas fa-calendar"></i> 
            ${new Date(story.createdAt).toLocaleDateString(
              CONFIG.DEFAULT_LANGUAGE
            )}
          </span>
        </div>

        <div class="story-image">
          <img src="${story.photoUrl}" 
               alt="Foto oleh ${story.name}: ${story.description}"
               loading="lazy">
        </div>

        <div class="story-content">
          <p class="story-description">${story.description}</p>
          
          ${
            story.lat && story.lon
              ? `<div class="mini-map" 
                     data-lat="${story.lat}" 
                     data-lon="${story.lon}"
                     data-id="${story.id}"></div>`
              : ""
          }
          
          <a href="#/story/${story.id}" class="view-detail">
            <i class="fas fa-angle-right"></i> Lihat Detail
          </a>
        </div>
      </div>
    `
      )
      .join("");

    this._initializeMiniMaps(stories);
    this._updateMainMapMarkers(stories);
  }

  _initializeMiniMaps(stories) {
    document.querySelectorAll(".mini-map").forEach((mapEl) => {
      const { lat, lon, id } = mapEl.dataset;
      if (!lat || !lon) return;

      const story = stories.find((s) => s.id === id);
      if (!story) return;

      try {
        const miniMap = L.map(mapEl, {
          zoomControl: false,
          attributionControl: false,
        }).setView([lat, lon], 13);

        L.tileLayer(CONFIG.DEFAULT_MAP_TILE).addTo(miniMap);
        L.marker([lat, lon])
          .addTo(miniMap)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);

        this.maps.set(id, miniMap);
      } catch (error) {
        console.error(`Error initializing mini map for story ${id}:`, error);
      }
    });
  }

  _updateMainMapMarkers(stories) {
    if (!this.mainMap) return;

    // Clear existing markers
    if (this.currentMarkers) {
      this.currentMarkers.forEach((marker) => marker.remove());
    }

    this.currentMarkers = stories
      .filter((story) => story.lat && story.lon)
      .map((story) => {
        const popupContent = `
          <div class="map-popup">
            <h3>${story.name}</h3>
            <img src="${story.photoUrl}" 
                 alt="Story photo" 
                 style="width:200px;max-height:150px;object-fit:cover;margin:8px 0;">
            <p>${story.description.substring(0, 100)}${
          story.description.length > 100 ? "..." : ""
        }</p>
            <a href="#/story/${
              story.id
            }" class="btn-primary" style="display:inline-block;margin-top:8px;">
              <i class="fas fa-angle-right"></i> Lihat Detail
            </a>
          </div>
        `;

        const marker = L.marker([story.lat, story.lon])
          .addTo(this.mainMap)
          .bindPopup(popupContent, {
            maxWidth: 300,
            maxHeight: 300,
            className: "story-popup",
          });

        // Event listener untuk marker
        marker.on("click", () => {
          marker.openPopup();
        });

        return marker;
      });

    if (this.currentMarkers.length > 0) {
      this._fitMapToMarkers(this.mainMap);
    }
  }

  showEmptyState() {
    const container = document.getElementById("story-list");
    if (!container) return;

    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-scroll fa-3x"></i>
        <h3>Belum ada story</h3>
        <p>Jadilah yang pertama menambahkan story!</p>
        <a href="#/add-story" class="btn-primary">
          <i class="fas fa-plus"></i> Tambah Story Baru
        </a>
      </div>
    `;
  }

  showError(message) {
    const container = document.getElementById("story-list");
    if (!container) return;

    container.innerHTML = `<div class="error-message">⛔ ${message}</div>`;
  }

  showLoading(show = true) {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.display = show ? "flex" : "none";
    }
  }
}
