<template>
    <div>
        <br><br><br>
        <div>
            Something went wrong.
        </div>
        <div>
            Please contact your friendly IT people.
        </div>
        <scan-timer v-on:reset-agent="$emit('reset-agent')"></scan-timer>
    </div>
</template>

<script>
    import ScanTimer from './ScanTimer';
    
    export default {
        name: 'request-error',
        components: {
            ScanTimer
        },
    }
</script>
