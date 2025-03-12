import axios from '@/axios';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth.js';

export const useSpotifyStore = defineStore('spotify', {
    state: () => ({
        player: null
    }),
    actions: {
        async getData(link) {
            if (!useAuthStore().access_token) {
                await useAuthStore().ensureTokens();
            }

            try {
                const response = await axios.get(link);
                return response.data;
            } catch (e) {
                console.log(e)
                if (e.status == 401) {
                    console.log('Expired Token... Refreshing');
                    if (await useAuthStore().getToken()) {
                        return await this.getData(link);
                    }
                }
            }
        },
        async postData(link, data = null) {
            if (!useAuthStore().access_token) {
                await useAuthStore().ensureTokens();
            }

            try {
                const response = await axios.post(link, data);
                return response.data;
            } catch (e) {
                if (e.status == 401) {
                    console.log('Expired Token... Refreshing');
                    await useAuthStore().getToken();
                    return await this.getData(link);
                }
            }
        },
        async putData(link, data = null) {
            if (!useAuthStore().access_token) {
                await useAuthStore().ensureTokens();
            }

            try {
                const response = await axios.put(link, data);
                return response.data;
            } catch (e) {
                if (e.status == 401) {
                    console.log('Expired Token... Refreshing');
                    if (await useAuthStore().getToken()) {
                        return await this.getData(link);
                    }
                }
            }
        },
        async getCurrentState() {
            const state = await this.player.getCurrentState();

            console.log(state)
        },
        async seekPos(pos) {
            return await this.putData('/me/player/seek?position_ms=' + pos);
        },
        async getPlaybackState() {
            return await this.getData("/me/player");
        },
        async getPlaylists() {
            var playlists = [];
            var call = await this.getData('/me/playlists');
            playlists.push(...call.items);

            for (let i = 1; i < call.total/50; i++) {
                playlists.push(...(await this.getData('/me/playlists?offset=' + (i*50))).items);
            }

            return playlists;
        },
        async getPlaylist(id) {
            return await this.getData('/playlists/' + id);
        },
        async getDevices() {
            return await this.getData("/me/player/devices");
        },
        async transferPlayback(deviceId) {
            return await this.putData('/me/player', {
                device_ids: [deviceId]
            });
        },
        async setVolume(vol) {
            return await this.putData(`/me/player/volume?volume_percent=${vol}`);
        },
        async setRepeat(state) {
            return await this.putData(`/me/player/repeat?state=${state}`);
        },
        async setShuffle(state) {
            return await this.putData(`/me/player/shuffle?state=${state}`);
        },
        async play(id=null) {
            return await this.putData('/me/player/play' + (id ? `?device_id=${id}` : ''), {
                position_ms: 0
            });
        },
        async pause() {
            return await this.putData('/me/player/pause');
        },
        async skipNext() {
            return await this.postData('/me/player/next');
        },
        async skipPrevious() {
            return await this.postData('/me/player/previous');
        }
    }
});