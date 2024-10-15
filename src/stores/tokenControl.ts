import { defineStore } from 'pinia';

export const useTokenStore = defineStore('token', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || ''
  }),
  actions: {
    setToken(newToken: string) {
      this.accessToken = newToken;
      localStorage.setItem('accessToken', newToken); // 로컬 스토리지에 저장
    },

    deleteToken() {
      this.accessToken = '';
      localStorage.removeItem('accessToken');
    }
  }
});
