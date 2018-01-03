<template>
<div v-bind:class="classObject">
  <draggable :list="widgets" :options="{draggable:'.itemDragable'}" @end="onDragEnd">
    <b-row v-for="(item, index) in widgets" :key="index" class="itemDragable">
      <b-col>
        <component v-if="showWidget(item)" v-bind:is="item" />
      </b-col>
    </b-row>
  </draggable>
</div>

</template>

<script>
import SessionManager from '@/Agent/SessionManager.vue'
import MyStatistics from '@/Agent/MyStatistics.vue'
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
    showWidget(name) {
      if (name === 'session-manager')
        return true
      else if (name === 'my-statistics' && this.$agent.vm.layoutSM.isActiveMS)
        return true
      else if (name === 'agents' && this.$agent.vm.layoutSM.isActiveAM && (this.$agent.vm.agent.permissions['admin-ui'] ||
        this.$agent.vm.agent.permissions['supervisor-ui']))
        return true
      else if (name === 'inqueues' && this.$agent.vm.layoutSM.isActiveQM && (this.$agent.vm.agent.permissions['admin-ui'] ||
        this.$agent.vm.agent.permissions['supervisor-ui']))
        return true
      else
        return false
    },
    onDragEnd () {
      this.$agent.vm.storage_data["agentWidgets"] = this.widgets
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    }
  },
  created () {
    if (this.$agent.vm.storage_data.agentWidgets != undefined)
      this.widgets = this.$agent.vm.storage_data.agentWidgets
    else
      this.widgets = ['session-manager', 'my-statistics', 'agents', 'inqueues']
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenMain"] = this.$agent.vm.isNarrowLayout.main
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.main,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.main
      }
    }
  },
  components: {
    'session-manager': SessionManager,
    'my-statistics': MyStatistics,
    'agents': Agents,
    'inqueues': Inqueues,
    draggable
  }
}
</script>
