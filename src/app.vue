<template>
  <div>
    <h2>BAB Agent</h2>
    <!-- <div class="text-center"> {{status}} </div> -->
    <component v-bind:is="status"></component>
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
       status: 'collecting-data'
    }
  },
  components: {
    CollectingData,
    SendingRequest,
    ResponsePositive,
    ResponseNegative,
    AgentRegistration
  },
  created () {
    console.log('in da create')
    // get scanData
    scanWindows()
    .then(data => {
      console.log(data)
      this.status = 'sending-request';
      // send scanData
      // makeRequest('response/', 'POST', data).then(response => {
      //   console.log('in da makeRequest', response)
      //   this.status = response.ok ? 'response-positive' : 'response-negative'
      // })
      makeRequest('home/').then(response => { 
        console.log(response)
        // change UI depending on response
        this.status = response.ok ? 'response-positive' : 'response-negative'
      });
    });
  }
}
</script>
