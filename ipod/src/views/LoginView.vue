<script setup>
import { ref, shallowRef } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Controls from '@/components/one-time/Controls.vue';
import Toolbar from '@/components/one-time/Toolbar.vue';
import GeneralMenu from '@/components/menus/GeneralMenu.vue';
import NormalButton from '@/components/buttons/NormalButton.vue';
import config from '@/const.js';

const authStore = useAuthStore();
const loginScreen = ref(null);
const buttons = shallowRef({
  'Login': {
    component: NormalButton,
    fnc: async () => {
      if (authStore.access_token) {
        document.getElementById('main').style.webkitAppRegion = 'no-drag';
        window.location.href = `http://localhost:${config.BACKEND_PORT}/login`;
      } else {
        window.location.href = `${config.FRONTEND_URL}/home`;
      }
    }
  }
});

const props = {
  buttons,
  c: ref(0)
}

Controls.methods.bind(['okButton', () => {loginScreen.value.clickCurrent()}]);
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
          <Toolbar></Toolbar>

          <GeneralMenu
            ref="loginScreen"
            v-bind="props"
          />
      </v-col>

      <v-col>
        <img id="screensaver" src="@/assets/screensaver.jpg"/>
      </v-col>
    </v-row>
  </v-container>
</template>
  