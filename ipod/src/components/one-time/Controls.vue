<script>
import { ref } from 'vue';

const MOVEMENT_DEADZONE = Math.PI/8;
const controls = ref({
    menuButtonFunc: () => {},
    nextButtonFunc: () => {},
    ppButtonFunc: () => {},
    prevButtonFunc: () => {},
    okButtonFunc: () => {},
    clockwiseFunc: () => {},
    counterClockwiseFunc: () => {}
});
const okButtonHovered = ref(false);
const mouseDown = ref(false);
var moved = false;
var lastPosition = null;
var checkMovementCounter = 0;

function getAngle(event) {
    const num = event.srcElement.clientWidth/2;
    let angle = Math.atan2((-event.offsetY + num), (event.offsetX - num));

    if (angle < 0) {
        angle += 2*Math.PI;
    }

    return angle;
}

export default {
    data() {
        return {
            mouseDown,
            okButtonHovered,
            controls
        }
    },
    methods: {
        bind(...binds) {
            for (const [control, func] of binds) {
                controls.value[control + 'Func'] = func;
            }
        },
        checkPressed(event) {
            if (!moved && !okButtonHovered.value) {
                var angle = getAngle(event);
                
                if (angle < Math.PI*(1/4) || angle > Math.PI*(7/4)) {
                    controls.value.nextButtonFunc();
                } else if (angle < Math.PI*(3/4)) {
                    controls.value.menuButtonFunc();
                } else if (angle < Math.PI*(5/4)) {
                    controls.value.prevButtonFunc();
                } else {
                    controls.value.ppButtonFunc();
                }
            }

            moved = false;
        },
        okPressed() {
            controls.value.okButtonFunc();
        },
        checkMovement(event) {
            if (!okButtonHovered.value && mouseDown.value) {
                const angle = getAngle(event);
                let temp = checkMovementCounter;
                moved = true;

                if (lastPosition != null && Math.abs(angle - lastPosition) < 2 * Math.PI - 0.1) {
                    checkMovementCounter += angle - lastPosition;
                }

                lastPosition = angle;

                if (Math.abs(checkMovementCounter) + 0.02 < Math.abs(temp)) {
                    this.resetMovement();
                }

                if (checkMovementCounter >= MOVEMENT_DEADZONE) {
                    controls.value.counterClockwiseFunc();
                    checkMovementCounter = 0;
                } else if (checkMovementCounter <= -MOVEMENT_DEADZONE) {
                    controls.value.clockwiseFunc();
                    checkMovementCounter = 0;
                }

            }
        },
        resetMovement() {
            lastPosition = null;
            checkMovementCounter = 0;
        }
    }
}
</script>

<template>
    <v-container @mousemove="checkMovement($event)" @mouseleave="resetMovement(); mouseDown = false;" @mousedown="mouseDown = true" @mouseup="checkPressed($event); resetMovement(); mouseDown = false;">
        <v-container @click.stop="okPressed()" @mouseenter="resetMovement(); mouseDown = false; okButtonHovered = true" @mouseleave="okButtonHovered = false" id="okButton"></v-container>
    </v-container>
</template>

<style scoped>
#okButton {
    margin-top: 32.3%;
    margin-left: 32.3%;
    height: 36%;
    width: 36%;
    border-radius: 100%;
}
</style>