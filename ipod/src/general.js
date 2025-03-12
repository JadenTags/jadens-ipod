import { nextTick } from "vue";

export default {
    async nextFrame() {
        return new Promise(async (resolve) => {
            await nextTick();
            requestAnimationFrame(() => {requestAnimationFrame(resolve)});
        });
    },
    msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        if (secs < 10) secs = '0' + secs;
      
        return mins + ':' + secs;
    }
}