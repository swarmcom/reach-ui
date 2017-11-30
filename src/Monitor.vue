<template>
<div v-bind:class="classObject">
  <div class="row">
    <div class="col"><agents></agents></div>
  </div>
  <div class="row">
    <div class="col"><inqueues></inqueues></div>
  </div>
</div>

</template>

<script>
import Agents from '@/Monitor/Agents'
import Inqueues from '@/Monitor/Inqueues'

export default {
  data () {
    return {
    }
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenMonitor"] = this.$agent.vm.isNarrowLayout.monitor
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.monitor,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.monitor
      }
    }
  },
  components: {
    'agents': Agents,
    'inqueues': Inqueues
  }
}
</script>
