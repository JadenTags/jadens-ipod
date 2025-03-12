<script setup>
import { ref, nextTick, onMounted, watch, computed } from 'vue';
import { useSpotifyStore } from '@/stores/spotify';
import Toolbar from '@/components/Toolbar.vue';
import IPodView from './iPodView.vue';
import general from '@/general';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();
const spotifyStore = useSpotifyStore();
const songInfo = ref({
    name: null,
    artist: null,
    album: null,
    isAlbum: null,
    image: null
});
const timeProgress = ref('0:00');
const timeLeft = ref('0:00');
const curSong = computed(() => {
    return settingsStore.curSong;
});
const progress = computed(() => {
    return settingsStore.progress;
});
const percentDone = computed(() => {
    try {
        return (settingsStore.progress / settingsStore.curSong.duration_ms) * 100;
    } catch {}
});

async function updateNowPlaying() {
    const state = await spotifyStore.getPlaybackState();

    if (!state) return;

    songInfo.value.name = state.item.name;
    songInfo.value.artist = state.item.artists[0].name;
    songInfo.value.album = state.item.album.name;
    songInfo.value.isAlbum = state.item.album.album_type == 'album';
    songInfo.value.image = state.item.album.images[0].url;

    await general.nextFrame();

    const div = document.getElementById('titleDiv');

    try {
        document.getElementById('song').getAnimations()[0].cancel();
    } catch {}

    await general.nextFrame();

    if (div.scrollWidth > div.clientWidth) {
        document.getElementById('song').animate([
        {
            transform: `translateX(100%)`
        },
        {
            transform: `translateX(-${(div.scrollWidth / div.clientWidth) * 100}%)`
        }], {
            duration: (div.scrollWidth / div.clientWidth) * 8000,
            easing: 'linear',
            iterations: 'Infinity'
        });
    }
}

function changeTime() {
    timeProgress.value = general.msToTime(progress.value);
    timeLeft.value = general.msToTime(curSong.value.duration_ms - progress.value);
}

watch(curSong, () => {
    updateNowPlaying();
});

watch(progress, () => {
    if (curSong.value && timeProgress.value != general.msToTime(progress.value) && timeLeft.value != general.msToTime(curSong.value.duration_ms - progress.value)) {
        changeTime();
    }
})

onMounted(() => {
    updateNowPlaying();
    changeTime();
});
</script>

<script>
export default {
    data() {
        return {
            title: 'Now Playing'
        }
    }
}
</script>

<template>
    <v-container class="margin-0">
        <Toolbar></Toolbar>
        
        <v-container id="nowPlayingContainer">
            <div id="imgContainer">
                <img :src="songInfo.image" id="image"/>
                <img :src="songInfo.image" id="reflection"/>
            </div>

            <div id="infoDiv">
                <div id="titleDiv">
                    <div id="song">{{ songInfo.name }}</div>
                </div>

                <h1 id="artist">{{ songInfo.artist }}</h1>
                <h1 v-if="songInfo.isAlbum" id="album">{{ songInfo.album }}</h1>
            </div>

            <div id="progressDiv">
                <div id="progressBar">
                    <div id="progress" :style="`width:${percentDone}%`"></div>
                </div>
                <div id="progressBarReflection">
                    <div id="progressReflection" :style="`width:${percentDone}%`"></div>
                </div>
                <p id="progressTime">{{ timeProgress }}</p>
                <p id="timeLeft">-{{ timeLeft }}</p>
            </div>
        </v-container>
    </v-container>
</template>

<style>
#nowPlayingContainer {
    position: absolute;
    display: flex;
    background-color: white;
    height: 100%;
    padding: 0;
    margin: 0;
}

#image {
    position: absolute;
    height: 90%;
    transform: rotateY(10deg);
}

#reflection {
    position: absolute;
    height: 90%;
    transform: rotateY(10deg) rotateX(180deg) translateY(-100%);
    opacity: 15%;
}

#imgContainer {
    flex: 1;
    margin-top: 6%;
    margin-left: 5%;
    height: 60%;
    perspective: 200px !important;
    transform: scaleX(.98);
}

#infoDiv {
    position: absolute;
    margin-left: 50%;
    width: 45%;
    margin-top: 10%;
    flex: 1;
    height: 60%;
    align-items: center;
    justify-content: center;
}

#titleDiv {
    height: 15%;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
}

#song {
    margin: 0;
    font-family: HelveticaNeueBlack;
    text-transform: none;
    font-size: min(3.7vw, 2.3vh);
}

#artist {
  font-family: HelveticaNeueBold;
  text-transform: none;
  font-size: min(min(2.9vw, 1.9vh), 100%);
  line-height: min(min(2.9vw, 1.9vh), 100%);
  color: rgb(78, 78, 78);
}

#album {
  font-family: HelveticaNeueMedium;
  text-transform: none;
  margin-top: 2%;
  font-size: min(min(2.9vw, 1.9vh), 100%);
  line-height: min(min(2.9vw, 1.9vh), 100%);
  color: rgb(78, 78, 78);
}

#progressDiv {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 30%;
    display: flex;
    justify-content: center;
}

#progressBar {
    width: 90%;
    height: 25%;
    background-image: url("@/assets/empty_progress.png");
    background-repeat: round;
}

#progressTime {
    position: absolute;
    bottom: 40%;
    left: 5%;
    font-family: HelveticaNeueMedium;
    text-transform: none;
    font-size: min(min(3.3vw, 2.2vh), 100%);
}

#timeLeft {
    position: absolute;
    bottom: 40%;
    right: 5%;
    font-family: HelveticaNeueMedium;
    text-transform: none;
    font-size: min(min(3.3vw, 2.2vh), 100%);
}

#progress {
    height: 100%;
    background-image: url("@/assets/filled_progress.png");
    background-repeat: round;
}

#progressBarReflection {
    position: absolute;
    transform: translateY(100%);
    width: 90%;
    height: 20%;
    background-image: url("@/assets/empty_progress.png");
    background-repeat: round;
    opacity: 7%;
}

#progressReflection {
    position: absolute;
    height: 100%;
    background-image: url("@/assets/filled_progress.png");
}
</style>