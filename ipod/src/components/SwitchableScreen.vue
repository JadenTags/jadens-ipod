<script setup>
import { ref, shallowRef, computed } from 'vue';
import Controls from './Controls.vue';
import Toolbar from './Toolbar.vue';
import config from '@/const';

const { component, props } = defineProps({
    component: Object,
    props: Object
});

const screen1 = {
    name: 'screen1',
    self: ref(null),
    component: shallowRef(component),
    props: shallowRef(props)
};

const screen2 = {
    name: 'screen2',
    self: ref(null),
    component: shallowRef(null),
    props: shallowRef(null)
};

const curScreen = shallowRef(screen1);
var curScreenRef = computed(() => {return curScreen.value.self.value;});
var cVals = {};
var screenHistory = [];
var inAnimation = false;

defineExpose({
    curScreen,
    curScreenRef,
    nextScreen (component, newProps, ...newControls) {
        if (inAnimation) return;

        inAnimation = true;
        const elem = document.getElementById('menuContainer');
        var props = newProps;

        Toolbar.data().title.value = Object.keys(curScreen.value.props.value.buttons.value)[curScreen.value.props.value.c.value];

        if (curScreen.value.name != 'screen1') {
            [screen1.component.value, screen1.props.value] = [screen2.component.value, screen2.props.value];
            curScreen.value = screen1;
            elem.style.transform = 'translateX(0%)';

            setTimeout(() => {
                elem.style.transition = `transform ${config.TRANSITION_TIME}s ease`;
                elem.style.transform = 'translateX(-50%)';
            }, 0);
        } else {
            elem.style.transition = `transform ${config.TRANSITION_TIME}s ease`;
            elem.style.transform = 'translateX(-50%)';
        }

        if (component.__name == 'GeneralMenu') {
            props.c.value = cVals[Object.keys(curScreen.value.props.value.buttons.value)[curScreen.value.props.value.c.value]] || props.c.value;
        }
        
        [screen2.component.value, screen2.props.value] = [component, props];
        screenHistory.push([screen1.component.value, screen1.props.value, {...Controls.data().controls.value}]);
        curScreen.value = screen2;

        if (newControls.length) {
            Controls.methods.bind(...newControls);
        }

        setTimeout(() => {
            elem.style.transition = 'none';
            inAnimation = false;
        }, config.TRANSITION_TIME * 1000);
    },
    previousScreen() {
        if (inAnimation) return;

        inAnimation = true;
        const elem = document.getElementById('menuContainer');
        var notScreen = curScreen.value.name != 'screen2';

        if (screenHistory.length == 0) return;

        if (curScreen.value.component.value.__name == 'GeneralMenu') {
            var temp = curScreen.value.props.value.c.value;
        }
        curScreen.value = screen2;

        if (notScreen) {
            [screen2.component.value, screen2.props.value] = [screen1.component.value, screen1.props.value];
            elem.style.transform = 'translateX(-50%)';
        }

        [screen1.component.value, screen1.props.value, Controls.data().controls.value] = screenHistory.pop();

        if (notScreen) {
            setTimeout(() => {
                elem.style.transition = `transform ${config.TRANSITION_TIME}s ease`;
                elem.style.transform = 'translateX(0%)';
            }, 0);
        } else {
            elem.style.transition = `transform ${config.TRANSITION_TIME}s ease`;
            elem.style.transform = 'translateX(0%)';
        }

        if (component.__name == 'GeneralMenu') {
            cVals[Object.keys(screen1.props.value.buttons.value)[screen1.props.value.c.value]] = temp;
        }
        curScreen.value = screen1;

        if (screenHistory.length == 0) {
            Toolbar.data().title.value = 'iPod';
        } else {
            const lastProps = screenHistory[screenHistory.length-1][1];
            Toolbar.data().title.value = Object.keys(lastProps.buttons.value)[lastProps.c.value];
        }

        setTimeout(() => {
            elem.style.transition = 'none';
            inAnimation = false;
        }, config.TRANSITION_TIME * 1000);
    }
});
</script>

<template>
  <v-container id="menuContainer">
    <Component
        :ref="screen1.self"
        v-bind="screen1.props.value"
        :is="screen1.component.value"
    />
    <Component
        v-if="screen2.component.value"
        :ref="screen2.self"
        v-bind="screen2.props.value"
        :is="screen2.component.value"
    />
  </v-container>
</template>
  
<style>
#menuContainer {
  padding: 0;
  height: 92%;
  width: 200%;
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px;
}
</style>
  