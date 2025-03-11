<script setup>
import { ref, toRef, watch } from 'vue';

const props = defineProps({
  buttons: Object,
  c: Object
});
const lockedC = ref(false);

console.log(props.c, lockedC)

defineExpose({
  lockedC,
  clickCurrent: () => {
    Object.values(props.buttons.value)[props.c.value].fnc();
  },
  cycle: (up) => {
    if (up && Object.keys(props.buttons.value).length-1 > props.c.value) {
      props.c.value += 1;
    } else if (!up && props.c.value > 0) {
      props.c.value -= 1;
    }
  }
})
</script>

<template>
  <v-container id="menuScreen">
      <v-list id="buttonList">
        <component 
          v-for="(value, name, index) in props.buttons.value" 
          @mouseenter="lockedC ? null : props.c.value = index"
          v-bind="value.props"
          :lockedC="lockedC"
          :name="name"
          :fnc="value.fnc"
          :c="props.c"
          :index="index"
          :is="value.component"
        />
      </v-list>
  </v-container>
</template>
  
<style>
#menuScreen {
  padding: 0;
  margin: 0;
}

#buttonList {
  height: 100%;
  padding: 0;
}
</style>