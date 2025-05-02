import HomePage from "../pages/home-page.js";
import AddStoryPage from "../pages/add-story-page.js";
import LoginPage from "../pages/login-page.js";
import RegisterPage from "../pages/register-page.js";
import AboutPage from "../pages/about-page.js";
import StoryDetailPage from "../pages/story-detail-page.js";

const routes = {
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/add-story": AddStoryPage,
  "/about": AboutPage,
  "/story/:id": StoryDetailPage,
};

export default routes;
