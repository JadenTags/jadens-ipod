<script setup>
import { ref, shallowRef } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useSettingsStore } from '@/stores/settings';
import config from '@/const.js';
import Controls from '@/components/Controls.vue';
import Toolbar from '@/components/Toolbar.vue';
import SwitchableScreen from '@/components/SwitchableScreen.vue';
import GeneralMenu from '@/components/screens/GeneralMenu.vue';
import NormalButton from '@/components/buttons/NormalButton.vue';
import ConditionalButton from '@/components/buttons/ConditionalButton.vue';

const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const loginScreen = ref(null);
const buttons = {
  'Login': {
    component: NormalButton,
    fnc: loginWithSpotify
  }
}
const props = {
  buttons: shallowRef(buttons),
  c: ref(0)
}

async function loginWithSpotify() {
  if (!authStore.access_token) {
    document.getElementById('main').style.webkitAppRegion = 'no-drag';
    window.location.href = `http://localhost:${config.BACKEND_PORT}/login`;
  } else {
    let props = {
      buttons: shallowRef({
        'Music': {
          component: NormalButton,
          fnc: () => {}
        },
        'Settings': {
          component: NormalButton,
          fnc: () => {}
        },
        'Now Playing': {
          component: ConditionalButton,
          fnc: () => {},
          props: {
            condition: () => {return settingsStore.curSong}
          }
        }
      }),
      c: ref(0)
    }

    loginScreen.value.nextScreen(GeneralMenu, props, false);

    setTimeout(() => {
      window.location.href = `${config.FRONTEND_URL}/home`;
    }, config.TRANSITION_TIME * 1000);
  }
}

Controls.methods.bind(['okButton', () => {loginScreen.value.curScreenRef.clickCurrent()}]);
</script>

<template>
  <v-container>
    <v-row justify="space-evenly">
      <v-col cols="6">
        <Toolbar></Toolbar>

        <SwitchableScreen
          ref="loginScreen"
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
</style>
  