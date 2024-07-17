<template>
    <div id="wrapper">
        <iframe id="monitor" ref="frame1" :src="'/crisp.html'"></iframe>
    </div>
</template>

<script lang="ts">
    import { ref, reactive } from 'vue'
    export default {
        setup(props, context) {
            const name = "test";
            return {
                name
            }
        }
    }
</script>

<style scoped>
    #wrapper, iframe {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        border: none;
    }
    * {
        padding: 0;
        margin: 0;
    }
</style>