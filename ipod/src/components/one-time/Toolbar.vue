<script>
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const title = ref('iPod');

export default {
  data() {
    return {
      settingsStore: useSettingsStore(),
      title
    }
  }
}
</script>

<template>
  <v-toolbar id="toolbar">
    <v-toolbar-title id="title">{{ title }}</v-toolbar-title>
    <img v-if="settingsStore.playing" id="play" class="icons" src="@/assets/play.png"/>
    <img v-else id="pause" class="icons" src="@/assets/pause.png"/>
    <img id="battery" class="icons" src="@/assets/battery.png"/>
  </v-toolbar>
</template>

<style>
#title {
  margin-left: 2%;
  margin-top: 1%;
  height: 100%;
}

#toolbar {
  background-image: url('@/assets/toolbar.png');
  background-size: contain;
  height: 8%;
  border-bottom: 1px solid rgb(84, 84, 84);
}

.v-toolbar__content, .v-toolbar-title__placeholder {
  max-height: 100%;
  display: flex;
  align-items: center;
  background-color: transparent;
  font-family: HelveticaNeueBold;
  font-size: min(3vw, 2vh);
}

#play {
  height: 90%;
  margin-right: -0.7%;
}

#pause {
  height: 80%;
}

#battery {
  height: 60%;
}
</style>