<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentInfo" class="mt-2">
    <b-row>
      <b-col cols="4">
        <b-img v-if="agent.avatar" :src="this.$agent.avatar_uri(agent.avatar)" style="width:64px;"/>
        <b-img v-else src='src/assets/default_agent.png' style="width:100%" alt="avatar image"/>
      </b-col>
      <b-col cols="8" class="agent-state-text">
        <b-row>{{agent.name}}</b-row>
        <b-row>{{agent.login}}</b-row>
        <b-row>{{agent.group.name}}</b-row>
      </b-col>
    </b-row>
    <br>
    <b-row>
      <b-col cols="5" class="agent-state-text">SIP Contact:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.uri}}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Role:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.role.name || '&nbsp'}}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Caller Id:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.caller_id_number || '&nbsp' }}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Caller Uri:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.uri || '&nbsp' }}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Skills:</b-col>
      <b-col cols="7" class="agent-state-text">
        <b-row>
          <b-col cols="12" v-for="(v, k, index) in agent.skills" :key="index">{{k}}</b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Storage from '@/Storage'

export default {
  widgetName: 'My Profile',
  name: 'my-profile',
  mixins: [Storage],
  data () {
    return {
      agent: this.$agent.vm.agent,
      showCollapse: true,
    }
  },
  created () {
    this.maybeInitLocal().loadLocal('showCollapse', 'showPermProfile')
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    },
  }
}
</script>