// src/scripts/utils/navigation-helper.js

import Auth from "./auth.js";

class NavigationHelper {
  static setupAuthenticatedNavigation() {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "/login";
      return;
    }

    const navList = document.querySelector("#nav-list");
    if (!navList) return;

    const userName = localStorage.getItem("userName") || "User";

    navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/add-story">Tambah Story</a></li>
      <li><a href="#/about">About</a></li>
      <li><a href="#" id="logout-button" class="nav-link">Logout (${userName})</a></li>
    `;

    // Add event listener for logout button
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        Auth.logout();
      });
    }
  }

  static setupUnauthenticatedNavigation() {
    const navList = document.querySelector("#nav-list");
    if (!navList) return;

    navList.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
  }
}

export default NavigationHelper;
