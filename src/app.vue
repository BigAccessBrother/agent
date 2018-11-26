<template>
  <div>
    <h2>BAB Agent</h2>
    <component 
      v-bind:is="status"
      v-on:register-agent="register"
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
       status: 'response-negative',
       report: {
         key1: "is one",
         key2: "is two"
       },
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
    register () {
      scanWindosAndPost(this)
    }
  },
  // created () {
  //   scanWindosAndPost(this)
  // }
}
</script>
