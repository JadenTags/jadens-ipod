import { defineStore } from 'pinia';
import { useSpotifyStore } from './spotify';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        playing: false,
        shuffle: false,
        repeat: 0,
        device_list: [],
        device: 0,
        volume: 50,
        curSong: null,
        progress: 0,
        connected: false
    }),
    actions: {
        async syncSettings() {
            setTimeout(() => {
                this.syncSettings();
            }, 500)

            const state = await useSpotifyStore().getPlaybackState();
            // this.device_list = await useSpotifyStore().getDevices().devices;
            this.connected = state != '';
            // console.log(this.device_list)

            // if (this.device >= this.device_list.length) this.device = 0;

            // console.log(state)
            if (!state) {
                this.curSong = null;
                this.progress = null;
            } else {
                this.playing = state.is_playing;
                this.shuffle = state.shuffle_state;
                this.repeat = ['off', 'context', 'track'].indexOf(state.repeat_state);
                this.volume = state.device.volume_percent;
    
                if (!this.curSong || (this.curSong.name && state.item.name != this.curSong.name)) this.curSong = state.item;
                if (state.progress_ms != this.progress) this.progress = state.progress_ms;
            }
        },
        play() {
            this.playing ? useSpotifyStore().pause() : useSpotifyStore().play();
        },
        toggleShuffle() {
            useSpotifyStore().setShuffle(!this.shuffle);
        },
        cycleRepeat() {
            useSpotifyStore().setRepeat(['off', 'context', 'track'][(this.repeat + 1) % 3]);
        },
        async cycleDevice() {
            this.device = (this.device + 1) % await useSpotifyStore().getDevices().length;

            //TODO: MAKE THIS SHIT
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
        },
        deviceStatus: (state) => {
            return ['Other', 'iPod'][state.device];
        }
    },
    persist: true
});