<script setup>
import { ref, shallowRef, computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useSpotifyStore } from '@/stores/spotify';
import iPodView from '@/views/iPodView.vue';
import Controls from '@/components/one-time/Controls.vue';
import Toolbar from '@/components/one-time/Toolbar.vue';
import NowPlayingView from '@/components/screens/NowPlayingScreen.vue';
import MediaScreen from '../screens/MediaScreen.vue';
import SwitchableScreen from './SwitchableScreen.vue';
import PlaylistsScreen from '@/components/screens/dih.vue';
import GeneralMenu from '@/components/menus/GeneralMenu.vue';
import MessageScreen from '@/components/menus/MessageMenu.vue';
import NormalButton from '@/components/buttons/NormalButton.vue';
import ToggleButton from '@/components/buttons/ToggleButton.vue';
import ConditionalButton from '@/components/buttons/ConditionalButton.vue';
import general from '@/general';
import config from '@/const';

const settingsStore = useSettingsStore();
const spotifyStore = useSpotifyStore();

const buttons = {
  'Music': {
    component: NormalButton,
    fnc: () => {nextMenu(GeneralMenu, {
        buttons: shallowRef({
            'Playlists': {
                component: NormalButton,
                fnc: () => {iPodView.methods.nextScreen(MediaScreen, 'Playlists', {getter: async () => {return await spotifyStore.getPlaylists()}}, ['menuButton', () => {iPodView.methods.previousScreen()}], ['counterClockwise', () => {console.log(SwitchableScreen.methods.getCurScreen());SwitchableScreen.data().curScreen.methods.cycle(false)}], ['clockwise', () => {SwitchableScreen.data().curScreen.methods.cycle(true)}], ['okButton', () => {}])}
            },
            'Artists': {
                component: NormalButton,
                fnc: () => {}
            },
            'Albums': {
                component: NormalButton,
                fnc: () => {}
            },
            'Top Songs': {
                component: NormalButton,
                fnc: () => {}
            },
            'Genres': {
                component: NormalButton,
                fnc: () => {}
            },
            'Search': {
                component: NormalButton,
                fnc: () => {}
            }
        }), 
        c: ref(0)
    })}
  },
  'Settings': {
    component: NormalButton,
    fnc: () => {nextMenu(GeneralMenu, {
        buttons: shallowRef({
            'About': {
                component: NormalButton,
                fnc: () => {nextMenu(MessageScreen, {message: 'iPod Spotify Controller by Jaden Tagulinao'}, ['menuButton', () => {previousMenu()}], ['okButton', () => {}])}
            },
            'Shuffle': {
                component: ToggleButton,
                fnc: () => {settingsStore.connected ? settingsStore.toggleShuffle() : null},
                props: {
                status: () => {return settingsStore.shuffleStatus}
                }
            },
            'Repeat': {
                component: ToggleButton,
                fnc: () => {settingsStore.connected ? settingsStore.cycleRepeat() : null},
                props: {
                status: () => {return settingsStore.repeatStatus}
                }
            },
            'Time Range': {
                component: ToggleButton,
                fnc: () => {settingsStore.connected ? settingsStore.cycleTimeRange() : null},
                props: {
                status: () => {return settingsStore.timeRangeStatus}
                }
            },
            // 'Device': {
            //   component: ToggleButton,
            //   fnc: settingsStore.cycleDevice,
            //   props: {
            //     status: () => {return settingsStore.deviceStatus}
            //   }
            // }
        }), 
        c: ref(0)
    })}
  },
  'Now Playing': {
    component: ConditionalButton,
    fnc: () => {iPodView.methods.nextScreen(NowPlayingView, ['menuButton', () => {iPodView.methods.previousScreen()}], ['counterClockwise', () => {}], ['clockwise', () => {}], ['okButton', () => {}])},
    props: {
      condition: () => {return settingsStore.curSong}
    }
  }
}

const menu = {
    name: 'menu',
    self: ref(null),
    component: shallowRef(GeneralMenu),
    props: shallowRef({
        buttons: shallowRef(buttons),
        c: ref(0)
    })
};

const screen = {
    name: 'screen',
    self: ref(null),
    component: shallowRef(null),
    props: shallowRef(null)
};

const curDisplay = shallowRef(menu);
const curDisplaySelf = computed(() => {return curDisplay.value.self.value;});
var cVals = {};
var screenHistory = [];
var inAnimation = false;

document.body.style.setProperty('--transition-time', `${config.TRANSITION_TIME}s`);

async function nextMenu (component, newProps, changeTitle=true, ...newControls) {
    if (inAnimation) return;

    inAnimation = true;
    var props = newProps;

    if (changeTitle) {
        Toolbar.data().title.value = Object.keys(curDisplay.value.props.value.buttons.value)[curDisplay.value.props.value.c.value];
    } if (component.__name == 'GeneralMenu') {
        props.c.value = cVals[Object.keys(curDisplay.value.props.value.buttons.value)[curDisplay.value.props.value.c.value]] || props.c.value;
    } if (curDisplay.value.name != 'menu') {
        [menu.component.value, menu.props.value] = [screen.component.value, screen.props.value];
        document.body.style.setProperty('--transition-time', `0s`);
        curDisplay.value = menu;
        await general.nextFrame()
        document.body.style.setProperty('--transition-time', `${config.TRANSITION_TIME}s`);
    }

    [screen.component.value, screen.props.value] = [component, props];
    curDisplay.value = screen;
    screenHistory.push([menu.component.value, menu.props.value, {...Controls.data().controls.value}]);

    if (newControls.length) {
        Controls.methods.bind(...newControls);
    }

    setTimeout(() => {
        inAnimation = false;
    }, config.TRANSITION_TIME * 1000);
}

async function previousMenu() {
    if (inAnimation || screenHistory.length == 0) return;

    inAnimation = true;

    if (curDisplay.value.component.value.__name == 'GeneralMenu') {
        var temp = curDisplay.value.props.value.c.value;
    } if (curDisplay.value.name != 'screen') {
        [screen.component.value, screen.props.value] = [menu.component.value, menu.props.value];
        document.body.style.setProperty('--transition-time', `0s`);
        curDisplay.value = screen;
        await general.nextFrame()
        document.body.style.setProperty('--transition-time', `${config.TRANSITION_TIME}s`);
    }
        
    [menu.component.value, menu.props.value, Controls.data().controls.value] = screenHistory.pop();
    curDisplay.value = menu;

    if (curDisplay.value.component.value.__name == 'GeneralMenu') {
        cVals[Object.keys(menu.props.value.buttons.value)[menu.props.value.c.value]] = temp;
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

Controls.methods.bind(['okButton', () => {curDisplaySelf.value.clickCurrent()}], [
  'menuButton', () => {previousMenu()}], 
  ['counterClockwise', () => {curDisplaySelf.value.cycle(false)}], 
  ['clockwise', () => {curDisplaySelf.value.cycle(true)}],
  ['ppButton', () => {settingsStore.connected ? settingsStore.play() : null}],
  ['nextButton', () => {settingsStore.connected ? spotifyStore.skipNext() : null}],
  ['prevButton', () => {settingsStore.connected ? spotifyStore.skipPrevious() : null}]
);
</script>

<template>
    <v-container>
      <v-row>
        <v-col>
            <Toolbar></Toolbar>
  
            <v-container id="menuContainer">
                <Transition name="display1" class="transition">
                    <Component
                        class="switchableMenu"
                        v-show="curDisplay.name == 'menu'"
                        :ref="menu.self"
                        v-bind="menu.props.value"
                        :is="menu.component.value"
                    />
                </Transition>
                <Transition name="display2" class="transition">
                    <Component
                        class="switchableMenu"
                        v-show="curDisplay.name == 'screen'"
                        :ref="screen.self"
                        v-bind="screen.props.value"
                        :is="screen.component.value"
                    />
                </Transition>
            </v-container>
        </v-col>
  
        <v-col>
          <img id="screensaver" src="@/assets/screensaver.jpg"/>
        </v-col>
      </v-row>
    </v-container>
</template>
  
<style>
#menuContainer {
  padding: 0;
  height: 92%;
}

.switchableMenu {
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

.display1-leave-active, .display1-enter-active {
   transition: all var(--transition-time);
}
.display1-enter-from, .display1-leave-to {
   transform: translateX(-100%);
}

.display2-leave-active, .display2-enter-active {
   transition: all var(--transition-time);
}
.display2-enter-from, .display2-leave-to {
   transform: translateX(100%);
}

.v-row {
  margin: 0 !important;
  width: 100%;
  height: 100%;
}

.v-col {
  padding: 0 !important;
  height: 100%;
}

#screensaver {
  position: absolute;
  z-index: 1 !important;
  height: 100%;
  width: 50%;
}
</style>
  