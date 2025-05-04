import { register } from "../../../api/api.js";

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async register(formData) {
    try {
      const response = await register(formData);

      if (!response.error) {
        this.view.showSuccess();
        this.view.redirectToLogin();
      } else {
        this.view.showError(response.message);
      }
    } catch (error) {
      this.view.showError("Registration failed. Please try again later.");
    }
  }
}
