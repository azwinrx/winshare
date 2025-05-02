class Auth {
  static authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "/login";
      throw new Error("Authentication required");
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.hash = "/login";
  }
}

export default Auth;
