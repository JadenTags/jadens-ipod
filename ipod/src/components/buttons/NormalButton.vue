<script setup>
defineProps({
  name: String,
  fnc: Function,
  c: Object,
  index: Number
});
</script>

<template>
  <v-btn 
    @click="fnc()" 
    class="menuButton elevation-0 rounded-0" 
    :class="{ highlightedButton: c.value == index }" 
    :ripple="false" 
    block
  >
    <span>{{ name }}</span>
    <img v-if="c.value == index" src="@/assets/selectedIcon.png" class="selectedIcon"/>
  </v-btn>
</template>

<style>
.menuButton {
  padding: 0 !important;
  height: 12% !important;
}

.menuButton span {
  margin-left: 0.5%;
  margin-top: 0.5%;
  width: 100%;
  display: flex;
  font-family: HelveticaNeueBold;
  text-transform: none;
  font-size: min(3vw, 2vh);
  letter-spacing: 0;
}

.highlightedButton {
  color: white !important;
  background-image: url('@/assets/highlighted_button.png') !important;
  background-size: contain !important;
}

.selectedIcon {
  height: 100%;
  position: absolute;
  right: 0;
}
</style>