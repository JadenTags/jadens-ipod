import axios from '@/axios.js';
import { defineStore } from 'pinia';
import config from '@/const.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        access_token: null,
        refresh_token: null
    }),
    actions: {
        async ensureTokens() {
            if (this.access_token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.access_token}`;
            } else {
                const response = await axios.get(`http://localhost:${config.BACKEND_PORT}/tokens`);

                if (response.data.auth.access_token) {
                    this.access_token = response.data.auth.access_token;
                    this.refresh_token = response.data.auth.refresh_token;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${this.access_token}`;
                }
            }
        },
        async getToken() {
            try {
                const response = await axios.post(`http://localhost:${config.BACKEND_PORT}/refresh`, {
                    'refresh_token': this.refresh_token
                });

                this.access_token = response.data.access_token;
                if (response.data.refresh_token) {
                    this.refresh_token = response.data.refresh_token;
                }
    
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.access_token}`;
                return true;
            } catch (e) {
                window.location.href = `http://localhost:${config.BACKEND_PORT}/login`;
                return false;
            }
        }
    },
    persist: true
});