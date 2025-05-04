export default class AboutPresenter {
  constructor(view) {
    this.view = view;
  }

  initialize() {
    // This is a minimal implementation since the about page is mostly static
    // But having a presenter maintains consistency and allows for future expansion
    // For example, if we later need to load dynamic content or handle user interactions
    this.view.setupView();
  }
}
