<script setup>
const props = defineProps({
  buttons: Object,
  c: Object
});

defineExpose({
  clickCurrent: () => {
    Object.values(props.buttons.value)[props.c.value].fnc();
  },
  cycle: (up) => {
    var len = Object.values(props.buttons.value).filter((val) => {return val.component.__name != 'ConditionalButton' || val.props.condition()}).length;

    if (up && len-1 > props.c.value) {
      props.c.value += 1;
    } else if (!up && props.c.value > 0) {
      props.c.value -= 1;
    }
  }
})
</script>

<template>
  <v-container id="menuScreen">
    <component 
      v-for="(value, name, index) in props.buttons.value" 
      @mouseenter="props.c.value = index"
      v-bind="value.props"
      :name="name"
      :fnc="value.fnc"
      :c="props.c"
      :index="index"
      :is="value.component"
    />
  </v-container>
</template>
  
<style>
#menuScreen {
  height: 100%;
  padding: 0;
  background-color: white;
}
</style>