<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentInfo" class="mt-2">
    <div class="row agent-state-text"><b>Agent:</b></div>
    <div class="row">
      <div class="col-5 agent-state-text">Name:</div>
      <div class="col-7 agent-state-text"> {{agent.name}} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Login:</div>
      <div class="col-7 agent-state-text"> {{agent.login}} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Caller Id:</div>
      <div class="col-7 agent-state-text"> {{ agent.caller_id_number || '&nbsp' }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Caller Uri:</div>
      <div class="col-7 agent-state-text"> {{ agent.uri || '&nbsp' }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Permissions:</div>
      <div class="col-7 agent-state-text"> {{ agent.permissions }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Persistent:</div>
      <div class="col-7 agent-state-text"> {{ agent.persistent || '&nbsp' }} </div>
    </div>

    <div class="row col-5 agent-state-text">Skills:</div>
    <div class="row" v-for="(v, k) in agent.skills">
      <dd class="col-5 agent-state-text"></dd>
      <dd class="col-7 agent-state-text">{{ k }}</dd>
    </div>
  </b-collapse>
</div>
</template>

<script>
import Skills from '../Widget/Skills.vue'
import ToggleBar from '../Widget/ToggleBar'
export default {
  widgetName: 'MY PROFILE',
  storageName: 'agentInfo',
  data () {
    return {
      agent: this.$agent.vm.agent,
      showCollapse: true
    }
  },
  created () {
    if (this.$agent.vm.storage_data.agentInfoCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.agentInfoCollapsed
  },
  components: {
    toggleBar: ToggleBar,
  }
}
</script>
