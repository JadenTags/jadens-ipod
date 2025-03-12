<script setup>
defineProps({
  name: String,
  fnc: Function,
  status: Function,
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
    <p class="status">{{ status() }}</p>
  </v-btn>
</template>

<style>
.status {
  position: absolute;
  margin-top: 1%;
  right: 2%;
}
</style>