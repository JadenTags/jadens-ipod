<script setup>
defineProps({
  message: String
});
</script>

<template>
    <v-container id="messageContainer">
        {{ message }}
    </v-container>
</template>

<style>
#messageContainer {
    background-color: white;
    font-family: HelveticaNeueBold;
    font-size: min(3vw, 2vh);
    text-align: center;
}
</style>