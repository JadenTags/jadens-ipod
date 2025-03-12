<script setup>
const props = defineProps({
  message: String,
});
</script>

<template>
    <v-container id="messageContainer">
        <p id="text">
            {{ message }}
        </p>
    </v-container>
</template>

<style>
#messageContainer {
    padding: 0;
    background-color: white;
    height: 100%;
    width: 100%;
}

#text {
    font-family: HelveticaNeueBold;
    text-transform: none;
    font-size: min(3vw, 2vh);
    text-align: center;
}
</style>