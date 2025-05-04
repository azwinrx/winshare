import { getStories } from "../../api/api.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.stories = [];
    this.currentPage = 1;
    this.hasMorePages = true;
    this.isLoading = false;
  }

  async loadStories(loadMore = false) {
    try {
      if (this.isLoading || (!loadMore && !this.hasMorePages)) return;

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.hash = "/login";
        return;
      }

      this.isLoading = true;
      const page = loadMore ? this.currentPage + 1 : 1;
      const response = await getStories(page);

      if (response.error) {
        this.view.showError(response.message || "Failed to load stories");
        return;
      }

      const newStories = response.listStory || [];
      this.hasMorePages = newStories.length > 0;

      if (loadMore) {
        this.stories = [...this.stories, ...newStories];
        this.currentPage = page;
      } else {
        this.stories = newStories;
        this.currentPage = 1;
      }

      if (this.stories.length > 0) {
        this.view.displayStories(this.stories, this.hasMorePages);
      } else {
        this.view.showEmptyState();
      }
    } catch (error) {
      console.error("Error loading stories:", error);
      this.view.showError("Failed to load stories. Please try again later.");
    } finally {
      this.isLoading = false;
    }
  }

  sortStoriesByDate(ascending = false) {
    const sortedStories = [...this.stories].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return ascending ? dateA - dateB : dateB - dateA;
    });

    this.view.displayStories(sortedStories, this.hasMorePages);
  }
}
