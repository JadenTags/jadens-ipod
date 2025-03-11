import { defineStore } from 'pinia';
import { useSpotifyStore } from './spotify';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        playing: false,
        shuffle: false,
        repeat: 0,
        volume: 50,
    }),
    actions: {
        async syncSettings() {
            const state = await useSpotifyStore().getPlaybackState();

            console.log(state)
            this.playing = state.is_playing;
            this.shuffle = state.shuffle_state;
            this.repeat = ['off', 'context', 'track'].indexOf(state.repeat_state);
            this.volume = state.device.volume_percent;
        },
        play() {
            this.playing ? useSpotifyStore().pause() : useSpotifyStore().play();
            this.playing = !this.playing;
        },
        toggleShuffle() {
            this.shuffle = !this.shuffle;
            useSpotifyStore().setShuffle(this.shuffle);
        },
        cycleRepeat() {
            this.repeat = (this.repeat + 1) % 3;
            useSpotifyStore().setRepeat(['off', 'context', 'track'][this.repeat]);
        },
        changeVolume(int) {
            if (this.volume + int >= 0 && this.volume + int <= 100) {
                this.volume += int;
                useSpotifyStore().setVolume(this.volume);
            }
        }
    },
    getters: {
        shuffleStatus: (state) => {
            return state.shuffle ? 'On' : 'Off';
        },
        repeatStatus: (state) => {
            return ['Off', 'Context', 'Track'][state.repeat];
        }
    },
    persist: true
});