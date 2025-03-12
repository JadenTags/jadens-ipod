<script setup>
import Controls from './components/one-time/Controls.vue';
</script>

<template>
  <v-app id="app">
    <v-main id="main">
      <router-view id="routerView"/>

      <Controls id="controls"></Controls>
    </v-main>
  </v-app>
</template>

<style scoped>
#app {
  background-color: transparent;
}

#main {
  background-image: url('./assets/ipod.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: drag;
}

#routerView {
  padding: 0;
  position: absolute;
  margin-left: min(3.2vw, 2.5vh);
  margin-top: max(-80vw, -51.2vh);
  height: min(55vw, 35.5vh);
  width: min(73vw, 47vh);
  opacity: 80%;
  overflow: hidden;
  -webkit-app-region: no-drag;
}

#controls {
  padding: 0;
  position: absolute;
  margin-top: min(56.3vw, 36vh);
  margin-left: min(3vw, 2.2vh);
  height: min(53.5vw, 34.2vh);
  width: min(53.5vw, 34.2vh);
  border-radius: 100%;
  overflow: clip;
  -webkit-app-region: no-drag;
}
</style>