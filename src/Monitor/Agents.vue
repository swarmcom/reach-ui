<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2">
    <agentProfiles></agentProfiles>
    <agentMonitor></agentMonitor>
  </b-collapse>
</div>
</template>

<script>
import ToggleBar from '../Widget/ToggleBar'
import AgentProfiles from './Widget/AgentProfiles'
import AgentMonitor from './Widget/AgentMonitor'
export default {
  name: 'monitor-agents',
  storageName: 'agentManager',
  widgetName: 'AGENT MANAGER',
  data () {
    return {
      showCollapse: true
    }
  },
  components: {
    toggleBar: ToggleBar,
    agentProfiles: AgentProfiles,
    agentMonitor: AgentMonitor
  }
}
</script>
