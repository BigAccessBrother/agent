<template>
    <div>
        <div>One time registration.</div>
        <div>Please enter your email and password</div>
        <input type="text" placeholder="email" v-model="email">
        <input type="password" placeholder="password" v-model="password">
        <button v-on:click="register">register agent</button>
        <div class="AgentRegistration-error">{{ message }}</div>
    </div>
</template>

<script>
    import { makeRequest } from '../utils/requests';

    export default {
        name: 'agent-registration',
        props: ['number'],
        data () {
            return {
                message: ''
            }
        },
        methods: {
            register () {
                const body = {
                    email: this.email,
                    password: this.password,
                    system_serial_number: this.number
                }
                console.log('register body: ', body);
                makeRequest('agent/register/', 'POST', body)
                .then(response => {
                        if (response.ok) {
                            this.$emit('register-agent')
                        } else {
                            this.email = '';
                            this.password = '';
                            this.message = `registration failed (${response.status})`;
                            console.log(response)
                        }
                    }    
                )
            }
        }

    }
</script>