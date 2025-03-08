import { defineStore } from 'pinia';
import axios from '@/axios.js';
import config from '@/const.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        access_token: null,
        refresh_token: null
    }),
    actions: {
        async ensureTokens() {
            let temp = localStorage.getItem('access_token');

            if (temp != this.access_token) {
                this.access_token = localStorage.getItem('access_token');
                this.refresh_token = localStorage.getItem('refresh_token');

                axios.defaults.headers.common['Authorization'] = `Bearer ${this.access_token}`;
            }
        },
        async getToken() {
            try {
                const response = await axios.post('https://accounts.spotify.com/api/token', {
                    'grant_type': 'refresh_token',
                    'refresh_token': this.refresh_token
                }, {
                    headers: {
                        'Authorization': `Basic ${btoa(config.CLIENT_ID + ':' + config.CLIENT_SECRET)}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
    
                this.access_token = response.data.access_token;
                localStorage.setItem('access_token', this.access_token);
                if (response.data.refresh_token_token) {
                    this.refresh_token = response.data.refresh_token;
                    localStorage.setItem('refresh_token', this.refresh_token);
                }
    
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.access_token}`;
                return true;
            } catch {
                window.location.href = `http://localhost:${config.BACKEND_PORT}/login`;
                return false;
            }
        }
    },
    persist: true
});