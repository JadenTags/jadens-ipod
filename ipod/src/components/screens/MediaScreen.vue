<script setup>
import { ref } from 'vue';
import { useSpotifyStore } from '@/stores/spotify';
import Toolbar from '@/components/one-time/Toolbar.vue';
import MediaButton from '../buttons/MediaButton.vue';

const { getter } = defineProps({
    getter: Function
});

const list = ref(null);
const c = ref(0);


async function fillList() {
    list.value = await getter();
}

fillList();
</script>

<template>
    <v-container>
        <MediaButton
            v-for="(media, index) in list"
            @mouseenter="c = index"
            :data="media"
            :index="index"
            :c="c"
        />
    </v-container>
</template>