C<template>
<div v-access:main-ui>
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
import draggable from 'vuedraggable'

export default {
  data () {
    return {
      widgets: []
    }
  },
  methods: {
    showWidget(name) {
      if (name === 'session-manager') {
        return true
      }
      else if (name === 'my-statistics' && this.$agent.vm.layoutSM.isActiveMS && 
        this.$agent.permAllowed('widget-my-statistics')) {
        return true
      }
      else {
        return false
      }
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
      this.widgets = ['session-manager', 'my-statistics']
  },
  components: {
    'session-manager': SessionManager,
    'my-statistics': MyStatistics,
    draggable
  }
}
</script>
