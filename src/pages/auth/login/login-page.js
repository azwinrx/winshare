import LoginPresenter from "./login-presenter.js";
import NavigationHelper from "../../../utils/navigation-helper.js";

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter(this);
  }

  async render() {
    return `
      <section class="auth-container" id="main-content">
        <div class="auth-card">
          <h1>Login</h1>
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Login</button>
              <span>Belum punya akun? <a href="#/register">Daftar</a></span>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    NavigationHelper.setupUnauthenticatedNavigation();

    const form = document.querySelector("#login-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.presenter.login(form.email.value, form.password.value);
    });
  }

  showError(message) {
    alert(message);
  }

  redirectToHome() {
    window.location.hash = "/";
  }
}
