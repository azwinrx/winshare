import { getStoryDetail } from "../../api/api.js";
import Story from "../../models/story.js";

export default class StoryDetailPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadStoryDetail(id) {
    try {
      const response = await getStoryDetail(id);

      if (response.error) {
        this.view.showError(response.message);
        return;
      }

      const story = Story.fromJson(response.story);
      this.view.displayStory(story);

      if (story.lat && story.lon) {
        this.view.initializeMap(story);
      }
    } catch (error) {
      this.view.showError(
        "Failed to load story detail. Please try again later."
      );
    }
  }
}
