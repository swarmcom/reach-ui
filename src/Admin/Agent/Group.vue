<template>
<div class="form">
  <form-text label="Agent Group Name" v-model="rec.name"></form-text>
  <release-groups label="Release Group" v-model="rec.release_group_id"></release-groups>
  <lines label="Line Out" v-model="rec.lines_out"></lines>
  <roles label="Role" v-model="rec.role_id"></roles>
  <form-number label="Ring Timeout" v-model="rec.ring_timeout"></form-number>
  <form-number label="Suspend Time" v-model="rec.suspend_time"></form-number>
  <form-number label="Auto Logout" v-model="rec.autologout"></form-number>
  <form-number label="Max Missed Calls (auto release)" v-model="rec.max_ring_fails"></form-number>
  <form-select-bool label="Reset Max Rings On Success" v-model="rec.reset_rings_fails"></form-select-bool>
  <line-outs label="Lines Out" v-model="rec.lines"></line-outs>
  <tag-group label="Skills Group" v-model="rec.tag_group_id"></tag-group>
  <form-tags placeholder="Skill..." label="Skills" v-model="skills"></form-tags>

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
import LineOuts from '@/Widget/LineOuts'

export default {
  name: 'admin-agent-group',
  props: ['id'],
  mixins: [Common],
  components: { 'line-outs': LineOuts },
  data () {
    return {
      rec: {},
      module: 'ws_db_agent_group',
      skills: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_agent_group', 'get', [this.id])
        this.skills = this.skills2list(this.rec.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_agent_group', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_agent_group', 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_agent_group', 'delete', [this.id])
        this.$router.go(-1)
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
  },
  created () {
    this.query()
  }
}
</script>
