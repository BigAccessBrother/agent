<template>
    <div class="positive">
        <br>
        <img 
            src="./assets/icons/checkbox-marked-circle-outline.png"
            alt="check"
        >
        <div>you are good to go!</div>
        <scan-timer v-on:reset-agent="$emit('reset-agent')"></scan-timer>
    </div>
</template>

<script>
    import ScanTimer from './ScanTimer';
    
    export default {
        name: 'response-positive',
        components: {
            ScanTimer
        },
    }
</script>