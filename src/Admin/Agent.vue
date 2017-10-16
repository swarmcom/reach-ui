<template>
<div class="form">
  <form-text label="Name" v-model="agent.name"></form-text>
  <form-text label="Login" v-model="agent.login"></form-text>
  <form-text label="Password" v-model="agent.password"></form-text>
  <agent-groups label="Group" v-model="agent.group_id"></agent-groups>
  <release-groups label="Release Group" v-model="agent.release_group_id"></release-groups>
  <lines label="Line Out" v-model="agent.line_id"></lines>
  <form-text label="Permissions" v-model="agent.permissions"></form-text>
  <form-text label="SIP URI" v-model="agent.uri"></form-text>
  <form-text label="Caller Id Number" v-model="agent.caller_id_number"></form-text>
  <form-text label="Ring timeout" v-model="agent.ring_timeout"></form-text>
  <form-text label="Max number of unanswered calls before unavailable" v-model="agent.max_ring_fails"></form-text>
  <form-text label="Suspend time" v-model="agent.suspend_time"></form-text>
  <form-text label="Auto logout" v-model="agent.autologout"></form-text>
  <form-bool label="Persistent" v-model="agent.persistent"></form-bool>
  <form-bool label="Reset max rings on success" v-model="agent.reset_max_rings_fails"></form-bool>
  <skills label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Common from './Common'

export default {
  name: 'admin-agent',
  mixins: [Common],
  props: ['id'],
  data () {
    return {
      agent: {},
      skills: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.agent = await this.$agent.p_mfa('ws_db_agent', 'get', [this.id])
        this.skills = this.object2list(this.agent.skills)
      }
    },
    onCommit: async function () {
      this.agent.skills = this.list2object(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_agent', 'update', [this.id, this.agent])
        } else {
          await this.$agent.p_mfa('ws_db_agent', 'create', [this.agent])
        }
        this.$router.push('/admin/agents')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_agent', 'delete', [this.id])
        this.$router.push('/admin/agents')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
