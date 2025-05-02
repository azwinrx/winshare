import routes from "../routes/routes.js";
import { getActiveRoute } from "../routes/url-parser.js";
import { setupAccessibility } from "../utils/accessibility.js";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupSkipLink();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }
    });
  }

  _setupSkipLink() {
    document.addEventListener("click", (e) => {
      const skipLink = document.querySelector(".skip-to-content");
      if (skipLink && e.target === skipLink) {
        e.preventDefault();
        const mainContent = document.querySelector("#main-content");
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth" });
        mainContent.classList.add("content-focused");
        setTimeout(() => {
          mainContent.classList.remove("content-focused");
        }, 2000);
      }
    });
  }

  _updateActiveNavItem() {
    const url = getActiveRoute();
    const navItems = document.querySelectorAll(".nav-list li");

    navItems.forEach((item) => {
      item.classList.remove("active");
      const link = item.querySelector("a");
      if (link) {
        const href = link.getAttribute("href");
        const pagePath = href.replace("#", "");
        if (
          (url === "/" && pagePath === "/") ||
          (url !== "/" && pagePath !== "/" && url.includes(pagePath))
        ) {
          item.classList.add("active");
        }
      }
    });
  }

  _stopMediaStreams() {
    document.querySelectorAll("video").forEach((video) => {
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    });
  }

  async renderPage() {
    this._stopMediaStreams();

    const url = getActiveRoute();
    const page = new routes[url]();

    try {
      const pageContent = await page.render();

      if (document.startViewTransition) {
        document.startViewTransition(async () => {
          await this.#content.animate(
            { opacity: [1, 0] },
            { easing: "ease-out" }
          ).finished;

          this.#content.innerHTML = pageContent;
          await page.afterRender();
          this._updateActiveNavItem();
          this.#content.animate({ opacity: [0, 1] }, { easing: "ease-in" });
          setupAccessibility();
        });
      } else {
        this.#content.style.opacity = 0;
        this.#content.innerHTML = pageContent;
        await page.afterRender();
        this._updateActiveNavItem();
        this.#content.animate({ opacity: [0, 1] }, { easing: "ease-in" });
        setupAccessibility();
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      this.#content.innerHTML = `
        <section class="container error-page" id="main-content">
          <h1>Terjadi Kesalahan</h1>
          <p class="error">Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.</p>
          <a href="#/" class="btn-primary">Kembali ke Beranda</a>
        </section>
      `;
      setupAccessibility();
    }
  }
}

export default App;
