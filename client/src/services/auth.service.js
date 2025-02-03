import axios from "axios";
const API_URL = "https://mern-project-73375b7b705a.herokuapp.com/api/user";

class AuthService {
  //登入功能
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }
  //登出功能
  logout() {
    localStorage.removeItem("user");
  }
  //註冊功能
  register(username, email, password, role) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    });
  }
  //取得使用者資料
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
