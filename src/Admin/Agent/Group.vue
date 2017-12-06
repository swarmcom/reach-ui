<template>
<div class="form">
  <form-text label="Agent Group Name" v-model="rec.name"></form-text>
  <release-groups label="Release Group" v-model="rec.release_group_id"></release-groups>
  <roles label="Role" v-model="rec.role_id"></roles>
  <form-text label="Ring Timeout" v-model="rec.ring_timeout"></form-text>
  <form-text label="Suspend Time" v-model="rec.suspend_time"></form-text>
  <form-text label="Auto Logout" v-model="rec.autologout"></form-text>
  <form-text label="Max Missed Calls (auto release)" v-model="rec.max_ring_fails"></form-text>
  <form-select-bool label="Reset Max Rings On Success" v-model="rec.reset_rings_fails"></form-select-bool>
  <tag-group label="Skills Group" v-model="rec.tag_group_id"></tag-group>
  <skills label="Skills" v-model="skills"></skills>

  <div style="margin-top:20px">
    <button @click="onCommit" class="btn btn-primary pointer">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary pointer">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right pointer">Delete</button>
  </div>

  <help></help>
</div>
</template>

<script>
import Common from '@/Admin/Common'

export default {
  name: 'admin-agent-group',
  props: ['id'],
  mixins: [Common],
  data () {
    return {
      rec: {},
      module: 'ws_db_agent_group',
      redirect: '/admin/agent_groups',
      skills: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_agent_group', 'get', [this.id])
        this.skills = this.object2list(this.rec.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2object(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_agent_group', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_agent_group', 'create', [this.rec])
        }
        this.$router.push(this.redirect)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_agent_group', 'delete', [this.id])
        this.$router.push(this.redirect)
      }
    },
    onCancel: async function () {
      this.$router.push(this.redirect)
    },
  },
  created () {
    this.query()
  }
}
</script>
