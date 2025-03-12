<script setup>
defineProps({
  name: String,
  fnc: Function,
  c: Object,
  index: Number,
  condition: Function
});

var showing = true;

function changeC(bool, c) {
  if (!bool && showing) {
    c.value = 0;
  }

  showing = bool;
  return bool;
}
</script>

<template>
  <v-btn 
    v-if="changeC(condition(), c)"
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