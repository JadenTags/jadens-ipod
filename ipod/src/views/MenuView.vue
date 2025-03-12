<script setup>
import { ref, shallowRef } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useSettingsStore } from '@/stores/settings';
import { useSpotifyStore } from '@/stores/spotify';
import iPodView from './iPodView.vue';
import NowPlayingView from './NowPlayingView.vue';
import Controls from '@/components/Controls.vue';
import Toolbar from '@/components/Toolbar.vue';
import PlaylistsScreen from '@/components/screens/PlaylistsScreen.vue';
import SwitchableScreen from '@/components/SwitchableScreen.vue';
import GeneralMenu from '@/components/screens/GeneralMenu.vue';
import MessageScreen from '@/components/screens/MessageScreen.vue';
import NormalButton from '@/components/buttons/NormalButton.vue';
import ToggleButton from '@/components/buttons/ToggleButton.vue';
import ConditionalButton from '@/components/buttons/ConditionalButton.vue';

const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const spotifyStore = useSpotifyStore();
const menu = shallowRef(null)

const musicButtons = {
  'Playlists': {
    component: NormalButton,
    fnc: () => {iPodView.methods.nextScreen(PlaylistsScreen, ['menuButton', () => {iPodView.methods.previousScreen()}], ['counterClockwise', () => {PlaylistsScreen.methods.cycle(false)}], ['clockwise', () => {PlaylistsScreen.methods.cycle(true)}], ['okButton', () => {}])}
  },
  'Artists': {
    component: NormalButton,
    fnc: () => {}
  },
  'Albums': {
    component: NormalButton,
    fnc: () => {}
  },
  'Top Songs': {
    component: NormalButton,
    fnc: () => {}
  },
  'Genres': {
    component: NormalButton,
    fnc: () => {}
  },
  'Search': {
    component: NormalButton,
    fnc: () => {}
  }
}

const settingsButtons = {
  'About': {
    component: NormalButton,
    fnc: () => {menu.value.nextScreen(MessageScreen, {message: 'Ipod Classic Spotify Controller by Jaden Tagulinao'}, ['menuButton', () => {menu.value.previousScreen()}], ['okButton', () => {}])}
  },
  'Shuffle': {
    component: ToggleButton,
    fnc: () => {settingsStore.connected ? settingsStore.toggleShuffle() : null},
    props: {
      status: () => {return settingsStore.shuffleStatus}
    }
  },
  'Repeat': {
    component: ToggleButton,
    fnc: () => {settingsStore.connected ? settingsStore.cycleRepeat() : null},
    props: {
      status: () => {return settingsStore.repeatStatus}
    }
  },
  'Time Range': {
    component: ToggleButton,
    fnc: () => {settingsStore.connected ? settingsStore.cycleTimeRange() : null},
    props: {
      status: () => {return settingsStore.timeRangeStatus}
    }
  },
  // 'Device': {
  //   component: ToggleButton,
  //   fnc: settingsStore.cycleDevice,
  //   props: {
  //     status: () => {return settingsStore.deviceStatus}
  //   }
  // }
}

const buttons = {
  'Music': {
    component: NormalButton,
    fnc: () => {menu.value.nextScreen(GeneralMenu, {buttons: shallowRef(musicButtons), c: ref(0)})}
  },
  'Settings': {
    component: NormalButton,
    fnc: () => {menu.value.nextScreen(GeneralMenu, {buttons: shallowRef(settingsButtons), c: ref(0)})}
  },
  'Now Playing': {
    component: ConditionalButton,
    fnc: () => {iPodView.methods.nextScreen(NowPlayingView, ['menuButton', () => {iPodView.methods.previousScreen()}], ['counterClockwise', () => {}], ['clockwise', () => {}], ['okButton', () => {}])},
    props: {
      condition: () => {return settingsStore.curSong}
    }
  }
}

const props = {
  buttons: shallowRef(buttons),
  c: ref(0)
}

Controls.methods.bind(['okButton', () => {menu.value.curScreenRef.clickCurrent()}], [
  'menuButton', () => {menu.value.previousScreen()}], 
  ['counterClockwise', () => {menu.value.curScreenRef.cycle(false)}], 
  ['clockwise', () => {menu.value.curScreenRef.cycle(true)}],
  ['ppButton', () => {settingsStore.connected ? settingsStore.play() : null}],
  ['nextButton', () => {settingsStore.connected ? spotifyStore.skipNext() : null}],
  ['prevButton', () => {settingsStore.connected ? spotifyStore.skipPrevious() : null}]
);
</script>

<template>
  <v-container>
    <v-row justify="space-evenly">
      <v-col cols="6">
        <Toolbar></Toolbar>

        <SwitchableScreen
          ref="menu"
          :component="GeneralMenu"
          :props="props"
        />
      </v-col>

      <v-col cols="6">
        <img id="screensaver" src="@/assets/screensaver.jpg"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.v-row {
  margin: 0 !important;
  width: 100%;
  height: 100%;
}

.v-col {
  padding: 0 !important;
  height: 100%;
}

#screensaver {
  position: absolute;
  z-index: 1 !important;
  height: 100%;
  width: 50%;
}
</style>