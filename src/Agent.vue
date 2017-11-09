<template>
<div>
  <b-row>
    <b-col><session-manager></session-manager></b-col>
  </b-row>
  <b-row>
    <b-col><my-statistics></my-statistics></b-col>
  </b-row>
</div>

</template>

<script>
import SessionManager from './Agent/SessionManager.vue'
import MyStatistics from './Agent/MyStatistics.vue'
export default {
  data () {
    return {
    }
  },
  components: {
    'session-manager': SessionManager,
    'my-statistics': MyStatistics
  }
}
</script>
