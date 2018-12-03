<template>
    <div class="scan-timer">
        next scan in {{formatTime(timer)}}
    </div>
</template>

<script>
export default {
    name: 'scan-timer',
    data () {
        return {
            timer: 7200,
        }
    },
    created () {
        const time = setInterval(
            () => { 
                this.timer--;
                if (this.timer === 0) {
                    clearInterval(time)
                    this.$emit('reset-agent')
                } 
            },
            1000
        )
    },
    methods: {
        formatTime (timer) {
            const h = Math.floor(timer / 3600);
            const m = Math.floor(timer % 3600 / 60);
            const s = timer % 60;
            return `${ h ? `${h}:` : null}` + `${m > 9 ? m : `0${m}`}:${s > 9 ? s : `0${s}`}`
        }
    }
}
</script>