// src/scripts/pages/home/home-page.js
import HomePresenter from "../presenters/home-presenter.js";
import NavigationHelper from "../utils/navigation-helper.js";
import { setupMapAccessibility } from "../utils/accessibility.js";
import CONFIG from "../config/config.js";

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter(this);
    this.map = null;
    this.markers = [];
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
          <h1>Story Map</h1>
          <a href="#/add-story" class="btn-primary">
            <i class="fas fa-plus"></i> Tambah Story
          </a>
        </div>

        <div class="map-section">
          <div id="main-map" class="main-map-container"></div>
        </div>

        <h2 class="stories-title">Daftar Story</h2>
        <div id="story-list" class="story-grid"></div>
      </section>
    `;
  }

  async afterRender() {
    NavigationHelper.setupAuthenticatedNavigation();
    this._initMainMap();
    this.presenter.loadStories();
  }

  _initMainMap() {
    const mapElement = document.getElementById("main-map");
    if (!mapElement) return;

    try {
      this.map = L.map("main-map").setView(
        [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng],
        CONFIG.DEFAULT_LOCATION.zoom
      );

      L.tileLayer(CONFIG.DEFAULT_MAP_TILE, {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map);

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.map.setView([latitude, longitude], 13);
          },
          (error) => console.log("Geolocation error:", error)
        );
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }

  _clearMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }

  _addStoryMarkers(stories) {
    this._clearMarkers();

    const markersGroup = L.featureGroup();

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const popupContent = `
          <div class="map-popup">
            <h3>${story.name}</h3>
            <img src="${story.photoUrl}" 
                 alt="Story photo" 
                 style="width:200px;max-height:150px;object-fit:cover;margin:8px 0;">
            <p>${story.description.substring(0, 100)}${
          story.description.length > 100 ? "..." : ""
        }</p>
            <a href="#/story/${story.id}" class="btn-primary">
              <i class="fas fa-angle-right"></i> Lihat Detail
            </a>
          </div>
        `;

        const marker = L.marker([story.lat, story.lon])
          .bindPopup(popupContent, {
            maxWidth: 300,
            maxHeight: 300,
            className: "story-popup",
          })
          .addTo(this.map);

        this.markers.push(marker);
        markersGroup.addLayer(marker);
      }
    });

    if (markersGroup.getLayers().length > 0) {
      this.map.fitBounds(markersGroup.getBounds().pad(0.1));
    }
  }

  displayStories(stories) {
    // Update markers on map
    this._addStoryMarkers(stories);

    // Update story list
    const container = document.getElementById("story-list");
    if (!container) return;

    container.innerHTML = stories
      .map(
        (story) => `
        <div class="story-item">
          <img src="${story.photoUrl}" 
               alt="Foto oleh ${story.name}: ${story.description}"
               loading="lazy">
          <div class="story-content">
            <h2>${story.name}</h2>
            <p class="story-description">${story.description}</p>
            <p class="created-at">
              <i class="fas fa-calendar"></i> ${this.formatDate(
                story.createdAt
              )}
            </p>
            <a href="#/story/${story.id}" class="btn-primary">Lihat Detail</a>
          </div>
        </div>
      `
      )
      .join("");
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
}
