import RegisterPresenter from "./register-presenter.js";
import NavigationHelper from "../../../utils/navigation-helper.js";

export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter(this);
  }

  async render() {
    return `
      <section class="auth-container" id="main-content">
        <div class="auth-card">
          <h1>Register</h1>
          <form id="register-form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" required minlength="3">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required minlength="6">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Register</button>
              <span>Sudah punya akun? <a href="#/login">Login</a></span>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    NavigationHelper.setupUnauthenticatedNavigation();

    const form = document.querySelector("#register-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
      };

      await this.presenter.register(formData);
    });
  }

  showError(message) {
    alert(message);
  }

  showSuccess() {
    alert("Registrasi berhasil! Silakan login.");
  }

  redirectToLogin() {
    window.location.hash = "/login";
  }
}
