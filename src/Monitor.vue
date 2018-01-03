<template>
<div v-bind:class="classObject">
  <draggable :list="widgets">
    <b-row v-for="(item, index) in widgets" :key="index">
      <b-col>
        <component v-bind:is="item"/>
      </b-col>
    </b-row>
  </draggable>
</div>

</template>

<script>
import Agents from '@/Monitor/Agents'
import Inqueues from '@/Monitor/Inqueues'
import draggable from 'vuedraggable'

export default {
  data () {
    return {
      widgets: ['agents', 'inqueues']
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
    'inqueues': Inqueues,
    draggable
  }
}
</script>
