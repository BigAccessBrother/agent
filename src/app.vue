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
import scanWindows from './utils/scanWindows';

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
    SendingRequest
  },
  created () {
    console.log('in da create')
    scanWindows()
    .then(resolve => {
      console.log(resolve)
      this.status = 'sending-request';
    });
  }
}
</script>
