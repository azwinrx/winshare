import HomePage from "../pages/home/home-page.js";
import AddStoryPage from "../pages/add-story/add-story-page.js";
import LoginPage from "../pages/auth/login/login-page.js";
import RegisterPage from "../pages/auth/register/register-page.js";
import AboutPage from "../pages/about/about-page.js";
import StoryDetailPage from "../pages/story-detail/story-detail-page.js";

const routes = {
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/add-story": AddStoryPage,
  "/about": AboutPage,
  "/story/:id": StoryDetailPage,
};

export default routes;
