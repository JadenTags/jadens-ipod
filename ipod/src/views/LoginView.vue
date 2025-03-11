<script setup>
import { ref, shallowRef } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Controls from '@/components/Controls.vue';
import Toolbar from '@/components/Toolbar.vue';
import SwitchableScreen from '@/components/SwitchableScreen.vue';
import GeneralMenu from '@/components/GeneralMenu.vue';
import NormalButton from '@/components/NormalButton.vue';
import config from '@/const.js';

const authStore = useAuthStore();

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

const loginScreen = ref(null);

Controls.methods.bind(['okButton', () => {loginScreen.value.curScreenRef.clickCurrent()}]);

function loginWithSpotify() {
  if (!authStore.access_token) {
    document.getElementById('main').style.webkitAppRegion = 'no-drag';
    window.location.href = `http://localhost:${config.BACKEND_PORT}/login`;
  } else {
    // let props = {
    //   buttons: shallowRef(general.getFalseButtons(MenuView.data().buttons)),
    //   c: ref(0)
    // }

    // loginScreen.value.nextScreen(GeneralMenu, props);

    setTimeout(() => {
      window.location.href = `${config.FRONTEND_URL}/player`;
    }, config.TRANSITION_TIME * 1000);
  }
}
</script>

<template>
  <v-container>
    <Toolbar></Toolbar>

    <SwitchableScreen
      ref="loginScreen"
      :component="GeneralMenu"
      :props="props"
    />
  </v-container>
</template>
  
<style>
</style>
  