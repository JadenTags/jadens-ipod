<script setup>
import { computed, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import Toolbar from './Toolbar.vue';
import Controls from './Controls.vue';

defineProps({
    screen1: Object,
    props: Object
});

const curView = ref(true);
const screen2 = shallowRef(null);
var screenHistory = [];

// export default {
//     methods: {
//         getCurScreen() {
//             console.log(this.$refs)
//             return curView.value ? this.$refs.screen1 : this.$refs.screen2;
//         },
//         nextScreen(component, ...binds) {
//             screenHistory.push([Toolbar.data().title.value, {...Controls.data().controls.value}])

//             screen2.value = component;
//             curView.value = false;

//             setTimeout(() => {
//                 Toolbar.data().title.value = component.data().title;
//                 Controls.methods.bind(...binds);
//             }, config.TRANSITION_TIME/3 * 1000);
//         },
//         previousScreen() {
//             if (screenHistory.length == 0) return;

//             curView.value = true;

//             setTimeout(() => {
//                 [Toolbar.data().title.value, Controls.data().controls.value] = screenHistory.pop();
//             }, config.TRANSITION_TIME/2 * 1000);
//         }
//     }
// }
</script>

<template>
    <v-container>
        <Toolbar></Toolbar>
  
        <v-container id="menuContainer">
            <Transition name="display1" class="transition">
                <Component
                    ref="screen1"
                    class="switchableScreen"
                    v-show="curView"
                    v-bind="props"
                    :is="screen1"
                />
            </Transition>
            <Transition name="display2" class="transition">
                <Component
                    ref="screen2"
                    class="switchableScreen"
                    v-show="!curView"
                    :is="screen2"
                />
            </Transition>
        </v-container>
    </v-container>
</template>

<style>
.switchableScreen {
    height: 92% !important;
    width: 100% !important;
}
</style>