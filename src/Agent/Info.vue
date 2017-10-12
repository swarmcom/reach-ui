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
      <div class="col-5 agent-state-text">Group:</div>
      <div class="col-7 agent-state-text"> {{ agent.group.name || '&nbsp' }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Permissions:</div>
      <div class="col-7 agent-state-text"> {{ agent.permissions }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Line Out:</div>
      <div class="col-7 agent-state-text"> {{ agent.line.name || '&nbsp' }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Caller Id:</div>
      <div class="col-7 agent-state-text"> {{ agent.caller_id_number || '&nbsp' }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Ring timeout:</div>
      <div class="col-7 agent-state-text"> {{ agent.ring_timeout || '&nbsp' }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Max rings:</div>
      <div class="col-7 agent-state-text"> {{ agent.max_ring_fails || '&nbsp' }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Auto logout:</div>
      <div class="col-7 agent-state-text"> {{ agent.autologout || '&nbsp' }} </div>
    </div>

    <div class="row agent-state-text"><b>Skills:</b></div>
    <div class="row" v-for="(v, k) in agent.skills">
      <dd class="col-5 agent-state-text">{{ k }}:</dd>
      <dd class="col-7 agent-state-text">{{ v }}</dd>
    </div>
  </b-collapse>
</div>
</template>

<script>
import Skills from '../Widget/Skills.vue'
import ToggleBar from '../Widget/ToggleBar'
export default {
  widgetName: 'MY PROFILE',
  name: 'agent-info',
  data () {
    return {
      agent: this.$agent.vm.agent,
      showCollapse: true
    }
  },
  components: {
    toggleBar: ToggleBar,
  }
}
</script>
