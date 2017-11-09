<template>
<div>
  <b-row>
    <b-col><session-manager></session-manager></b-col>
  </b-row>
</div>

</template>

<script>
import SessionManager from './Agent/SessionManager.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    'session-manager': SessionManager
  }
}
</script>
