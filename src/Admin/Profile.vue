<template>
<div class="form">
  <form-text label="Name" v-model="profile.name"></form-text>
  <form-text label="Permissions" v-model="profile.permissions"></form-text>
  <form-text label="Ring timeout" v-model="profile.ring_timeout"></form-text>
  <form-text label="Max rings" v-model="profile.max_ring_fails"></form-text>
  <form-text label="Auto logout" v-model="profile.autologout"></form-text>
  <skills label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Skills from '../Widget/Skills.vue'
import Common from './Common'

export default {
  name: 'admin-profile',
  props: ['id'],
  mixins: [Common],
  components: { 'form-text': FormText, 'skills': Skills },
  data () {
    return {
      profile: {},
      skills: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.profile = await this.$agent.p_mfa('ws_admin', 'get_profile', [this.id])
        this.skills = this.object2list(this.profile.skills)
      }
    },
    onCommit: async function () {
      this.profile.skills = this.list2object(this.skills)
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'update_profile', [this.id, this.profile])
      } else {
        await this.$agent.p_mfa('ws_admin', 'create_profile', [this.profile])
      }
      this.$router.push('/admin/profiles')
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_profile', [this.id])
        this.$router.push('/admin/profiles')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>