<template>
  <div>
    <h2>BAB Agent</h2>
    <!-- <div class="text-center"> {{status}} </div> -->
    <component 
      v-bind:is="status"
      v-on:register-agent="register"
      :number="number"
    ></component>
  </div>
</template>

<script>
import CollectingData from './components/CollectingData';
import SendingRequest from './components/SendingRequest';
import ResponsePositive from './components/ResponsePositive';
import ResponseNegative from './components/ResponseNegative';
import AgentRegistration from './components/AgentRegistration';
import scanWindows from './utils/scanWindows';
import { makeRequest } from './utils/requests';

export default {
  el: '#app',
  name: 'app',
  data () {
    return {
       status: 'collecting-data',
    }
  },
  components: {
    CollectingData,
    SendingRequest,
    ResponsePositive,
    ResponseNegative,
    AgentRegistration
  },
  methods: {
    register () {
      console.log('In da app.vue after successful registration. Should scan again now!');
    }
  },
  created () {
    // get scanData
    scanWindows()
    .then(data => {
      console.log('scan successful', data)
      this.status = 'sending-request';
      this.number = data.system_serial_number;
      // send scanData
      makeRequest('response/', 'POST', data).then(response => {
        console.log('posted agent response', response)
        this.status = response.ok ? 'response-positive' : 'agent-registration'
      })
      // makeRequest('home/asdasd').then(response => { 
      //   console.log(response)
      //   // change UI depending on response
      //   this.status = response.ok ? 'response-positive' : 'agent-registration'
      // });
    });
  }
}
</script>
