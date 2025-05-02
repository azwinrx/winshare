const CONFIG = {
  BASE_URL: "https://story-api.dicoding.dev/v1",
  DEFAULT_LANGUAGE: "id-ID",
  DEFAULT_MAP_TILE: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  DEFAULT_LOCATION: {
    lat: -6.2088,
    lng: 106.8456,
    zoom: 13,
  },
  CAMERA_OPTIONS: {
    video: {
      facingMode: "environment",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  },
  IMAGE_COMPRESSION: {
    quality: 0.8,
    type: "image/jpeg",
  },
};

export default CONFIG;
