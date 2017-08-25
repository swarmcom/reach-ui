<template>
<div>
  <div class="row">
    <div class="col"><agents></agents></div>
  </div>
</div>

</template>

<script>
import Agents from './Agents.vue'

export default {
  data () {
    return {
    }
  },
  created () {
    this.agent = this.$parent.agent
  },
  components: {
    'agents': Agents
  }
}
</script>