<script>
import { computed, ref, shallowRef, watch, getCurrentInstance } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useSettingsStore } from '@/stores/settings';
import config from '@/const.js';
import Controls from '@/components/one-time/Controls.vue';
import Toolbar from '@/components/one-time/Toolbar.vue';
import SwitchableMenu from '@/components/one-time/SwitchableMenu.vue';
import SwitchableScreen from '@/components/one-time/SwitchableScreen.vue';
import general from '@/general';

const curView = ref(true);
const screen1 = shallowRef(null);
const screen1Props = ref(null);
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
      curView,
      screen1,
      screen1Props
    }
  },
  components: {
    SwitchableMenu,
    SwitchableScreen
  },
  methods: {
    async nextScreen(component, title, props=null, ...binds) {
      screenHistory.push([Toolbar.data().title.value, {...Controls.data().controls.value}])

      document.body.style.setProperty('--transition-time', `0s`);
      screen1Props.value = props;
      screen1.value = component;
      await general.nextFrame();
      document.body.style.setProperty('--transition-time', `${config.TRANSITION_TIME}s`);

      curView.value = false;

      setTimeout(() => {
        Toolbar.data().title.value = title;
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
    <Transition name="display1" class="transition">
      <SwitchableMenu v-show="curView"/>
    </Transition>
    <Transition name="display2" class="transition">
      <SwitchableScreen v-show="!curView" :props="screen1Props" :screen1="screen1"/>
    </Transition>
  </v-container>
</template>