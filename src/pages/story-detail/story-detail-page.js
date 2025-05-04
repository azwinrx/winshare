import StoryDetailPresenter from "./story-detail-presenter.js";
import { parseActivePathname } from "../../routes/url-parser.js";
import NavigationHelper from "../../utils/navigation-helper.js";

export default class StoryDetailPage {
  constructor() {
    this.presenter = new StoryDetailPresenter(this);
    this.map = null;
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

  async render() {
    return `
      <section class="container error-section" id="main-content">
        <div class="loading-indicator">
          <i class="fas fa-spinner fa-spin"></i>
          Loading...
        </div>
      </section>
    `;
  }

  async afterRender() {
    NavigationHelper.setupAuthenticatedNavigation();
    const { id } = parseActivePathname();
    await this.presenter.loadStoryDetail(id);
  }

  displayStory(story) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
      <section class="story-detail-page">
        <div class="story-detail-container">
          <div class="story-header-section">
            <div class="user-info">
              <h1>${story.name}'s Story</h1>
              <div class="meta-info">
                <span class="date">
                  <i class="fas fa-calendar"></i>
                  ${this.formatDate(story.createdAt)}
                </span>
                <span class="location">
                  <i class="fas fa-map-marker-alt"></i>
                  ${
                    story.lat && story.lon
                      ? `Lokasi: ${story.lat.toFixed(6)}, ${story.lon.toFixed(
                          6
                        )}`
                      : "Lokasi tidak tersedia"
                  }
                </span>
              </div>
            </div>
            <a href="#/" class="back-button">
              <i class="fas fa-arrow-left"></i> Kembali
            </a>
          </div>
          
          <div class="story-content">
            <div class="media-section">
              <div class="image-container">
                <img src="${story.photoUrl}" 
                     alt="Foto story oleh ${story.name}" 
                     class="story-image">
              </div>
              <div class="description-section">
                <h2><i class="fas fa-quote-left"></i> Deskripsi Story</h2>
                <div class="description-card">
                  <p>${story.description}</p>
                </div>
              </div>
              ${
                story.lat && story.lon
                  ? `
                <div class="map-container">
                  <h2><i class="fas fa-map-marked-alt"></i> Lokasi Story</h2>
                  <div id="map" class="story-map"></div>
                </div>
                `
                  : ""
              }
            </div>
          </div>
        </div>
      </section>
    `;
  }

  initializeMap(story) {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    try {
      this.map = L.map("map").setView([story.lat, story.lon], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      const popupContent = `
        <div class="map-popup">
          <h3>${story.name}</h3>
          <img src="${story.photoUrl}" alt="Story photo" style="width:200px;max-height:150px;object-fit:cover;margin:8px 0;">
          <p>${story.description}</p>
        </div>
      `;

      L.marker([story.lat, story.lon])
        .addTo(this.map)
        .bindPopup(popupContent, {
          maxWidth: 300,
          maxHeight: 300,
          className: "story-popup",
          autoClose: false,
        })
        .openPopup();
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }

  showError(message) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
      <section class="container error-section">
        <div class="error-card">
          <i class="fas fa-exclamation-circle"></i>
          <p class="error">Error: ${message}</p>
          <a href="#/" class="btn-primary">
            <i class="fas fa-home"></i> Kembali ke Beranda
          </a>
        </div>
      </section>
    `;
  }
}
