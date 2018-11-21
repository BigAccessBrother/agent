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
import scanWindows from './utils/scanWindows';
import { baseAPIUrl } from './constants';
import POSTResponse from './utils/requests/POSTResponse';

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
    ResponseNegative
  },
  created () {
    console.log('in da create')
    // get scanData
    scanWindows()
    .then(resolve => {
      console.log(resolve)
      this.status = 'sending-request';
      // send scanData
      POSTResponse().then(response => { 
        console.log(response)
        // change UI depending on response
        this.status = response.ok ? 'response-positive' : 'response-negative'
      });
    });
  }
}
</script>
