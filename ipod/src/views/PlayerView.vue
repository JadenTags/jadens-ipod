<script setup>
import { useAuthStore } from '@/stores/auth';
import { useSpotifyStore } from '@/stores/spotify';
import config from '../const';
import { onUnmounted } from 'vue';

const authStore = useAuthStore();
const spotifyStore = useSpotifyStore();

async function createPlayer() {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
            name: 'iPod',
            getOAuthToken: cb => { cb(authStore.access_token); },
            volume: 0.5
        });

        spotifyStore.player = player;

        player.addListener('ready', async ({ device_id }) => {
            console.log(player)
            console.log('Ready with Device ID', device_id);
            spotifyStore.play(device_id);
            // await spotifyStore.transferPlayback(device_id);
            // console.log(await spotifyStore.getDevices());
            // console.log(await spotifyStore.player.resume());
            // await spotifyStore.getCurrentState();
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('initialization_error', ({ message }) => {
            console.error(message);
        });

        player.addListener('authentication_error', ({ message }) => {
            authStore.getToken();

            console.error(message);
        });

        player.addListener('account_error', ({ message }) => {
            console.error(message);
        });

        player.connect();
    }
}

authStore.ensureTokens();
createPlayer();

onUnmounted(() => {
    spotifyStore.player.disconnect();
});
</script>

<template>
    <div>

    </div>
</template>