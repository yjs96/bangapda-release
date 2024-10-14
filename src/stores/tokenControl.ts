import { defineStore } from 'pinia'

interface TokenState {
    accessToken: string;
  }
export const useTokenStore = defineStore<'accessToken', TokenState>({
    id: 'accessToken',
    state: () => ({
        accessToken: localStorage.getItem('accessToken') || '',
    }),
    actions: {
        setToken(newToken: string) {
            this.accessToken = newToken;
            localStorage.setItem('accessToken', newToken); // 로컬 스토리지에 저장
          },
        
        deleteToken() {
            this.accessToken = "";
            localStorage.removeItem('accessToken');
        }
    },
  });