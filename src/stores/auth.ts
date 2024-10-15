import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false
  }),
  actions: {
    checkLoginStatus() {
      const token = sessionStorage.getItem('token');
      this.isLoggedIn = !!token;
      return this.isLoggedIn;
    },
    logout() {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }
      sessionStorage.removeItem('token');
      this.isLoggedIn = false;
    }
  }
});
