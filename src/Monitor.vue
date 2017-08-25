<template>
<div>
  <div class="row">
    <div class="col"><agents></agents></div>
  </div>
  <div class="row">
    <div class="col"><inqueues></inqueues></div>
  </div>
</div>

</template>

<script>
import Agents from './Agents.vue'
import Inqueues from './Inqueues.vue'

export default {
  data () {
    return {
    }
  },
  created () {
    this.agent = this.$parent.agent
  },
  components: {
    'agents': Agents,
    'inqueues': Inqueues
  }
}
</script>