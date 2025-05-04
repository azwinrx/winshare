import AddStoryPresenter from "./add-story-presenter.js";
import NavigationHelper from "../../utils/navigation-helper.js";
import CONFIG from "../../config/config.js";

export default class AddStoryPage {
  constructor() {
    this.presenter = new AddStoryPresenter(this);
    this.videoElement = null;
    this.capturedImageBlob = null;
    this.isCameraMode = false;
    this.map = null;
    this.marker = null;
  }

  async render() {
    return `      
      <section class="container" id="main-content">
        <h1>Tambah Story</h1>
        <form id="add-story-form">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required 
                      placeholder="Ceritakan momen Anda..."></textarea>
          </div>
          
          <div class="photo-input-container">
            <label>Foto</label>
            <div class="photo-actions" style="height: 150px;">
              <input type="file" id="photo" name="photo" accept="image/*" class="file-input" style="height: 50px;">
              <button type="button" id="camera-btn" class="camera-toggle-btn" style="height: 50px;">
                <i class="fas fa-camera"></i> Gunakan Kamera
              </button>
            </div>
            
            <div id="camera-container" class="camera-container" style="display: none;">
              <video id="camera-preview" class="camera-preview" playsinline></video>
              <div class="camera-controls">
                <button type="button" id="capture-btn" class="camera-button">
                  <i class="fas fa-camera"></i> Ambil Foto
                </button>
                <button type="button" id="close-camera-btn" class="camera-close-btn">
                  <i class="fas fa-times"></i> Tutup Kamera
                </button>
              </div>
            </div>
            
            <div id="preview-container" style="display: none;">
              <img id="photo-preview" alt="Preview foto yang akan diunggah">
              <button type="button" id="retake-btn" class="retake-btn">
                <i class="fas fa-redo"></i> Ambil Ulang
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="map">Pilih Lokasi di Peta</label>
            <p class="map-instructions">Klik pada peta untuk menentukan lokasi story Anda</p>
            <div id="map" style="height: 300px; margin-top: 10px;" class="story-map"></div>
            <div class="location-info" style="margin-top: 10px;">
              <p id="selected-location">Belum ada lokasi dipilih</p>
            </div>
            <input type="hidden" id="lat" name="lat">
            <input type="hidden" id="lon" name="lon">
          </div>
          
          <button type="submit" class="btn-primary">
            <i class="fas fa-paper-plane"></i> Tambah Story
          </button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    NavigationHelper.setupAuthenticatedNavigation();
    this._initMap();
    this._initFormElements();
    this._initEventListeners();

    window.addEventListener("hashchange", () => this.stopCameraStream());
    window.addEventListener("beforeunload", () => this.stopCameraStream());
  }

  _initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    try {
      this.map = L.map("map").setView(
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
            this._updateMarker(latitude, longitude);
          },
          (error) => {
            console.log("Geolocation error:", error);
            // Fallback to default location
            this._updateMarker(
              CONFIG.DEFAULT_LOCATION.lat,
              CONFIG.DEFAULT_LOCATION.lng
            );
          }
        );
      }

      this.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        this._updateMarker(lat, lng);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      alert("Terjadi kesalahan saat memuat peta. Silakan coba lagi.");
    }
  }

  _updateMarker(lat, lon) {
    if (this.marker) {
      this.marker.setLatLng([lat, lon]);
    } else {
      this.marker = L.marker([lat, lon]).addTo(this.map);
    }

    document.getElementById("lat").value = lat;
    document.getElementById("lon").value = lon;
    document.getElementById(
      "selected-location"
    ).innerHTML = `<i class="fas fa-map-marker-alt"></i> Lokasi dipilih: ${lat.toFixed(
      6
    )}, ${lon.toFixed(6)}`;
  }

  _initFormElements() {
    this.form = document.querySelector("#add-story-form");
    this.photoInput = document.getElementById("photo");
    this.cameraBtn = document.getElementById("camera-btn");
    this.closeCameraBtn = document.getElementById("close-camera-btn");
    this.cameraContainer = document.getElementById("camera-container");
    this.previewContainer = document.getElementById("preview-container");
    this.photoPreview = document.getElementById("photo-preview");

    // Handle photo input change
    if (this.photoInput) {
      this.photoInput.addEventListener("change", () => {
        if (this.photoInput.files && this.photoInput.files[0]) {
          this._showImagePreview(URL.createObjectURL(this.photoInput.files[0]));
        }
      });
    }
  }

  _initEventListeners() {
    // Camera button
    if (this.cameraBtn) {
      this.cameraBtn.addEventListener("click", () => {
        this.isCameraMode = true;
        this.photoInput.style.display = "none";
        this.cameraBtn.style.display = "none";
        this.cameraContainer.style.display = "block";
        this.presenter.initCamera();
      });
    }

    // Close camera button
    if (this.closeCameraBtn) {
      this.closeCameraBtn.addEventListener("click", () => {
        this.isCameraMode = false;
        this.photoInput.style.display = "block";
        this.cameraBtn.style.display = "inline-block";
        this.cameraContainer.style.display = "none";
        this.stopCameraStream();
      });
    }

    // Capture button
    const captureBtn = document.getElementById("capture-btn");
    if (captureBtn) {
      captureBtn.addEventListener("click", async () => {
        this.capturedImageBlob = await this.presenter.capturePhoto(
          this.videoElement
        );
        const imageUrl = URL.createObjectURL(this.capturedImageBlob);
        this._showImagePreview(imageUrl);
      });
    }

    // Retake button
    const retakeBtn = document.getElementById("retake-btn");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        this.capturedImageBlob = null;
        this.previewContainer.style.display = "none";

        if (this.isCameraMode) {
          this.cameraContainer.style.display = "block";
          this.presenter.initCamera();
        } else {
          this.photoInput.style.display = "block";
          this.cameraBtn.style.display = "inline-block";
          this.photoInput.value = "";
        }
      });
    }

    // Form submission
    if (this.form) {
      this.form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Validate and collect form data
        const formData = {
          description: this.form.description.value,
          lat: this.form.lat.value,
          lon: this.form.lon.value,
          token: localStorage.getItem("token"),
        };

        // Add photo data (either from file input or captured photo)
        if (this.capturedImageBlob) {
          formData.photo = new File([this.capturedImageBlob], "photo.jpg", {
            type: "image/jpeg",
          });
        } else if (this.photoInput.files && this.photoInput.files[0]) {
          formData.photo = this.photoInput.files[0];
        } else {
          alert("Harap pilih atau ambil foto terlebih dahulu");
          return;
        }

        // Check if token exists
        if (!formData.token) {
          window.location.hash = "/login";
          return;
        }

        // Submit using presenter
        await this.presenter.submitStory(formData);
      });
    }
  }

  _showImagePreview(imageUrl) {
    if (!this.photoPreview || !this.previewContainer) return;

    this.photoPreview.src = imageUrl;
    this.photoInput.style.display = "none";
    this.cameraBtn.style.display = "none";
    this.cameraContainer.style.display = "none";
    this.previewContainer.style.display = "block";

    // Stop camera stream if it was active
    this.stopCameraStream();
  }

  showCameraPreview(stream) {
    this.videoElement = document.getElementById("camera-preview");
    if (this.videoElement) {
      this.videoElement.srcObject = stream;
      this.videoElement.play();
    }
  }

  // Ensure camera is always stopped when navigating away
  stopCameraStream() {
    if (this.videoElement && this.videoElement.srcObject) {
      const tracks = this.videoElement.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      this.videoElement.srcObject = null;
    }
  }

  showError(message) {
    alert(message);
  }

  redirectToHome() {
    this.stopCameraStream(); // Stop camera before redirecting
    window.location.hash = "/";
  }
}
