<script setup>
import { ref, shallowRef, computed, nextTick } from 'vue';
import general from '@/general';
import config from '@/const';
import Controls from './Controls.vue';
import Toolbar from './Toolbar.vue';

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

document.body.style.setProperty('--transition-time', `${config.TRANSITION_TIME}s`);

defineExpose({
    curScreen,
    curScreenRef,
    async nextScreen (component, newProps, changeTitle=true, ...newControls) {
        if (inAnimation) return;

        inAnimation = true;
        var props = newProps;

        if (changeTitle) {
            Toolbar.data().title.value = Object.keys(curScreen.value.props.value.buttons.value)[curScreen.value.props.value.c.value];
        } if (component.__name == 'GeneralMenu') {
            props.c.value = cVals[Object.keys(curScreen.value.props.value.buttons.value)[curScreen.value.props.value.c.value]] || props.c.value;
        } if (curScreen.value.name != 'screen1') {
            [screen1.component.value, screen1.props.value] = [screen2.component.value, screen2.props.value];
            document.body.style.setProperty('--transition-time', `0s`);
            curScreen.value = screen1;
            await general.nextFrame()
            document.body.style.setProperty('--transition-time', `${config.TRANSITION_TIME}s`);
        }

        [screen2.component.value, screen2.props.value] = [component, props];
        curScreen.value = screen2;
        screenHistory.push([screen1.component.value, screen1.props.value, {...Controls.data().controls.value}]);

        if (newControls.length) {
            Controls.methods.bind(...newControls);
        }

        setTimeout(() => {
            inAnimation = false;
        }, config.TRANSITION_TIME * 1000);
    },
    async previousScreen() {
        if (inAnimation || screenHistory.length == 0) return;

        inAnimation = true;

        if (curScreen.value.component.value.__name == 'GeneralMenu') {
            var temp = curScreen.value.props.value.c.value;
        } if (curScreen.value.name != 'screen2') {
            [screen2.component.value, screen2.props.value] = [screen1.component.value, screen1.props.value];
            document.body.style.setProperty('--transition-time', `0s`);
            curScreen.value = screen2;
            await general.nextFrame()
            document.body.style.setProperty('--transition-time', `${config.TRANSITION_TIME}s`);
        }
            
        [screen1.component.value, screen1.props.value, Controls.data().controls.value] = screenHistory.pop();
        curScreen.value = screen1;

        if (component.__name == 'GeneralMenu') {
            cVals[Object.keys(screen1.props.value.buttons.value)[screen1.props.value.c.value]] = temp;
        } if (screenHistory.length == 0) {
            Toolbar.data().title.value = 'iPod';
        } else {
            const lastProps = screenHistory[screenHistory.length-1][1];
            Toolbar.data().title.value = Object.keys(lastProps.buttons.value)[lastProps.c.value];
        }

        setTimeout(() => {
            inAnimation = false;
        }, config.TRANSITION_TIME * 1000);
    }
});
</script>

<template>
  <v-container id="menuContainer">
    <Transition name="screen1" class="transition">
        <Component
            class="switchableScreen"
            v-show="curScreen.name == 'screen1'"
            :ref="screen1.self"
            v-bind="screen1.props.value"
            :is="screen1.component.value"
        />
    </Transition>
    <Transition name="screen2" class="transition">
        <Component
            class="switchableScreen"
            v-show="curScreen.name == 'screen2'"
            :ref="screen2.self"
            v-bind="screen2.props.value"
            :is="screen2.component.value"
        />
    </Transition>
  </v-container>
</template>
  
<style>
#menuContainer {
  padding: 0;
  height: 92%;
}

.switchableScreen {
    height: 92% !important;
    width: 50% !important;
}

.transition {
    position: absolute;
    padding: 0 !important;
    margin: 0;
    height: 100%;
    width: 100%;
}

.screen1-leave-active, .screen1-enter-active {
   transition: all var(--transition-time);
}
.screen1-enter-from, .screen1-leave-to {
   transform: translateX(-100%);
}

.screen2-leave-active, .screen2-enter-active {
   transition: all var(--transition-time);
}
.screen2-enter-from, .screen2-leave-to {
   transform: translateX(100%);
}
</style>
  