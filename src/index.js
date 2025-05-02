import "regenerator-runtime";
import "./style/style.css";
import App from "./pages/app.js";

const app = new App({
  navigationDrawer: document.querySelector("#navigation-drawer"),
  drawerButton: document.querySelector("#drawer-button"),
  content: document.querySelector("#main-content"),
});

window.addEventListener("hashchange", () => {
  app.renderPage();
});

window.addEventListener("load", () => {
  app.renderPage();
});
