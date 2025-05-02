import { getStories } from "../api/api.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.stories = [];
  }

  async loadStories() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.hash = "/login";
        return;
      }

      const response = await getStories();

      if (response.error) {
        this.view.showError(response.message || "Failed to load stories");
        return;
      }

      this.stories = response.listStory || [];

      if (this.stories.length > 0) {
        this.view.displayStories(this.stories);
      } else {
        this.view.showEmptyState();
      }
    } catch (error) {
      console.error("Error loading stories:", error);
      this.view.showError("Failed to load stories. Please try again later.");
    }
  }

  sortStoriesByDate(ascending = false) {
    const sortedStories = [...this.stories].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return ascending ? dateA - dateB : dateB - dateA;
    });

    this.view.displayStories(sortedStories);
  }
}
