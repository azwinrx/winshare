import { login } from "../../../api/api.js";
import User from "../../../models/user.js";

export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(email, password) {
    try {
      const response = await login({ email, password });

      if (!response.error) {
        const user = User.fromLoginResponse(response);
        localStorage.setItem("token", user.token);
        localStorage.setItem("userName", user.name);
        this.view.redirectToHome();
      } else {
        this.view.showError(response.message);
      }
    } catch (error) {
      this.view.showError("Login failed. Please try again later.");
    }
  }
}
