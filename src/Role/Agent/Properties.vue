<template>
<div v-access:profile-ui class="form">
  <form-text v-access:agent-profile-edit-name label="Agent Name" v-model="rec.name"></form-text>
  <form-text label="Login" v-model="rec.login"></form-text>
  <form-text v-access:agent-profile-edit-password label="Password" v-model="rec.password"></form-text>
  <profile-agent-groups label="Agent Group" v-model="rec.group_id"></profile-agent-groups>
  <profile-release-groups label="Release Group" v-model="rec.release_group_id" :effective="eff.release_group_id"></profile-release-groups>
  <profile-lines v-access:agent-profile-edit-line-out label="Line Out" v-model="rec.line_id"></profile-lines>
  <form-text v-access:agent-profile-edit-primary-sip label="Primary Contact" v-model="rec.uri"></form-text>
  <uris v-access:agent-profile-edit-additional-sip label="Additional Contacts" v-model="rec.uris"></uris>
  <form-text label="Agent Caller ID Number" v-model="rec.caller_id_number"></form-text>
  <form-text v-access:agent-profile-edit-ring-timeout label="Ring Timeout" v-model="rec.ring_timeout" :effective="eff.ring_timeout"></form-text>
  <form-text label="Suspend Time" v-model="rec.suspend_time"></form-text>
  <form-text v-access:agent-profile-edit-max-missed-calls label="Max Missed Calls (auto release)" v-model="rec.max_ring_fails" :effective="eff.max_ring_fails"></form-text>
  <form-select-bool v-access:agent-profile-edit-max-ring-success label="Reset Max Rings On Success" v-model="rec.reset_rings_fails" :effective="eff.reset_rings_fails"></form-select-bool>
  <form-text v-access:agent-profile-edit-autologout label="Auto Logout" v-model="rec.autologout" :effective="eff.autologout"></form-text>
  <form-file v-access:agent-profile-edit-avatar label="Avatar" uri="/avatar" v-model="rec.avatar" :fileType="'image/*'"></form-file>
  <form-tags v-access:agent-profile-edit-agent-skills label="Agent Skills" effective_label="Agent Inherited Skills" placeholder="Skill..." v-model="skills" :effective="effective_skills"></form-tags>
  <div style="margin-top:20px">
    <button @click="onCommit" class="btn btn-primary pointer">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary  float-right pointer">Cancel</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import URIs from '@/Widget/URIs'
import FormTextEffective from '@/Widget/FormTextEffective'
import ProfileAgentGroups from '@/Agent/Profile/Agent/Groups'
import ProfileReleaseGroups from '@/Agent/Profile/Release/Groups'
import ProfileLines from '@/Agent/Profile/Lines'

export default {
  name: 'agent-properties',
  components: {
    uris: URIs,
    'form-text-effective': FormTextEffective,
    'profile-agent-groups': ProfileAgentGroups,
    'profile-release-groups': ProfileReleaseGroups,
    'profile-lines': ProfileLines
  },
  mixins: [Common],
  data () {
    return {
      rec: {},
      eff: {},
      skills: [],
      effective_skills: []
    }
  },
  methods: {
    query: async function () {
      this.rec = await this.$agent.p_mfa('ws_agent', 'get', [])
      this.eff = await this.$agent.p_mfa('ws_agent', 'effective', [])
      this.skills = this.skills2list(this.rec.skills)
      this.effective_skills = this.skills2list(this.eff.skills)
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        await this.$agent.p_mfa('ws_agent', 'update', [this.rec])
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onCancel () {
      this.$router.go(-1)
    }
  },
  created () {
    this.query()
  }
}
</script>
