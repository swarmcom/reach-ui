<template>
<div v-access:supervisor-ui v-bind:class="classObject">
  <draggable :list="widgets" :options="{draggable:'.itemDragable'}" @end="onDragEnd">
    <b-row v-for="(item, index) in widgets" :key="index" class="itemDragable">
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
      widgets: []
    }
  },
  methods: {
    onDragEnd () {
      this.$agent.vm.storage_data["monitorWidgets"] = this.widgets
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    }
  },
  created () {
    if (this.$agent.vm.storage_data.monitorWidgets != undefined)
      this.widgets = this.$agent.vm.storage_data.monitorWidgets
    else
      this.widgets = ['agents', 'inqueues']
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
