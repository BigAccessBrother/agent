<template>
    <div class="negative">
        <br>
        <img
            src="./assets/icons/cancel.png"
            alt="danger"
        >
        <div>BIG DANGER!</div>
        <div style="font-size: 80%">
            (an admin will contact you)
        </div>
        <div class="negative-content">
            <h4>BAB security report:</h4>
            <li 
                v-for="(value, key) in report"
                :key="key"
            >   
                {{key}} {{value}}
            </li>
        </div>
        <scan-timer v-on:reset-agent="$emit('reset-agent')"></scan-timer>
    </div>
</template>

<script>
    import ScanTimer from './ScanTimer';

    export default {
        name: 'response-negative',
        props: ['report'],
        components: {
            ScanTimer
        },
    }
</script>