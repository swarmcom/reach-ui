<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentInfo" class="mt-2">
    <b-row class="agent-state-text"><b>Agent:</b></b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Name:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.name}} </b-col>
      <b-col cols="5" class="agent-state-text">SIP Contact:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.uri}} </b-col>
      <b-col cols="5" class="agent-state-text">Role:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.role.name || '&nbsp'}} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Login:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.login}} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Caller Id:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.caller_id_number || '&nbsp' }} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Caller Uri:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.uri || '&nbsp' }} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Permissions:</b-col>
      <b-col cols="7" class="agent-state-text">
        <b-row>
          <b-col cols="12" v-for="(v, k, index) in agent.permissions" key="index">{{k}}</b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Persistent:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.persistent || '&nbsp' }} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Profile:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.group.name }} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Skills:</b-col>
      <b-col cols="7" class="agent-state-text">
        <b-row>
          <b-col cols="12" v-for="(v, k, index) in agent.skills" key="index">{{k}}</b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
export default {
  widgetName: 'Current Session',
  storageName: 'currentSession',
  data () {
    return {
      agent: this.$agent.vm.agent,
      showCollapse: true
    }
  },
  created () {
    if (this.$agent.vm.storage_data.currentSessionCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.currentSessionCollapsed
  }
}
</script>
