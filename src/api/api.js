import CONFIG from "../config/config.js";
import Auth from "../utils/auth.js";

const login = async ({ email, password }) => {
  try {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  } catch (error) {
    return { error: true, message: "Network error occurred" };
  }
};

const register = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  } catch (error) {
    return { error: true, message: "Network error occurred" };
  }
};

const getStories = async (page = 1, size = 10) => {
  try {
    const response = await Auth.authenticatedFetch(
      `${CONFIG.BASE_URL}/stories?page=${page}&size=${size}`
    );
    return response.json();
  } catch (error) {
    return { error: true, message: "Network error occurred" };
  }
};

const getStoryDetail = async (id) => {
  try {
    const response = await Auth.authenticatedFetch(
      `${CONFIG.BASE_URL}/stories/${id}`
    );
    return response.json();
  } catch (error) {
    return { error: true, message: "Network error occurred" };
  }
};

const addStory = async ({ description, photo, lat, lon }) => {
  try {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await Auth.authenticatedFetch(
      `${CONFIG.BASE_URL}/stories`,
      {
        method: "POST",
        body: formData,
      }
    );
    return response.json();
  } catch (error) {
    return { error: true, message: "Network error occurred" };
  }
};

export { login, register, getStories, getStoryDetail, addStory };
