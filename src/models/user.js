export default class User {
  constructor({ name, email, token }) {
    this.name = name;
    this.email = email;
    this.token = token;
  }

  static fromLoginResponse(response) {
    return new User({
      name: response.loginResult.name,
      email: response.loginResult.email,
      token: response.loginResult.token,
    });
  }
}
