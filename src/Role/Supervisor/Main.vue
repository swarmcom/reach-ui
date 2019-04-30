<template>
  <div>
    <draggable
      :list="widgets"
      :options="{draggable:'.itemDragable'}"
      @end="onDragEnd"
    >
      <b-row
        v-for="(item, index) in widgets"
        :key="index"
        class="itemDragable"
      >
        <b-col>
          <component
            :is="item"
            v-if="showWidget(item)"
          />
        </b-col>
      </b-row>
    </draggable>
  </div>
</template>

<script>
import SessionManager from '@/Agent/SessionManager'
import Stats from '@/Agent/Stats'
import AgentsManager from '@/Agent/AgentsManager'
import InboundsManager from '@/Agent/InboundsManager'
import draggable from 'vuedraggable'

export default {
  components: {
    'session-manager': SessionManager,
    'my-statistics': Stats,
    'agents': AgentsManager,
    'inqueues': InboundsManager,
    draggable
  },
  data () {
    return {
      widgets: []
    }
  },
  created () {
    if (this.$agent.vm.storage_data.agentWidgets != undefined) {
      this.widgets = this.$agent.vm.storage_data.agentWidgets
    }
    else
      this.widgets = ['session-manager', 'my-statistics', 'agents', 'inqueues']
  },
  methods: {
    showWidget(name) {
      if (name === 'session-manager') {
        return true
      }
      else if (name === 'my-statistics' && this.$agent.vm.layoutSM.isActiveMS && this.$agent.permAllowed('widget-my-statistics')) {
        return true
      }
      else if (name === 'agents' && this.$agent.vm.layoutSM.isActiveAM  && this.$agent.permAllowed('widget-agent-manager')) {
        return true
      }
      else if (name === 'inqueues' && this.$agent.vm.layoutSM.isActiveQM  && this.$agent.permAllowed('widget-queue-manager')) {
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
  }
}
</script>
