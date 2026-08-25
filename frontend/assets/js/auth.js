import api from "./api.js";
import { CONFIG } from "./config.js";

class Auth {
  async login(email, password) {
    const response = await api.post("/auth/login", {
      email,

      password,
    });

    if (!response.success) {
      throw new Error(response.message);
    }

    localStorage.setItem(
      CONFIG.TOKEN_KEY,

      response.token,
    );

    localStorage.setItem(
      CONFIG.USER_KEY,

      JSON.stringify(response.user),
    );

    return response;
  }

  logout() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);

    sessionStorage.removeItem(CONFIG.TOKEN_KEY);
    sessionStorage.removeItem(CONFIG.USER_KEY);

    this.redirectToLogin();
  }
  

  isAuthenticated() {
    return !!localStorage.getItem(CONFIG.TOKEN_KEY);
  }

  getUser() {
    const user = localStorage.getItem(CONFIG.USER_KEY);
    
    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
    
  }
    redirectToLogin() {
    const path = window.location.pathname;
    const marker = "/dashboard/";
    const index = path.indexOf(marker);

    if (index !== -1) {
      const root = path.substring(0, index);
      window.location.href = `${root}/login.html`;
    } else {
      window.location.href = "login.html";
    }
  }
    protectPage() {
    if (!this.isAuthenticated()) {
      this.redirectToLogin();
      return false;
    }

    return true;
  }
}
export default new Auth();
