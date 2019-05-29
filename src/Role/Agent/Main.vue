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
import CallDetails from '@/Agent/CallDetails'
import draggable from 'vuedraggable'

export default {
  components: {
    'session-manager': SessionManager,
    'my-statistics': Stats,
    'call-details': CallDetails,
    draggable
  },
  data () {
    return {
      widgets: []
    }
  },
  created () {
    if (this.$agent.vm.storage_data.agentWidgets != undefined && this.$agent.vm.storage_data.agentWidgets.length === 3)
      this.widgets = this.$agent.vm.storage_data.agentWidgets
    else
      this.widgets = ['session-manager', 'call-details', 'my-statistics']
  },
  methods: {
    showWidget(name) {
      if (name === 'session-manager') {
        return true
      }
      else if (name === 'call-details' && this.$agent.vm.layoutSM.isActiveCD &&
        this.$agent.permAllowed('widget-call-details')) {
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
  }
}
</script>
