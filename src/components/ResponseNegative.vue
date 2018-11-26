<template>
    <div class="negative">
        <br>
        <img
            src="./assets/icons/cancel.png"
            alt="danger"
        >
        <div>BIG DANGER!</div>
        <div class="negative-content">
            detail:
            <div 
                v-for="(value, key) in report"
                :key="key"
            >   
                {{key}} {{value}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'response-negative',
        props: ['report']
    }
</script>