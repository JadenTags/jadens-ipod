<script setup>
defineProps({
  name: String,
  fnc: Function,
  status: Function,
  c: Object,
  index: Number,
  lockedC: Boolean
});
</script>

<template>
    <v-btn 
      @click="lockedC ? null : fnc()" 
      class="menuButton elevation-0" 
      :class="{ highlightedButton: c.value == index && !lockedC }" 
      :ripple="false" 
      block
    >
        <span>{{ name }}</span>
        <p id="status">{{ status() }}</p>
    </v-btn>
</template>

<style>
#status {
  height: 100%;
  position: absolute;
  margin-top: 1%;
  right: 2%;
  display: flex;
  align-items: center;
}
</style>