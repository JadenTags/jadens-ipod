<script>
import { computed, ref, shallowRef, watch, getCurrentInstance } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useSettingsStore } from '@/stores/settings';
import { useSpotifyStore } from '@/stores/spotify';
import config from '@/const.js';
import Controls from '@/components/Controls.vue';
import Toolbar from '@/components/Toolbar.vue';
import MenuView from './MenuView.vue';
import general from '@/general';

const curView = ref(true);
const screen2 = shallowRef(null);
var screenHistory = [];

export default {
  setup() {
    const instance = getCurrentInstance();
    const connected = computed(() => {return useSettingsStore().connected});

    watch(connected, () => {
      !connected.value ? instance.proxy.previousScreen() : null;
    });

    useAuthStore().ensureTokens();
    useSettingsStore().syncSettings();
  },
  data() {
    return {
      curView: curView,
      screen1: shallowRef(MenuView),
      screen2: screen2
    }
  },
  methods: {
    async nextScreen(component, ...binds) {
      screenHistory.push([Toolbar.data().title.value, {...Controls.data().controls.value}])

      screen2.value = component;
      curView.value = false;

      setTimeout(() => {
        Toolbar.data().title.value = component.data().title;
        Controls.methods.bind(...binds);
      }, config.TRANSITION_TIME/3 * 1000);
    },
    previousScreen() {
      if (screenHistory.length == 0) return;
  
      curView.value = true;

      setTimeout(() => {
        [Toolbar.data().title.value, Controls.data().controls.value] = screenHistory.pop();
      }, config.TRANSITION_TIME/2 * 1000);
    }
  }
}
</script>

<template>
    <v-container class="padding-0">
        <!-- <button @click="curView = !curView" style="position: absolute;z-index: 1;">Toggle Elements</button> -->
        <Transition name="slide" class="transition">
            <component v-show="curView" :is="screen1"/>
        </Transition>
        <Transition name="slide2" class="transition">
            <component v-show="!curView" :is="screen2"/>
        </Transition>
    </v-container>
</template>

<style>
.transition {
    position: absolute;
    padding: 0 !important;
    margin: 0;
    height: 100%;
    width: 100%;
}

.slide-leave-active, .slide-enter-active {
   transition: all 0.3s;
 }
 .slide-enter-from, .slide-leave-to {
   transform: translateX(-100%);
 }

 .slide2-leave-active, .slide2-enter-active {
   transition: all 0.3s;
 }
 .slide2-enter-from, .slide2-leave-to {
   transform: translateX(100%);
 }
</style>