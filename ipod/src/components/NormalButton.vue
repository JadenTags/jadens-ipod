<script setup>
defineProps({
  name: String,
  fnc: Function,
  c: Object,
  index: Number,
  lockedC: Boolean
});
</script>

<template>
    <v-btn 
      @click="lockedC ? null : fnc()" 
      class="menuButton elevation-0" 
      :class="{ highlightedButton: c.value == index }" 
      :ripple="false" 
      block
    >
        <span>{{ name }}</span>
        <img v-if="c.value == index" src="../assets/selectedIcon.png" class="selectedIcon"/>
    </v-btn>
</template>

<style>
.menuButton {
  padding: 0 !important;
  height: 12% !important;
  border-radius: 0 !important;
}

.menuButton span {
  margin-left: 0.7%;
  margin-top: 1%;
  width: 100%;
  display: flex;
  font-family: HelveticaNeueBold;
  text-transform: none;
  font-size: min(3vw, 2vh);
}

.highlightedButton {
  color: white !important;
  background-image: url('../assets/highlighted_button.png') !important;
  border-bottom: 1px solid rgb(84, 84, 84) !important;
}

.selectedIcon {
  height: 100%;
  position: absolute;
  right: 0;
}
</style>