<template>
  <div>
    <h2>BAB Agent</h2>
    <component 
      v-bind:is="status"
      v-on:reset-agent="reset"
      :number="number"
      :report="report"
    ></component>
  </div>
</template>

<script>
import CollectingData from './components/CollectingData';
import SendingRequest from './components/SendingRequest';
import ResponsePositive from './components/ResponsePositive';
import ResponseNegative from './components/ResponseNegative';
import AgentRegistration from './components/AgentRegistration';
import RequestError from './components/RequestError';
import scanWindows from './utils/scanWindows';
import { makeRequest } from './utils/requests';
import scanWindosAndPost from './utils/requests/scanWindowsAndPost';

export default {
  el: '#app',
  name: 'app',
  data () {
    return {
       status: 'collecting-data',
       report: {},
    }
  },
  components: {
    CollectingData,
    SendingRequest,
    ResponsePositive,
    ResponseNegative,
    AgentRegistration,
    RequestError
  },
  methods: {
    reset () {
      scanWindosAndPost(this)
    }
  },
  created () {
    scanWindosAndPost(this)
  }
}
</script>
