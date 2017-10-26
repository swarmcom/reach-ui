<template>
<div class="form">
  <form-text label="Name" v-model="rec.name"></form-text>
  <form-text label="Login" v-model="rec.login"></form-text>
  <form-text label="Password" v-model="rec.password"></form-text>
  <agent-groups label="Group" v-model="rec.group_id"></agent-groups>
  <release-groups label="Release Group" v-model="rec.release_group_id"></release-groups>
  <lines label="Line Out" v-model="rec.line_id"></lines>
  <form-text label="Permissions" v-model="rec.permissions"></form-text>
  <form-text label="SIP URI" v-model="rec.uri"></form-text>
  <form-text label="Caller Id Number" v-model="rec.caller_id_number"></form-text>
  <form-text label="Ring timeout" v-model="rec.ring_timeout"></form-text>
  <form-text label="Suspend time" v-model="rec.suspend_time"></form-text>
  <form-text label="Max missed calls (auto release)" v-model="rec.max_ring_fails"></form-text>
  <form-select-bool label="Reset missed calls on success" v-model="rec.reset_rings_fails"></form-select-bool>
  <form-text label="Auto logout" v-model="rec.autologout"></form-text>
  <form-bool label="Persistent" v-model="rec.persistent"></form-bool>
  <skills label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
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
      rec: {},
      skills: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_agent', 'get', [this.id])
        this.skills = this.object2list(this.rec.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2object(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_agent', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_agent', 'create', [this.rec])
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
    onCancel: async function () {
      this.$router.push('/admin/agents')
    },
  },
  created () {
    this.query()
  }
}
</script>
