<template>
<div class="form">
  <form-text label="Login" v-model="agent.login"></form-text>
  <form-text label="Password" v-model="agent.password"></form-text>
  <form-text label="First name" v-model="agent.firstname"></form-text>
  <form-text label="Last name" v-model="agent.lastname"></form-text>
  <profiles label="Profile" v-model="agent.group_id"></profiles>
  <form-text label="Permissions" v-model="agent.permissions"></form-text>
  <form-text label="SIP URI" v-model="agent.uri"></form-text>
  <form-text label="Ring timeout" v-model="agent.ring_timeout"></form-text>
  <form-text label="Max rings" v-model="agent.max_ring_fails"></form-text>
  <form-text label="Auto logout" v-model="agent.autologout"></form-text>
  <skills label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Profiles from '../Widget/Profiles.vue'
import Skills from '../Widget/Skills.vue'
import Common from './Common'

export default {
  name: 'admin-agent',
  components: { 'form-text': FormText, 'profiles': Profiles, 'skills': Skills },
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
        this.agent = await this.$agent.p_mfa('ws_admin', 'get_agent', [this.id])
        this.skills = this.object2list(this.agent.skills)
      }
    },
    onCommit: async function () {
      this.agent.skills = this.list2object(this.skills)
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'update_agent', [this.id, this.agent])
      } else {
        await this.$agent.p_mfa('ws_admin', 'create_agent', [this.agent])
      }
      this.$router.push('/admin/agents')
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_agent', [this.id])
        this.$router.push('/admin/agents')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>