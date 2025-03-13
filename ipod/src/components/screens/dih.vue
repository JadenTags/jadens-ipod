<script>
import { ref } from 'vue';
import { useSpotifyStore } from '@/stores/spotify';
import Toolbar from '@/components/one-time/Toolbar.vue';

const onMain = ref(true);
const playlists = ref(null);
const songs = ref(null);
const c = ref(0);
const c2 = ref(0);

async function populatePlaylists() {
  playlists.value = await useSpotifyStore().getPlaylists();
  console.log(playlists.value)
}

async function populateSongs(id) {
}

export default {
  setup() {
    populatePlaylists();
  },
  data() {
    return {
      onMain: onMain,
      playlists: playlists,
      songs: songs,
      c: c,
      c2: c2,
      title: 'Playlists'
    }
  },
  components: {
    Toolbar
  },
  methods: {
    cycle(up) {
      if (up && c.value < playlists.value.length-1) {
        c.value += 1;
      } else if (!up && c.value > 0) {
        c.value -= 1;
      }

      document.getElementById(playlists.value[c.value].name + 'Button').scrollIntoView({
        behavior: 'auto',
        block: 'end'
      });
    },
    async enterPlaylist(id) {
      songs.value = (await useSpotifyStore().getPlaylist(id)).tracks.items;
      c2.value = 0;

      console.log(songs.value)
      onMain.value = false;
    }
  }
}
</script>

<template>
    <v-container id="menuScreen">
      <Transition name="slide" class="transition">
          <v-list id="buttonList" v-if="onMain">
            <v-btn
              v-for="(playlist, index) in playlists"
              class="playlistButton rounded-0"
              :class="{ highlightedButton: c == index }" 
              @mouseenter="c = index"
              @click="enterPlaylist(playlist.id)"
              :ripple="false" 
              :id="playlist.name + 'Button'"
              block
            >
              <img :src="playlist.images[0].url" class="playlistImage"/>
              <p class="playlistText">{{ playlist.name }}</p>
              <p class="playlistOwnerText">{{ playlist.owner.display_name }}</p>
              <img v-if="c == index" src="@/assets/selectedIcon.png" class="playlistMarker"/>
            </v-btn>
          </v-list>
      </Transition>
      <Transition name="slide2" class="transition">
        <v-list id="buttonList" v-if="!onMain">
          <v-btn
              v-for="(song, index) in songs"
              class="playlistButton rounded-0"
              :class="{ highlightedButton: c2 == index }" 
              @mouseenter="c2 = index"
              :ripple="false" 
              :id="song.track.name + 'Button'"
              block
            >
              <img :src="song.track.album.images[0].url" class="playlistImage"/>
              <p class="playlistText">{{ song.track.name }}</p>
              <p class="playlistOwnerText">{{ song.track.artists[0].name }}</p>
              <img v-if="c == index" src="@/assets/selectedIcon.png" class="playlistMarker"/>
            </v-btn>
          </v-list>
      </Transition>
    </v-container>
</template>

<style>
.playlistButton {
  padding: 0 !important;
  height: 20% !important;
  align-items: center;
  justify-content: center;
}

.playlistButton span {
  height: 100%;
  width: 100%;
}

.playlistImage {
  position: absolute;
  left: 0;
  height: 100%;
  aspect-ratio: 1;
}

.playlistText {
  position: absolute;
  margin-top: -3%;
  left: 18%;
  display: inline-block;
  font-family: HelveticaNeueBold;
  text-transform: none;
  font-size: min(3vw, 2vh);
  letter-spacing: 0;
}

.playlistOwnerText {
  position: absolute;
  margin-top: 4%;
  left: 18%;
  display: inline-block;
  font-family: HelveticaNeueMedium;
  text-transform: none;
  font-size: min(2vw, 1.5vh);
  letter-spacing: 0;
  /* color: rgb(78, 78, 78); */
}

.playlistMarker {
  position: absolute;
  right: 0;
  height: 80%;
}
</style>