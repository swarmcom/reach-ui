<template>
<div class="form">
  <form-text label="Name" v-model="agent_group.name"></form-text>
  <lines label="Line Out" v-model="agent_group.line_id"></lines>
  <form-text label="Permissions" v-model="agent_group.permissions"></form-text>
  <form-text label="Ring timeout" v-model="agent_group.ring_timeout"></form-text>
  <form-text label="Max number of unanswered calls before unavailable" v-model="agent_group.max_ring_fails"></form-text>
  <form-text label="Auto logout" v-model="agent_group.autologout"></form-text>
  <skills label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../../Widget/FormText.vue'
import Skills from '../../Widget/Skills.vue'
import Lines from '../../Widget/Lines.vue'
import Common from '../Common'

export default {
  name: 'admin-agent-group',
  props: ['id'],
  mixins: [Common],
  components: { 'form-text': FormText, 'skills': Skills, 'lines': Lines, },
  data () {
    return {
      agent_group: {},
      skills: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.agent_group = await this.$agent.p_mfa('ws_admin', 'get_agent_group', [this.id])
        this.skills = this.object2list(this.agent_group.skills)
      }
    },
    onCommit: async function () {
      try {
        this.agent_group.skills = this.list2object(this.skills)
        if (this.id) {
          await this.$agent.p_mfa('ws_admin', 'update_agent_group', [this.id, this.agent_group])
        } else {
          await this.$agent.p_mfa('ws_admin', 'create_agent_group', [this.agent_group])
        }
        this.$router.push('/admin/agent_groups')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_agent_group', [this.id])
        this.$router.push('/admin/agent_groups')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>