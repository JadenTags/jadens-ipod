<script setup>
import { ref } from 'vue';

const props = defineProps({
    data: Object,
    index: Number,
    c: Number
});

const newProps = ref({
    name: null,
    owner: null,
    fnc: null,
    img: null
});

function fillProps() {
    let type = props.data.type;

    if (type == 'playlist') {
        newProps.value = {
            name: props.data.name,
            owner: props.data.owner.display_name,
            fnc: () => {}, //TODO: THIS
            img: props.data.images[0].url
        }
    }
} 

fillProps();
</script>

<template>
    <v-btn
        class="playlistButton rounded-0"
        :class="{ highlightedButton: props.c == props.index }" 
        @click="newProps.fnc"
        :ripple="false" 
        :id="newProps.name + 'Button'"
        block
    >
        <img :src="newProps.img" class="playlistImage"/>
        <p class="playlistText">{{ newProps.name }}</p>
        <p v-if="newProps.owner" class="playlistOwnerText">{{ newProps.owner }}</p>
        <img v-if="props.c == props.index" src="@/assets/selectedIcon.png" class="playlistMarker"/>
    </v-btn>
</template>